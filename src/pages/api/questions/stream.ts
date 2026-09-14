/** The live feed the workshop page listens to (MM-84): server-sent events, one
 *  connection per person in the room, held open for the length of a talk.
 *
 *  D1 has no change feed, so this polls — every two seconds, and only for four
 *  numbers (questions.ts, questionsVersion) plus the two switches. The list of
 *  questions itself is read and sent only when those numbers say it changed, so
 *  a quiet room costs two tiny queries every two seconds per listener and
 *  nothing else.
 *
 *  Two events. `state` carries the two switches and whether this listener is the
 *  host, so the page knows whether to show the ask form, the registration form
 *  and the cover buttons. `questions` carries the whole list, because it is tens
 *  of rows and a diff would be more code than it saves. Both are sent once as
 *  soon as the connection opens, so a page that has just loaded is current
 *  without waiting for the first tick.
 *
 *  A connection is capped at thirty minutes and then closed; EventSource
 *  reconnects on its own, which is also what keeps a worker from holding a
 *  stream open for a browser tab someone forgot. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { isHost } from '../../../lib/host';
import { listQuestions, questionsVersion } from '../../../lib/questions';
import { readState, stateVersion } from '../../../lib/state';

export const prerender = false;

/** How often D1 is asked whether anything changed. */
const POLL_MS = 2000;
/** How long the connection may be silent before a comment line is sent to keep
 *  it from being dropped by a proxy in between. */
const PING_MS = 20000;
/** How long one connection lives before it is closed and reconnected. */
const MAX_MS = 30 * 60 * 1000;

const frame = (event: string, data: unknown): string =>
  `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;

export const GET: APIRoute = async ({ request }) => {
  const env = workerEnv as WorkerEnv;
  const db = env.DB;
  if (!db) {
    return new Response('The question feed is unavailable.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });
  }

  // Read once, when the connection opens: the cookie cannot change under a
  // connection that is already running.
  const host = await isHost(request, env);

  const encoder = new TextEncoder();
  const signal = request.signal;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;

      const send = (text: string): void => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          // The reader is gone; the loop notices on its next turn.
          closed = true;
        }
      };

      const close = (): void => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          // Already closed by the runtime when the client went away.
        }
      };

      /** A wait that ends early when the listener leaves, so a closed tab does
       *  not keep a worker alive for another two seconds. */
      const sleep = (ms: number): Promise<void> =>
        new Promise((resolve) => {
          let timer: ReturnType<typeof setTimeout>;
          const done = (): void => {
            clearTimeout(timer);
            signal.removeEventListener('abort', done);
            resolve();
          };
          timer = setTimeout(done, ms);
          signal.addEventListener('abort', done);
        });

      // Not awaited: start() has to return so the response can begin.
      void (async () => {
        const deadline = Date.now() + MAX_MS;
        let quietSince = Date.now();

        try {
          let state = await readState(db);
          let version = await questionsVersion(db);
          send(frame('state', { ...state, host }));
          send(frame('questions', await listQuestions(db)));

          while (!closed && !signal.aborted && Date.now() < deadline) {
            await sleep(POLL_MS);
            if (closed || signal.aborted) break;

            const nextState = await readState(db);
            if (stateVersion(nextState) !== stateVersion(state)) {
              state = nextState;
              send(frame('state', { ...state, host }));
              quietSince = Date.now();
            }

            const nextVersion = await questionsVersion(db);
            if (nextVersion !== version) {
              version = nextVersion;
              send(frame('questions', await listQuestions(db)));
              quietSince = Date.now();
            }

            if (Date.now() - quietSince >= PING_MS) {
              send(': ping\n\n');
              quietSince = Date.now();
            }
          }
        } catch (error) {
          console.error('[questions/stream] database error', error);
        }

        close();
      })();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store',
    },
  });
};
