/** The one link that makes a browser the host's (MM-84). Mladen opens
 *  /api/host/?key=<HOST_KEY> once on the machine he presents from; the answer
 *  leaves the cookie behind and sends him to the workshop page, where the cover
 *  buttons are now his to press.
 *
 *  A GET with the secret in the query string is the smallest thing that works
 *  from a phone on a lectern, and the cost is understood: the key is in that
 *  browser's history. It is a workshop-day secret, rotated by setting the Worker
 *  secret again, and it unlocks nothing but a checkbox on a list of questions.
 *  A wrong or missing key is a 403 that says nothing more. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { workshop } from '../../data/workshop';
import { hostCookie, hostToken, sameSecret } from '../../lib/host';

export const prerender = false;

const TARGET = `${workshop.path}#questions`;

export const GET: APIRoute = async ({ request }) => {
  const env = workerEnv as WorkerEnv;
  const key = env.HOST_KEY ?? '';
  const given = new URL(request.url).searchParams.get('key') ?? '';

  const refuse = (): Response =>
    new Response('No.', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
    });

  // An unset HOST_KEY means there is no host, rather than a host anyone can be.
  if (key === '' || given === '' || !sameSecret(given, key)) return refuse();

  const token = await hostToken(key);
  if (token === null) return refuse();

  return new Response(null, {
    status: 302,
    headers: {
      Location: TARGET,
      'Set-Cookie': hostCookie(token),
      'Cache-Control': 'no-store',
    },
  });
};
