/** Who is allowed to mark a question answered (MM-84). One person is, and he
 *  proves it by opening /api/host/?key=<HOST_KEY> once, which leaves a cookie
 *  behind.
 *
 *  The cookie holds no secret and no session id: it is the hex HMAC-SHA256 of
 *  the message "host" under HOST_KEY, so the server can recompute it from the
 *  secret it already has and needs to store nothing. Forging it means knowing
 *  HOST_KEY, which is the same thing as being the host. There is no expiry
 *  inside the value — the cookie's own Max-Age is a week, which outlasts a
 *  workshop by plenty and is short enough for a laptop left on a lectern.
 *
 *  WebCrypto is a global in workerd and in node 20 and up, so this module runs
 *  in both without an import. */

export const HOST_COOKIE = 'mm_host';

/** A week. Long enough that the link is opened once on the morning of the
 *  workshop; short enough that it is not a standing key. */
export const HOST_COOKIE_MAX_AGE = 604800;

/** Only the one secret is read here, so the parameter is typed structurally and
 *  a test can pass a plain object. */
export interface HostEnv {
  HOST_KEY?: string;
}

/** Anything with a Headers-shaped get(), which is both a real Request and the
 *  smallest stand-in a test needs. */
export interface RequestLike {
  headers: { get(name: string): string | null };
}

const hex = (buffer: ArrayBuffer): string =>
  [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

/** The cookie value for a key, or null when there is no key — an empty or
 *  missing HOST_KEY means nobody is the host, rather than everybody. */
export async function hostToken(key: string | undefined): Promise<string | null> {
  if (!key) return null;
  const encoder = new TextEncoder();
  const secret = await crypto.subtle.importKey(
    'raw',
    encoder.encode(key),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return hex(await crypto.subtle.sign('HMAC', secret, encoder.encode('host')));
}

/** Comparison that does not give the answer away by how long it takes. Both
 *  values are strings of the same alphabet, so comparing code units is enough. */
export function sameSecret(given: string, expected: string): boolean {
  if (given.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < given.length; index += 1) {
    difference |= given.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
}

/** One cookie out of a Cookie header. Null when the header or the cookie is
 *  missing. */
export function readCookie(header: string | null | undefined, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(';')) {
    const equals = part.indexOf('=');
    if (equals === -1) continue;
    if (part.slice(0, equals).trim() === name) return part.slice(equals + 1).trim();
  }
  return null;
}

/** The Set-Cookie value /api/host/ answers with. Secure is kept even in local
 *  work: browsers treat http://localhost as a secure context, so the cookie is
 *  still set there. */
export const hostCookie = (token: string): string =>
  `${HOST_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${HOST_COOKIE_MAX_AGE}`;

/** Is this request the host's? False whenever anything is missing, including
 *  the secret itself. */
export async function isHost(request: RequestLike, env: HostEnv): Promise<boolean> {
  const expected = await hostToken(env.HOST_KEY);
  if (expected === null) return false;
  const given = readCookie(request.headers.get('Cookie'), HOST_COOKIE);
  if (given === null) return false;
  return sameSecret(given, expected);
}
