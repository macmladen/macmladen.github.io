// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

// https://astro.build/config
export default defineConfig({
  site: 'https://macmladen.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    inlineStylesheets: 'always',
  },
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [
    sitemap({
      // Pages only. Anything that is not a trailing-slash URL (files such as
      // /robots.txt or /og.png) is dropped, and so is /api/, which is a form's
      // POST target rather than a page anyone should be sent to.
      serialize(item) {
        if (!item.url.endsWith('/')) return undefined;
        if (new URL(item.url).pathname.startsWith('/api/')) return undefined;
        return item;
      },
    }),
    robotsTxt({
      sitemap: 'https://macmladen.com/sitemap-index.xml',
      policy: [{ userAgent: '*', allow: '/' }],
    }),
  ],
});
