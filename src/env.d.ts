/// <reference path="../.astro/types.d.ts" />

/** What the registration endpoint reads off the Cloudflare runtime. The D1
 *  binding is typed structurally in src/lib/registrations.ts, so no Cloudflare
 *  types package is needed for these few uses. */
interface WorkerEnv {
  DB?: import('./lib/registrations').D1Like;
  MAILERLITE_API_KEY?: string;
  MAILERLITE_GROUP_ID?: string;
  TURNSTILE_SECRET?: string;
  IP_HASH_SALT?: string;
}

declare namespace App {
  interface Locals {
    runtime?: {
      env: WorkerEnv;
    };
  }
}

interface ImportMetaEnv {
  /** Turnstile site key, baked into the page at build time. */
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}
