/** Marking a question answered, and taking the mark off again (MM-84). The host
 *  presses it from the stage; the stream carries the change to every other
 *  screen in the room within two seconds.
 *
 *  The host cookie is the whole authorisation: no cookie, no change, and the
 *  answer says nothing about which question it was. Astro's origin check applies
 *  to this route as it does to the other form targets. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { workshop } from '../../../data/workshop';
import { isHost } from '../../../lib/host';
import { setCovered } from '../../../lib/questions';

export const prerender = false;

const BACK = `${workshop.path}#questions`;
const noStore = { 'Cache-Control': 'no-store' } as const;

const wantsJson = (request: Request): boolean =>
  request.headers.get('X-Requested-With') === 'fetch';

const plain = (body: string, status: number): Response =>
  new Response(body, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', ...noStore },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = workerEnv as WorkerEnv;
  if (!(await isHost(request, env))) return plain('Not yours to mark.', 403);

  const db = env.DB;
  if (!db) return plain('The question feed is unavailable.', 503);

  const form = await request.formData();
  const raw = form.get('id');
  const id = Number.parseInt(typeof raw === 'string' ? raw : '', 10);
  if (!Number.isInteger(id) || id <= 0) return plain('That is not a question id.', 422);

  // Anything that is not '1' takes the mark off, so a missing field is the
  // safe direction rather than a silent cover.
  const covered = form.get('covered') === '1';

  try {
    await setCovered(db, id, covered);
  } catch (error) {
    console.error('[questions/cover] database error', error);
    return plain('The question feed is unavailable.', 503);
  }

  if (wantsJson(request)) return new Response(null, { status: 204, headers: { ...noStore } });
  return new Response(null, { status: 303, headers: { Location: BACK, ...noStore } });
};
