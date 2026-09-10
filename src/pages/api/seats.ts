/** How many working seats are left, as JSON, for the workshop page's script to
 *  read (MM-71). The page itself is static and cached; this is the one number on
 *  it that has to be current, so it is fetched after the page has loaded and
 *  never cached.
 *
 *  A .ts route rather than an .astro one, unlike /api/register/ and
 *  /api/contact/: there is nothing to render here, only three numbers. Because
 *  trailingSlash is 'always' the route is /api/seats/, which is what the script
 *  asks for.
 *
 *  GET only. A missing binding or a database that will not answer is a 503 with
 *  no numbers in it: the page then keeps the static line it was built with,
 *  which is true even when this endpoint is not. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { workshop } from '../../data/workshop';
import { readSeats } from '../../lib/registrations';

export const prerender = false;

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });

export const GET: APIRoute = async () => {
  const env = workerEnv as WorkerEnv;
  const db = env.DB;
  if (!db) return json({ error: 'unavailable' }, 503);

  try {
    return json(await readSeats(db, workshop.capacity), 200);
  } catch (error) {
    console.error('[seats] database error', error);
    return json({ error: 'unavailable' }, 503);
  }
};
