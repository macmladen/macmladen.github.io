/// <reference path="../.astro/types.d.ts" />

/** What the two form endpoints read off the Cloudflare runtime. The D1 binding
 *  is typed structurally in src/lib/registrations.ts, so no Cloudflare types
 *  package is needed for these few uses; both endpoints share the one binding. */
interface WorkerEnv {
  DB?: import('./lib/registrations').D1Like;
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
  MAILERSEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  IP_HASH_SALT?: string;
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
