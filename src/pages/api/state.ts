/** The two switches, flipped from the room (MM-87). Until now both lived only
 *  at the end of a `wrangler d1 execute` line, which means a terminal logged in
 *  to Cloudflare while standing at a lectern; this is the same two writes behind
 *  the host cookie, so the host bar on the workshop page can do it in one tap
 *  and the stream carries the change to every screen within two seconds.
 *
 *  Two methods, because there are two hands. POST is what the bar sends, with
 *  the fields in a FormData; GET takes the same two values out of the query
 *  string, so a link bookmarked on the iPad works from the home screen with no
 *  page to load first. Both need the host cookie and nothing else — the same
 *  authorisation as /api/questions/cover/, and the same silence on refusal.
 *
 *  GET that writes is not REST, and it is chosen deliberately: the alternative
 *  on a lectern is a page with a form on it, and a bookmark that does the thing
 *  is worth more here than the method's good name. Nothing else follows these
 *  links — they need a cookie no crawler has — and the write is idempotent. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { workshop } from '../../data/workshop';
import { isHost } from '../../lib/host';
import { readStateChange, setState, type StateSource } from '../../lib/state';

export const prerender = false;

const BACK = `${workshop.path}#questions`;
const noStore = { 'Cache-Control': 'no-store' } as const;

const plain = (body: string, status: number): Response =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...noStore },
  });

const back = (): Response =>
  new Response(null, { status: 303, headers: { Location: BACK, ...noStore } });

/** Everything both methods do, once the fields have been found wherever that
 *  method keeps them. `quiet` is the bar's own path: it has the answer already
 *  from the stream and wants nothing back. */
const flip = async (request: Request, source: StateSource, quiet: boolean): Promise<Response> => {
  const env = workerEnv as WorkerEnv;
  if (!(await isHost(request, env))) return plain('Not yours to flip.', 403);

  const db = env.DB;
  if (!db) return plain('The question feed is unavailable.', 503);

  const change = readStateChange(source);
  if (change === null) return plain('That is not one of the two switches.', 422);

  try {
    await setState(db, change.key, change.value);
  } catch (error) {
    console.error('[state] database error', error);
    return plain('The question feed is unavailable.', 503);
  }

  return quiet ? new Response(null, { status: 204, headers: { ...noStore } }) : back();
};

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  return flip(request, form, request.headers.get('X-Requested-With') === 'fetch');
};

/** The bookmarked link. Always a redirect back to the workshop page, whoever is
 *  asking: a browser followed a link, so it should land somewhere. */
export const GET: APIRoute = async ({ request }) =>
  flip(request, new URL(request.url).searchParams, false);
