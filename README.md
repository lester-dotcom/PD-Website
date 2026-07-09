# Pratt Digital Website

Rebuild of prattdigital.com off WordPress. Astro (static output) + Tailwind + Decap CMS for blog editing.

## Local development

```sh
npm install
npm run dev       # http://localhost:4321
npm run build      # outputs to ./dist
npm run preview    # serve the production build locally
```

## Project structure

```
src/
  assets/          logos, favicon source
  components/      Header, Footer, PageHero, CtaBanner
  content/blog/     blog posts (markdown, edited via Decap CMS or directly)
  content.config.ts blog collection schema
  layouts/
    BaseLayout.astro  SEO meta, JSON-LD Organization schema, Open Graph/Twitter cards
  pages/
    index.astro, about-us.astro, contact-us.astro, for-agencies.astro,
    training-and-workshops.astro
    paid-search/      index + google-ads + microsoft-ads
    paid-social/       index + meta + linkedin + pinterest + other-channels
    blog/               index + [id] (dynamic post route)
    rss.xml.js          RSS feed
public/
  admin/            Decap CMS (config.yml + index.html)
```

## What still needs doing before launch

1. **Replace placeholder copy.** Every page has real, on-brand copy but it's a first draft written without the final approved wording. Swap in anything from the "2024 Website Copy" Google Docs you want kept.
2. **Replace placeholder contact details.** `hello@prattdigital.com` and the footer's "Registered in England & Wales" line are placeholders. Put the real email/company details in `src/components/Footer.astro` and `src/pages/contact-us.astro`.
3. **Add a real Organization address/phone to the JSON-LD schema** in `src/layouts/BaseLayout.astro` if you want it, currently omitted rather than guessed.
4. **Push to GitHub**, then connect the repo to Netlify (or your host of choice) for CI deploys.
5. **Enable Netlify Identity + Git Gateway** on the Netlify site once deployed, so `/admin` (Decap CMS) can authenticate. Until then `/admin` will load but won't be able to save changes.
6. **Point DNS** at Netlify once you're happy with the site, then retire the WordPress install.

## Editing content

- **Blog posts**: go to `yoursite.com/admin` once Netlify Identity is set up, or just add a new `.md` file to `src/content/blog/` directly (frontmatter fields: `title`, `description`, `pubDate`, `tags`, `draft`).
- **Page copy**: currently lives directly in each `.astro` file under `src/pages/`. Editing text there requires a code change (not yet wired into the CMS). If you want static page copy editable through Decap CMS too, that's a follow-up piece of work.

## Brand

- Colors: `--color-brand-green` (#AEC90B), `--color-brand-slate` (#4C565C), defined in `src/styles/global.css`.
- Font: Roboto (loaded from Google Fonts in `BaseLayout.astro`), Arial fallback.
- Logo/favicon sourced from `Pratt-Digital_Brand-Identity/` and `Website 2024/Social Media Favicons/` in Drive.
