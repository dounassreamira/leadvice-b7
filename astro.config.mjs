// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Pages exclues du plan du site : outils internes, landing pages publicitaires, merci, admin.
const HORS_PLAN = ['/dev/', '/lp/', '/diagnostic/merci/', '/diagnostic/rendez-vous/', '/admin/', '/404'];

export default defineConfig({
  site: 'https://leadvice.org',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !HORS_PLAN.some((p) => new URL(page).pathname.startsWith(p)),
      i18n: undefined,
    }),
  ],
  vite: {
    build: { assetsInlineLimit: 2048 },
  },
});
