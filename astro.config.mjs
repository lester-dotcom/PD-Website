// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import hiddenPagesRedirects from './integrations/hidden-pages-redirects.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.prattdigital.com',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [sitemap(), hiddenPagesRedirects()]
});