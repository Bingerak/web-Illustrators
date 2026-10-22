# TENING BORIS — Portfolio website

**Live preview:** https://bingerak.github.io/web-Illustrators/

GitHub Pages serves this repo from `main` (root). The root `index.html` forwards to `preview/`, a relative-link build of the site. The workflow in `.github/workflows/pages.yml` rebuilds `preview/` automatically whenever `src/` or `build.mjs` changes. To rebuild it by hand: `OUT_DIR=preview PREVIEW=1 node build.mjs`. The contact form cannot send from GitHub Pages; deploy to Netlify for the real site.

A fast, accessible, multi-page portfolio for **TENING BORIS, Frontend Developer in Yaoundé, Cameroon**.
Static HTML generated from one content file by a zero-dependency Node script. No framework, no database, nothing to patch.

**Tested results (Lighthouse 12, local server):** Performance 98–100 · Accessibility 100 · Best Practices 100 · SEO 100, mobile and desktop. CLS 0 on every page.

---

## 1. Quick start

Requires Node.js 18 or newer. There are no packages to install.

```bash
node build.mjs                        # builds the production site into dist/
npx serve dist                        # or: python3 -m http.server -d dist 8080
```

Open http://localhost:8080. (The contact form only *sends* once deployed on Netlify; locally it shows its error state with a WhatsApp fallback, which is the intended behaviour.)

`PREVIEW=1 node build.mjs` builds `dist-preview/`, a copy with relative links that opens from any folder or file host.

## 2. Deploy (recommended: Netlify, free)

Netlify hosts the current webillustrators site, gives free HTTPS, and receives the contact form with no server code.

1. Push this folder to a GitHub repository (or drag the folder into Netlify's "Deploy manually" area after running `node build.mjs` and dropping `dist/`).
2. In Netlify: **Add new site → Import from Git**. Netlify reads `netlify.toml` automatically (build command `node build.mjs`, publish folder `dist`).
3. Open `netlify.toml` and set `SITE_URL` to your real domain (currently `https://webillustrators.online`). This controls canonical URLs, the sitemap, Open Graph and structured data.
4. **Domain:** Site settings → Domain management → add your domain and follow the DNS steps.
5. **Contact form:** see section 3.
6. Submit `https://YOURDOMAIN/sitemap.xml` in Google Search Console.

Other static hosts (Cloudflare Pages, Vercel, GitHub Pages) also work for the pages. The form then needs another endpoint (section 3).

## 3. Contact form

The form (`/contact/`) is wired for **Netlify Forms**:

- Netlify detects the form named `project-enquiry` at deploy time; no keys or secrets are needed, so nothing sensitive is in the code.
- Spam protection: a hidden honeypot field (`company_website`) plus Netlify's built-in spam filter. You can add reCAPTCHA later in Netlify's form settings.
- **Turn on email notifications:** Netlify → Site → Forms → Form notifications → Add notification → Email → `teningboris01@gmail.com`.
- With JavaScript the form validates inline, submits in the background and shows a thank-you panel. Without JavaScript it posts normally and lands on `/contact/thanks/`.
- If a submission fails, the visitor keeps what they typed and gets a one-tap WhatsApp link with their message pre-filled, plus your email.
- Visitors can also skip the form: "Send via WhatsApp instead" opens WhatsApp with their details pre-filled.

**Not on Netlify?** Use Formspree, Web3Forms or Getform: create a form there, then in `build.mjs` change the form's `action` to the endpoint URL they give you and remove `data-netlify` / `netlify-honeypot`. Keep any secret key on the provider's side, never in the HTML.

## 4. Editing content

All text lives in two files:

| File | What's in it |
|---|---|
| `src/content/site.mjs` | Contact details, headline, proof points, services, projects, experience, skills, process, FAQ, page titles and meta descriptions |
| `src/content/insights.mjs` | The three Insights articles |

Edit, run `node build.mjs`, redeploy. Common edits:

- **Phone, WhatsApp, email, LinkedIn:** the `site` object at the top of `site.mjs`.
- **Add a project:** add an entry to `projects`, and put the screenshot in `src/assets/img/` as `<slug>-640/1200/1340.webp` and `.jpg` (a 1340 × 600 crop of the homepage). Its case-study page, card, sitemap entry and structured data are generated automatically.
- **Add testimonials:** none are shown yet (see section 6). Once you have permission, a testimonials block can be added to `homePage()` in `build.mjs`.

**French version later:** copy `site.mjs` to `site.fr.mjs`, translate the values, and build a second pass into `dist/fr/` with `hreflang` tags. The templates already take every string from the content file, so no layout code changes.

## 5. Project structure

```
build.mjs                  page templates + generator (layout, components, SEO, sitemap)
netlify.toml               build settings, caching and security headers
src/content/site.mjs       all site copy and data
src/content/insights.mjs   articles
src/assets/css/styles.css  design system (tokens, components, responsive rules)
src/assets/js/main.js      menu, scroll reveal, project filter, form (~4 KB, no libraries)
src/assets/img/            optimised WebP + JPEG images in several sizes
src/assets/fonts/          self-hosted Bricolage Grotesque + Instrument Sans (SIL OFL)
src/static/                favicon, app icons, web manifest
docs/SOURCE-OF-TRUTH.md    where every fact on the site comes from
docs/WORDPRESS-NOTES.md    how to move this design into WordPress
dist/                      built site (generated, do not edit)
```

## 6. Information to confirm before launch

These are on the site but came from sources that disagree or are dated. Please check each one.

1. **Phone and WhatsApp:** confirmed as **+237 682 380 446** for both (22 Oct 2026).
2. **LinkedIn URL.** The brief gave `linkedin.com/in/tening-boris-189b54226`; your resume and old site use `linkedin.com/in/boris-tening-189b54226`. The site uses the resume version. LinkedIn blocked automated access, so neither could be checked.
3. **Domain.** Canonical URLs use `https://webillustrators.online` (from your resume). Change `SITE_URL` if the site will live elsewhere.
4. **"25% increase in client retention"** appears in the Experience section exactly as stated on your resume. Keep it only if you can explain how it was measured if a client asks.
5. **Your role on each project.** Every case study says "Project lead within the Highupweb team: coordinated delivery and built the frontend", based on your old site's "project led by me" credit. Adjust per project if your role differed.
6. **Client websites are still live.** The links could not be opened from the build environment. Please click each "Visit website" link once.
7. **Insights articles** are written in your voice. Read them and edit anything that does not sound like you before publishing.
8. **Budget ranges** on the contact form (FCFA with approximate USD) are suggestions; adjust to your pricing.
9. **"Available for freelance projects and remote roles"** in the hero. Remove it in `site.mjs` when you are booked.

10. **New projects (Ebikes&Gear, AfrikLink Digital, AMZ Star Pallets, Women Growing Together)** are labelled "Freelance project" and "Web developer". BNCA-USA is labelled "Highupweb, 2023" because its footer credits Highupweb. Correct these in `src/content/site.mjs` if your role or the context was different, and add specifics (what you built, when) to each `role` line.

### Deliberately left out (can be added once verified)

- Old-site counters ("67 projects", "45 happy customers", "03 awards", "06+ years") — they conflict with the resume.
- Testimonials — one on the old site was placeholder text; the others need each person's permission to republish.
- US Goat Breeders — no screenshot in the folder, no role credit, and the old link was broken.
- Technologies per project (e.g. WordPress / WooCommerce) — not confirmed, so case studies describe features, not stack.
- Mobile screenshots of the projects — none were available; phone-view captures of each live site would strengthen the case studies.
- Graphic design / branding as a service — mentioned in About only; there are no design samples in the folder yet.

## 7. Quality checks performed

- 16 pages rendered in Chromium at 320, 390, 768, 1366 and 1440 px: no horizontal overflow, no broken images, no console errors.
- 36 internal links and every in-page anchor resolved.
- One `<h1>` per page, no skipped heading levels, every image has `alt`, every control has an accessible name.
- Keyboard: skip link is the first focus stop; mobile menu traps focus, closes with Escape.
- Form: empty submit flags all four required fields and focuses the first; invalid email gets a specific message; failure keeps the data and offers WhatsApp; success shows the thank-you panel.
- Project filter tested, including shareable `?type=` links.
- `prefers-reduced-motion: reduce` shows all content immediately with no animation.

## 8. Licence

- **Code** (`build.mjs`, `src/assets/css`, `src/assets/js`, configuration): Apache License 2.0, see `LICENSE`.
- **Not covered by that licence:** photographs of TENING BORIS, project screenshots, the Web Illustrators logo, and all written content in `src/content/`. These are © TENING BORIS, all rights reserved.
- **Fonts:** Bricolage Grotesque and Instrument Sans, SIL Open Font License 1.1 (`src/assets/fonts/`).
