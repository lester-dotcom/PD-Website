import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { load } from 'js-yaml';

// Maps each CMS page-content slug (src/content/pages/<slug>.yaml) to its live route.
// Kept here rather than derived, since Astro has no generic route<->content mapping
// for named static pages (only for [...slug]-style dynamic routes).
const PAGE_URL_MAP = {
  'about-us': '/about-us',
  'contact-us': '/contact-us',
  'for-agencies': '/for-agencies',
  'paid-search': '/paid-search',
  'paid-search-google-ads': '/paid-search/google-ads',
  'paid-search-microsoft-ads': '/paid-search/microsoft-ads',
  'paid-social': '/paid-social',
  'paid-social-meta': '/paid-social/meta',
  'paid-social-other-platforms': '/paid-social/other-platforms',
  'training-and-workshops': '/training-and-workshops',
  ai: '/ai',
};

export default function hiddenPagesRedirects() {
  let projectRoot;
  return {
    name: 'hidden-pages-redirects',
    hooks: {
      'astro:config:done': ({ config }) => {
        projectRoot = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const outDir = fileURLToPath(dir);
        const rules = [];

        for (const [slug, url] of Object.entries(PAGE_URL_MAP)) {
          const filePath = join(projectRoot, 'src/content/pages', `${slug}.yaml`);
          if (!existsSync(filePath)) continue;
          const data = load(readFileSync(filePath, 'utf8'));
          if (data?.hidden) rules.push(`${url}  /404  404!`);
        }

        const settingsPath = join(projectRoot, 'src/content/settings/site.yaml');
        if (existsSync(settingsPath)) {
          const settings = load(readFileSync(settingsPath, 'utf8'));
          if (settings?.blogVisible === false) {
            rules.push('/blog  /404  404!', '/blog/*  /404  404!');
          }
        }

        if (rules.length === 0) return;

        const redirectsPath = join(outDir, '_redirects');
        const existing = existsSync(redirectsPath) ? readFileSync(redirectsPath, 'utf8') : '';
        const separator = existing && !existing.endsWith('\n') ? '\n' : '';
        writeFileSync(redirectsPath, existing + separator + rules.join('\n') + '\n');
        logger.info(`Wrote ${rules.length} redirect rule(s) for hidden pages to _redirects`);
      },
    },
  };
}
