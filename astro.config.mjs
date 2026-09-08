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
      // Pages only: anything that is not a trailing-slash URL (endpoints,
      // files such as /robots.txt or /og.png) never reaches the sitemap.
      serialize(item) {
        if (!item.url.endsWith('/')) return undefined;
        return item;
      },
    }),
    robotsTxt({
      sitemap: 'https://macmladen.com/sitemap-index.xml',
      policy: [{ userAgent: '*', allow: '/' }],
    }),
  ],
});
