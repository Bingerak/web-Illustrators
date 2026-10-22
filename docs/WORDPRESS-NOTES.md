# Moving this design to WordPress (optional)

This site is **not** a WordPress theme. It is structured so one can be built without rewriting the content.

## Content mapping

| Current source | WordPress equivalent |
|---|---|
| `projects` in `site.mjs` | Custom post type `project` with fields: client, url, category, summary, objective, role, approach (repeater), highlights, screenshot |
| `services` | Custom post type `service` or a "Services" page built from reusable blocks |
| `insights` | Standard Posts (body is already plain HTML) |
| `experience`, `skills`, `education` | ACF options page or a single "About" page with blocks |
| `site` (contact details) | Theme options / Customizer |
| Page titles + descriptions | Yoast SEO or Rank Math fields |

## Sections that should become editable blocks

Hero, proof strip, services list, featured project, timeline, process steps, CTA band, contact card, FAQ (accordion). Each is a self-contained function in `build.mjs` and a self-contained block of CSS in `styles.css`, so each can become a block pattern or a theme template part.

## SEO plugins

Remove the hand-written `<title>`, meta, canonical and Open Graph tags from the header template and let Yoast or Rank Math output them. Keep the Person JSON-LD, or use the plugin's "Person" knowledge-graph setting with the same data.

## Assets and licences

- Photos and project screenshots: owned by TENING BORIS (from the "WebIllustrators website content" folder).
- Fonts: Bricolage Grotesque and Instrument Sans, SIL Open Font License 1.1 (licence files in `src/assets/fonts/`).
- Icons: drawn inline as SVG for this project.
