/** Server-side verification of the Turnstile token the widget puts in the form.
 *  Fails closed: no secret, no token, or anything other than a clear success
 *  from Cloudflare means the submission is rejected. */

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  ip?: string | null,
): Promise<boolean> {
  if (!secret || token === '') return false;

  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);

  try {
    const response = await fetch(SITEVERIFY, { method: 'POST', body });
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}
