/// <reference path="../.astro/types.d.ts" />

/** What the server endpoints read off the Cloudflare runtime. The D1 binding is
 *  typed structurally — no Cloudflare types package is needed for these few
 *  uses — and every endpoint shares the one binding. The shape is the one in
 *  src/lib/questions.ts: src/lib/registrations.ts's D1Like plus all(), which the
 *  question list needs and a single-row read never did. */
interface WorkerEnv {
  DB?: import('./lib/questions').QuestionsDb;
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
  MAILERSEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  IP_HASH_SALT?: string;
  /** The workshop-day secret behind /api/host/ (MM-84). Empty means nobody is
   *  the host and no question can be marked answered. */
  HOST_KEY?: string;
}

/** Astro 6 removed Astro.locals.runtime.env; bindings and secrets come from
 *  the cloudflare:workers module, which workerd provides at runtime. */
declare module 'cloudflare:workers' {
  export const env: WorkerEnv;
}

interface ImportMetaEnv {
  /** Turnstile site key, baked into the page at build time. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}
