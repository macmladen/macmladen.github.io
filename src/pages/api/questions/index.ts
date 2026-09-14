/** Where a question from the room lands (MM-84). POST only, from the small form
 *  on the workshop page.
 *
 *  A .ts endpoint rather than an .astro page, unlike /api/register/ and
 *  /api/contact/: the form is asked and answered on the page itself without
 *  leaving it, so the answer is JSON. The no-script path still has to go
 *  somewhere, and it goes back to the page — or, when something was wrong, to
 *  the plainest possible page saying what. Because trailingSlash is 'always' the
 *  route is /api/questions/, which is what the form's action says.
 *
 *  Astro's origin check applies to this route: a cross-site POST of a form is
 *  refused before this file runs. */
import type { APIRoute } from 'astro';
import { env as workerEnv } from 'cloudflare:workers';
import { workshop } from '../../../data/workshop';
import { hashIp } from '../../../lib/registrations';
import { verifyTurnstile } from '../../../lib/turnstile';
import {
  addQuestion,
  hasErrors,
  messages,
  readQuestionForm,
  validateQuestion,
  type QuestionErrors,
} from '../../../lib/questions';
import { readState } from '../../../lib/state';

export const prerender = false;

/** Where a browser without script is sent afterwards, success or failure. */
const BACK = `${workshop.path}#questions`;

const noStore = { 'Cache-Control': 'no-store' } as const;

/** The page's script sets this header; a plain form submission does not. It is
 *  what decides between JSON and a redirect. */
const wantsJson = (request: Request): boolean =>
  request.headers.get('X-Requested-With') === 'fetch';

const json = (body: unknown, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...noStore },
  });

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** The no-script failure page. Deliberately the plainest thing that can carry
 *  the news: an unstyled document, what went wrong, and the way back. The page
 *  itself is where the form lives, so there is nothing to render twice. */
const errorPage = (errors: QuestionErrors, status: number): Response => {
  const lines = [errors.body, errors.name, errors.form]
    .filter((line): line is string => typeof line === 'string')
    .map((line) => `      <li>${escapeHtml(line)}</li>`)
    .join('\n');

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>The question did not go through</title>
  </head>
  <body>
    <h1>The question did not go through</h1>
    <ul>
${lines}
    </ul>
    <p><a href="${BACK}">Back to the workshop page</a></p>
  </body>
</html>
`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...noStore } },
  );
};

const fail = (request: Request, errors: QuestionErrors, status: number): Response =>
  wantsJson(request) ? json({ ok: false, errors }, status) : errorPage(errors, status);

export const GET: APIRoute = () =>
  new Response('This address only accepts the question form (POST).', {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'text/plain; charset=utf-8' },
  });

export const POST: APIRoute = async ({ request }) => {
  const env = workerEnv as WorkerEnv;
  const db = env.DB;
  if (!db) return fail(request, { form: messages.unavailable }, 503);

  // The switch is read before anything else is spent on the submission: a form
  // posted from a page that was open before questions closed is refused here
  // rather than written down.
  let open = false;
  try {
    open = (await readState(db)).questionsOpen;
  } catch (error) {
    console.error('[questions] state error', error);
    return fail(request, { form: messages.unavailable }, 503);
  }
  if (!open) return fail(request, { form: messages.closed }, 403);

  const form = await request.formData();
  const values = readQuestionForm(form);
  const errors = validateQuestion(values);
  if (hasErrors(errors)) return fail(request, errors, 422);

  const token = form.get('cf-turnstile-response');
  const ip = request.headers.get('CF-Connecting-IP');
  const passed = await verifyTurnstile(
    typeof token === 'string' ? token : '',
    env.TURNSTILE_SECRET,
    ip,
  );
  if (!passed) return fail(request, { form: messages.turnstile }, 422);

  try {
    const id = await addQuestion(db, values, await hashIp(ip, env.IP_HASH_SALT));
    if (wantsJson(request)) return json({ ok: true, id }, 201);
    return new Response(null, { status: 303, headers: { Location: BACK, ...noStore } });
  } catch (error) {
    console.error('[questions] database error', error);
    return fail(request, { form: messages.unavailable }, 503);
  }
};
