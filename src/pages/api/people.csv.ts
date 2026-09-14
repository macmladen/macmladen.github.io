/** The People page's list as a file (MM-89). Same rows, same order, one more
 *  column — `mailerlite_status`, which the page leaves out because thirteen
 *  columns already fill a laptop screen and a spreadsheet does not mind a
 *  fourteenth.
 *
 *  A .ts route rather than an .astro one, like /api/seats/: there is nothing to
 *  render, only a file to hand over. Behind the host cookie, and a visitor
 *  without it gets the same 404 the page gives — a refusal here that differed
 *  from the page's would tell someone poking at the site that both exist.
 *
 *  It re-reads the database rather than taking what the page already had: a
 *  download is its own request, minutes later, and the file should say what is
 *  true when it is saved. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { isHost } from '../../lib/host';
import { listRegistrations, toCsv } from '../../lib/people';

export const prerender = false;

const noStore = { 'Cache-Control': 'no-store' } as const;

const notFound = (): Response =>
  new Response(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found</title></head><body><h1>Not found</h1></body></html>',
    { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', ...noStore } },
  );

export const GET: APIRoute = async ({ request }) => {
  const env = workerEnv as WorkerEnv;
  if (!(await isHost(request, env))) return notFound();

  const db = env.DB;
  if (!db) {
    return new Response('The registration list is unavailable.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...noStore },
    });
  }

  let csv: string;
  try {
    csv = toCsv(await listRegistrations(db));
  } catch (error) {
    console.error('[people.csv] database error', error);
    return new Response('The registration list is unavailable.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', ...noStore },
    });
  }

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="registrations.csv"',
      ...noStore,
    },
  });
};
