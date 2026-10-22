#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Static site generator for tening-boris-portfolio. Zero dependencies.
//   node build.mjs                 -> dist/  (production, clean URLs)
//   PREVIEW=1 node build.mjs       -> dist-preview/ (relative links, works from any folder)
//   SITE_URL=https://example.com node build.mjs
// ---------------------------------------------------------------------------
import { mkdir, rm, writeFile, cp, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import * as C from './src/content/site.mjs';
import { insights } from './src/content/insights.mjs';

const { site } = C;
const PREVIEW = !!process.env.PREVIEW;
const OUT = process.env.OUT_DIR || (PREVIEW ? 'dist-preview' : 'dist');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// ---------- helpers ----------
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => site.url + p;
const fmtDate = (iso) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// Link resolver. In production: clean absolute URLs (/work/). In preview: relative paths to index.html.
let CURRENT = '/';
const L = (p) => {
  if (!PREVIEW || /^(https?:|mailto:|tel:|#)/.test(p)) return p;
  const [pathPart, hash = ''] = p.split('#');
  const depth = CURRENT.split('/').filter(Boolean).length;
  const up = depth ? '../'.repeat(depth) : './';
  let target = pathPart.replace(/^\//, '');
  if (target === '' || target.endsWith('/')) target += 'index.html';
  return up + target + (hash ? '#' + hash : '');
};
const A = (p) => L('/assets/' + p); // asset path

// ---------- icons ----------
const I = {
  arrow: '<svg class="arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUpRight: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 10h10m-4.5-4.5L15 10l-4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  external: '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8 4H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3M11 4h5v5M16 4l-7 7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5.1 5.2-1.37A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.08.81.82-3-.2-.31a8.2 8.2 0 1 1 6.96 3.83Zm4.5-6.14c-.25-.12-1.47-.72-1.7-.8-.23-.09-.4-.13-.56.12-.17.25-.65.8-.79.97-.15.17-.3.19-.54.06a6.7 6.7 0 0 1-3.34-2.92c-.25-.43.25-.4.72-1.34.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48a.92.92 0 0 0-.66.31 2.8 2.8 0 0 0-.87 2.07 4.86 4.86 0 0 0 1.02 2.58 11.1 11.1 0 0 0 4.25 3.76c1.58.68 2.2.74 2.99.62.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.1-.23-.17-.48-.29Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 13.4c0-3.1-1.66-4.54-3.87-4.54a3.34 3.34 0 0 0-3.03 1.67V8.5h-3.37V20h3.37v-5.7c0-1.5.29-2.95 2.14-2.95 1.83 0 1.85 1.71 1.85 3.05V20h3.38v-6.6Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="9.5" r="2.5" stroke="currentColor" stroke-width="1.7"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="#0d1b1f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
const mark = `<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#ee7d2b"/><path d="M9 12h13M15.5 12v17" stroke="#0d1b1f" stroke-width="3.6" stroke-linecap="round"/><path d="M24 12v17h4.5a4.25 4.25 0 0 0 0-8.5H24m0 0h3.5a4.25 4.25 0 0 0 0-8.5H24" stroke="#0d1b1f" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;

// Stepped stripes — redrawn from the original Web Illustrators banner.
const stripes = (cls = '') => {
  const widths = [18, 34, 50, 66, 82, 98, 82, 66, 50, 34, 18];
  const bars = widths.map((w, i) => `<rect x="0" y="${i * 20}" width="${w}%" height="7" rx="1"/>`).join('');
  return `<svg class="stripes ${cls}" viewBox="0 0 100 207" preserveAspectRatio="none" aria-hidden="true" focusable="false">${bars}</svg>`;
};

// ---------- image components ----------
const PROJECT_W = [640, 1200, 1340];
const picture = ({ name, widths, sizes, alt, w, h, eager = false, cls = '' }) => {
  const src = (ext) => widths.map((x) => `${A(`img/${name}-${x}.${ext}`)} ${x}w`).join(', ');
  const fallback = A(`img/${name}-${widths[Math.min(1, widths.length - 1)]}.jpg`);
  return `<picture${cls ? ` class="${cls}"` : ''}><source type="image/webp" srcset="${src('webp')}" sizes="${sizes}"><img src="${fallback}" srcset="${src('jpg')}" sizes="${sizes}" alt="${esc(alt)}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
};
const browser = (p, { sizes = '(max-width: 860px) 92vw, 760px', eager = false } = {}) => `
<div class="browser">
  <div class="browser__bar" aria-hidden="true"><span class="browser__dots"><i></i><i></i><i></i></span><span class="browser__url">${esc(p.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</span></div>
  <div class="browser__shot">${picture({ name: p.image, widths: PROJECT_W, sizes, alt: p.alt, w: 1340, h: 600, eager })}</div>
</div>`;

// ---------- structured data ----------
const personId = abs('/#person');
const personLD = {
  '@type': 'Person',
  '@id': personId,
  name: site.name,
  alternateName: 'Boris Tening',
  jobTitle: site.role,
  description: 'Frontend and WordPress developer based in Yaoundé, Cameroon, building responsive websites for businesses in Africa and internationally.',
  url: abs('/'),
  image: abs('/assets/img/tening-boris-square-400.jpg'),
  email: 'mailto:' + site.email,
  telephone: site.phone,
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: site.countryCode },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Yaoundé 1' },
  knowsLanguage: ['en', 'fr'],
  knowsAbout: ['Frontend development', 'Responsive web design', 'WordPress', 'HTML5', 'CSS3', 'Web performance optimization', 'UI design', 'Cross-browser compatibility'],
  sameAs: [site.linkedin],
};
const websiteLD = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: `${site.name} — ${site.role}`, inLanguage: 'en', publisher: { '@id': personId } };
const crumbsLD = (crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.href) })),
});
const ldGraph = (items) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': items }).replace(/</g, '\\u003c')}</script>`;

// ---------- layout ----------
let CSS_HASH = '', JS_HASH = '';
const head = ({ title, description, path: p, type = 'website', image = '/assets/img/og-default.jpg', ld = [], noindex = false }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${abs(p)}">
<meta name="author" content="${site.name}">
<meta name="theme-color" content="#0d1b1f">
<meta name="geo.region" content="CM-CE">
<meta name="geo.placename" content="${site.city}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(p)}">
<meta property="og:image" content="${abs(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(image)}">
<link rel="icon" href="${L('/favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="${L('/apple-touch-icon.png')}">
<link rel="manifest" href="${L('/site.webmanifest')}">
<link rel="preload" href="${A('fonts/bricolage-grotesque.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${A('fonts/instrument-sans.woff2')}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${A('css/styles.css')}?v=${CSS_HASH}">
<script>document.documentElement.classList.add('js')</script>
${ld.length ? ldGraph(ld) : ''}
</head>`;

const header = (active) => `
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${L('/')}">${mark}<span><span class="brand__name">TENING BORIS</span><span class="brand__role">Frontend developer</span></span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__label">Menu</span><span class="nav-toggle__bars" aria-hidden="true"><span></span><span></span><span></span></span></button>
    <nav class="nav" id="site-nav" aria-label="Main">
      <ul class="nav__list" role="list">
        ${C.nav.map((n) => `<li><a class="nav__link" href="${L(n.href)}"${active === n.href ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('')}
      </ul>
      <a class="btn btn--primary" href="${L('/contact/')}"${active === '/contact/' ? ' aria-current="page"' : ''}>Discuss your project ${I.arrow}</a>
      <p class="nav__meta">${site.city}, ${site.country} · <a href="mailto:${site.email}">${site.email}</a></p>
    </nav>
  </div>
</header>`;

const waHref = (text = 'Hello Boris, I found your website and would like to discuss a project.') => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

const footer = () => `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <p class="footer-cta">Have a website in mind? <a href="${L('/contact/')}">Let's talk.</a></p>
        <p class="muted" style="margin-top:1.25rem;max-width:40ch">Frontend developer in ${site.city}, ${site.country}, working with businesses in Africa and around the world.</p>
      </div>
      <div class="footer-col">
        <h2>Explore</h2>
        <ul role="list">
          <li><a href="${L('/work/')}">Work</a></li>
          <li><a href="${L('/services/')}">Services</a></li>
          <li><a href="${L('/about/')}">About</a></li>
          <li><a href="${L('/insights/')}">Insights</a></li>
          <li><a href="${L('/contact/')}">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h2>Contact</h2>
        <ul role="list">
          <li><a href="${waHref()}" target="_blank" rel="noopener">WhatsApp</a></li>
          <li><a href="mailto:${site.email}">Email</a></li>
          <li><a href="tel:${site.phone}">${site.phoneDisplay}</a></li>
          <li><a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© <span data-year>${new Date().getFullYear()}</span> ${site.name} · ${site.brand}</p>
      <p>Designed and built by TENING BORIS in ${site.city}.</p>
    </div>
  </div>
</footer>
<a class="wa-float" href="${waHref()}" target="_blank" rel="noopener" aria-label="Chat with TENING BORIS on WhatsApp (opens in a new tab)">${I.whatsapp}</a>
<script src="${A('js/main.js')}?v=${JS_HASH}" defer></script>
</body>
</html>`;

const page = (meta, active, body) => `${head(meta)}
<body>
${header(active)}
<main id="main">
${body}
</main>
${footer()}`;

const crumbsNav = (crumbs) => `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${crumbs.map((c, i) => i === crumbs.length - 1 ? `<li><span aria-current="page">${esc(c.name)}</span></li>` : `<li><a href="${L(c.href)}">${esc(c.name)}</a></li>`).join('')}</ol></nav>`;

const pageHero = ({ crumbs, eyebrow, h1, lede, extra = '' }) => `
<section class="page-hero on-ink">
  ${stripes()}
  <div class="wrap">
    ${crumbsNav(crumbs)}
    <p class="eyebrow">${eyebrow}</p>
    <h1>${h1}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
    ${extra}
  </div>
</section>`;

const ctaBand = ({ title = 'Have a project in mind?', text = 'Tell me what you need. I reply within one working day with questions, an approach and an estimate.' } = {}) => `
<section class="section section--tight">
  <div class="wrap">
    <div class="cta-band reveal">
      ${stripes()}
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="btn-row">
        <a class="btn btn--dark" href="${L('/contact/')}">Discuss your project ${I.arrow}</a>
        <a class="btn btn--ghost" href="${waHref()}" target="_blank" rel="noopener">${I.whatsapp} WhatsApp me</a>
      </div>
    </div>
  </div>
</section>`;

const go = `<span class="svc-row__go" aria-hidden="true">${I.arrowUpRight}</span>`;

// ---------- pages ----------
function homePage() {
  const h = C.home;
  const featured = C.projects.filter((p) => p.featured).slice(0, 3);
  const body = `
<section class="hero on-ink">
  ${stripes()}
  <div class="wrap">
    <div class="hero__grid">
      <div class="hero__copy">
        <p class="eyebrow">${h.eyebrow}</p>
        <h1><span class="line">${h.headline[0]}</span> <span class="line">${h.headline[1]}</span> <span class="line accent">${h.headline[2]}</span></h1>
        <p class="lede">${h.lede}</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="${L('/contact/')}">Discuss your project ${I.arrow}</a>
          <a class="btn btn--ghost" href="${L('/work/')}">Explore my work</a>
        </div>
        <p class="availability"><span class="availability__dot" aria-hidden="true"></span>${h.availability}</p>
      </div>
      <div class="portrait">
        <span class="portrait__ring" aria-hidden="true"></span>
        <div class="portrait__frame">${picture({ name: 'tening-boris-portrait', widths: [480, 794], sizes: '(max-width: 880px) 420px, 34vw', alt: 'Portrait of TENING BORIS, frontend developer, in a navy blazer', w: 794, h: 992, eager: true })}</div>
        <div class="portrait__tag"><strong>TENING BORIS</strong><span>Frontend developer · ${site.city}</span></div>
      </div>
    </div>
    <dl class="proof">
      ${C.proof.map((p) => `<div class="proof__item"><dt class="sr-only">${esc(p.label)}</dt><dd class="proof__value">${p.value}</dd><dd class="proof__label">${p.label}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section class="section" aria-labelledby="intro-title">
  <div class="wrap intro">
    <div class="reveal">
      <p class="eyebrow">About me</p>
      <h2 id="intro-title">${h.introTitle}</h2>
    </div>
    <div class="reveal" style="--d:.1s">
      <div class="prose">${h.intro.map((p) => `<p>${p}</p>`).join('')}</div>
      <a class="link-arrow" href="${L('/about/')}">More about me ${I.arrow}</a>
    </div>
  </div>
</section>

<section class="section on-paper-2" aria-labelledby="services-title">
  <div class="wrap">
    <div class="section-head reveal">
      <div><p class="eyebrow">Services</p><h2 id="services-title">What I can build for you</h2></div>
      <p class="muted">From a first website to a redesign or a speed fix. Every service is backed by work I did week in, week out at a digital agency.</p>
    </div>
    <div class="svc-list">
      ${C.services.map((s, i) => `<a class="svc-row reveal" style="--d:${i * 0.05}s" href="${L('/services/#' + s.id)}"><span class="svc-row__num">${s.num}</span><h3>${s.title}</h3><p>${s.short}</p>${go}</a>`).join('')}
    </div>
  </div>
</section>

<section class="section on-ink" aria-labelledby="work-title">
  <div class="wrap">
    <div class="section-head reveal">
      <div><p class="eyebrow">Selected work</p><h2 id="work-title">Websites I've built, live and in use</h2></div>
      <p class="muted">Client websites for businesses and organisations in Cameroon, the UK and the USA.</p>
    </div>
    <div class="features">
      ${featured.map((p) => `
      <article class="feature reveal">
        <a class="feature__media" href="${L('/work/' + p.slug + '/')}" tabindex="-1" aria-hidden="true">${browser(p)}</a>
        <div>
          <p class="feature__meta">${p.categoryLabel} · ${p.roleShort}</p>
          <h3><a href="${L('/work/' + p.slug + '/')}">${p.title}</a></h3>
          <p>${p.summary}</p>
          <div class="tags">${p.highlights.slice(0, 3).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
          <div class="btn-row">
            <a class="link-arrow" href="${L('/work/' + p.slug + '/')}">Read the case study ${I.arrow}<span class="sr-only"> for ${esc(p.title)}</span></a>
          </div>
        </div>
      </article>`).join('')}
    </div>
    <div class="btn-row" style="margin-top:clamp(3rem,6vw,5rem)"><a class="btn btn--ghost" href="${L('/work/')}">See all ${C.projects.length} projects ${I.arrow}</a></div>
  </div>
</section>

<section class="section" aria-labelledby="exp-title">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">Experience</p>
      <h2 id="exp-title" class="h-sm" style="margin-top:1rem;max-width:14ch">Three years of shipping real client sites.</h2>
      <div class="timeline" style="margin-top:2.5rem">
        ${C.experience.map((e) => `<div class="tl-item"><p class="tl-item__dates"><time datetime="${e.start}">${e.dates.split(' – ')[0]}</time> – <time datetime="${e.end}">${e.dates.split(' – ')[1]}</time></p><h3>${e.role}</h3><p class="tl-item__org">${e.org}, ${e.place}</p></div>`).join('')}
        <div class="tl-item"><p class="tl-item__dates">${C.education.date}</p><h3>${C.education.degree}</h3><p class="tl-item__org">${C.education.school}</p></div>
      </div>
    </div>
    <div class="reveal" style="--d:.1s">
      <p class="eyebrow">Skills</p>
      <div class="skill-groups" style="margin-top:1.75rem">
        ${C.skills.map((g) => `<div class="skill-group"><h3>${g.group}</h3><div class="tags">${g.items.map((t) => `<span class="tag">${t}</span>`).join('')}</div></div>`).join('')}
      </div>
      <p class="muted" style="margin-top:2rem;font-size:.95rem">${C.alsoSkills}</p>
      <a class="link-arrow" style="margin-top:1.5rem" href="${L('/about/#experience')}">Full experience ${I.arrow}</a>
    </div>
  </div>
</section>

<section class="section on-ink-2" aria-labelledby="process-title">
  <div class="wrap">
    <div class="section-head reveal">
      <div><p class="eyebrow">How we'll work</p><h2 id="process-title">A clear process, from first call to launch</h2></div>
      <p class="muted">You always know what happens next, what it costs and when you'll see it.</p>
    </div>
    <ol class="steps" role="list">
      ${C.workProcess.map((s, i) => `<li class="step reveal" style="--d:${i * 0.07}s"><span class="step__num" aria-hidden="true">${s.num}</span><h3>${s.title}</h3><p>${s.text}</p></li>`).join('')}
    </ol>
  </div>
</section>

${ctaBand()}`;
  return page({
    title: h.title, description: h.description, path: '/',
    ld: [personLD, websiteLD, { '@type': ['WebPage', 'ProfilePage'], '@id': abs('/#webpage'), url: abs('/'), name: h.title, isPartOf: { '@id': abs('/#website') }, about: { '@id': personId }, mainEntity: { '@id': personId }, inLanguage: 'en' }],
  }, '/', body);
}

function aboutPage() {
  const a = C.about;
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'About', href: '/about/' }];
  const body = `
<section class="page-hero on-ink">
  ${stripes()}
  <div class="wrap">
    ${crumbsNav(crumbs)}
    <div class="about-hero" style="margin-top:2rem">
      <div>
        <p class="eyebrow">About</p>
        <h1 style="font-size:var(--step-5);margin-top:1.25rem;max-width:13ch">${a.headline}</h1>
        <p class="lede" style="margin-top:1.5rem">${a.lede}</p>
        <div class="btn-row" style="margin-top:2rem"><a class="btn btn--primary" href="${L('/contact/')}">Discuss your project ${I.arrow}</a><a class="btn btn--ghost" href="${site.linkedin}" target="_blank" rel="noopener">${I.linkedin} LinkedIn</a></div>
      </div>
      <div class="portrait"><div class="portrait__frame">${picture({ name: 'tening-boris-about', widths: [480, 760], sizes: '(max-width: 860px) 92vw, 40vw', alt: 'Studio portrait of TENING BORIS, frontend developer, in a navy blazer and light grey shirt', w: 760, h: 829, eager: true })}</div></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="story-title">
  <div class="wrap split">
    <div class="reveal"><p class="eyebrow">My story</p><h2 id="story-title" class="h-sm" style="margin-top:1rem;max-width:14ch">From design to delivering websites end to end.</h2></div>
    <div class="prose reveal" style="font-size:var(--step-1);--d:.1s">${a.story.map((p) => `<p>${p}</p>`).join('')}</div>
  </div>
</section>

<section class="section on-paper-2" id="experience" aria-labelledby="xp-title">
  <div class="wrap split">
    <div class="reveal">
      <p class="eyebrow">Experience</p>
      <h2 id="xp-title" class="h-sm" style="margin-top:1rem">Career</h2>
      <div class="edu-card" style="margin-top:2.5rem">
        <p class="tl-item__dates">Education · ${C.education.date}</p>
        <h3>${C.education.degree}</h3>
        <p style="color:var(--paper)">${C.education.school}</p>
        <p>${C.education.note}</p>
      </div>
      <p class="muted" style="margin-top:1.5rem"><strong style="color:var(--ink)">Languages:</strong> ${C.languages}</p>
    </div>
    <div class="timeline reveal" style="--d:.1s">
      ${C.experience.map((e) => `<div class="tl-item"><p class="tl-item__dates"><time datetime="${e.start}">${e.dates.split(' – ')[0]}</time> – <time datetime="${e.end}">${e.dates.split(' – ')[1]}</time></p><h3>${e.role}</h3><p class="tl-item__org">${e.org}, ${e.place}</p><ul>${e.points.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="skills-title">
  <div class="wrap split">
    <div class="reveal"><p class="eyebrow">Skills</p><h2 id="skills-title" class="h-sm" style="margin-top:1rem;max-width:14ch">Technical interests and tools</h2><p class="muted" style="margin-top:1.25rem;max-width:40ch">${C.alsoSkills}</p></div>
    <div class="skill-groups reveal" style="--d:.1s">${C.skills.map((g) => `<div class="skill-group"><h3>${g.group}</h3><div class="tags">${g.items.map((t) => `<span class="tag">${t}</span>`).join('')}</div></div>`).join('')}</div>
  </div>
</section>

<section class="section on-paper-2" aria-labelledby="principles-title">
  <div class="wrap">
    <div class="section-head reveal"><div><p class="eyebrow">Working principles</p><h2 id="principles-title">How I work with clients</h2></div></div>
    <div class="principles">${C.principles.map((p, i) => `<div class="principle reveal" style="--d:${i * 0.06}s"><h3>${p.title}</h3><p>${p.text}</p></div>`).join('')}</div>
  </div>
</section>
${ctaBand({ title: 'Want to work together?', text: 'I take on freelance projects and am open to remote roles with product teams and agencies.' })}`;
  return page({ title: a.title, description: a.description, path: '/about/', type: 'profile',
    ld: [personLD, websiteLD, { '@type': 'AboutPage', url: abs('/about/'), name: a.title, about: { '@id': personId }, isPartOf: { '@id': abs('/#website') } }, crumbsLD(crumbs)] }, '/about/', body);
}

function servicesPage() {
  const s = C.servicesPage;
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Services', href: '/services/' }];
  const body = `
${pageHero({ crumbs, eyebrow: 'Services', h1: s.headline, lede: s.lede, extra: `<nav class="svc-nav" aria-label="Services on this page">${C.services.map((x) => `<a href="#${x.id}">${x.title}</a>`).join('')}</nav>` })}
<section class="section">
  <div class="wrap">
    ${C.services.map((x) => `
    <article class="svc-block reveal" id="${x.id}" aria-labelledby="${x.id}-title">
      <div>
        <p class="svc-block__num">${x.num}</p>
        <h2 id="${x.id}-title">${x.title}</h2>
        <p class="svc-block__short">${x.short}</p>
        <a class="btn btn--dark" href="${L('/contact/')}?service=${encodeURIComponent(x.id)}">Discuss this service ${I.arrow}</a>
      </div>
      <div class="svc-detail">
        <div><h3>The problem</h3><p>${x.problem}</p></div>
        <div><h3>What you get</h3><ul class="checklist">${x.delivers.map((d) => `<li>${d}</li>`).join('')}</ul></div>
        <div><h3>Who it's for</h3><p>${x.for}</p></div>
        <div><h3>Tools &amp; skills</h3><div class="tags">${x.tech.map((t) => `<span class="tag">${t}</span>`).join('')}</div></div>
        <p class="evidence"><strong>Experience:</strong> ${x.evidence}</p>
      </div>
    </article>`).join('')}
  </div>
</section>
<section class="section on-paper-2" aria-labelledby="faq-title">
  <div class="wrap split">
    <div class="reveal"><p class="eyebrow">Questions</p><h2 id="faq-title" class="h-sm" style="margin-top:1rem">Common questions</h2></div>
    <div class="faq reveal">${C.faq.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>
  </div>
</section>
${ctaBand()}`;
  const servicesLD = C.services.map((x) => ({ '@type': 'Service', name: x.title, description: x.short, serviceType: x.title, provider: { '@id': personId }, areaServed: [{ '@type': 'Country', name: 'Cameroon' }, { '@type': 'Place', name: 'Africa' }, { '@type': 'Place', name: 'Worldwide (remote)' }], url: abs('/services/#' + x.id) }));
  return page({ title: s.title, description: s.description, path: '/services/',
    ld: [personLD, websiteLD, { '@type': 'WebPage', url: abs('/services/'), name: s.title, isPartOf: { '@id': abs('/#website') } }, ...servicesLD,
      { '@type': 'FAQPage', mainEntity: C.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }, crumbsLD(crumbs)] }, '/services/', body);
}

function workPage() {
  const w = C.workPage;
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Work', href: '/work/' }];
  const count = (id) => id === 'all' ? C.projects.length : C.projects.filter((p) => p.category === id).length;
  const body = `
${pageHero({ crumbs, eyebrow: 'Portfolio', h1: w.headline, lede: w.lede })}
<section class="section">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter projects by type">
      ${C.workFilters.map((f) => `<button class="filter" type="button" data-filter="${f.id}" aria-pressed="${f.id === 'all'}">${f.label}<span class="filter__count">${count(f.id)}</span></button>`).join('')}
    </div>
    <p id="filter-status" class="sr-only" aria-live="polite"></p>
    <div class="work-grid">
      ${C.projects.map((p, i) => `
      <a class="work-card reveal" style="--d:${(i % 2) * 0.08}s" href="${L('/work/' + p.slug + '/')}" data-category="${p.category}">
        ${browser(p, { sizes: '(max-width: 760px) 92vw, 600px' })}
        <div class="work-card__body">
          <p class="work-card__cat">${p.categoryLabel}</p>
          <h2>${p.title}</h2>
          <p>${p.summary}</p>
          ${go}
        </div>
      </a>`).join('')}
      <p class="work-grid__empty" hidden>No projects in this category yet.</p>
    </div>
    <p class="credit-note">${w.credit}</p>
  </div>
</section>
${ctaBand({ title: 'Need something similar?', text: 'Whether it is a store, a school website or a site for your local business, tell me what you have in mind.' })}`;
  return page({ title: w.title, description: w.description, path: '/work/',
    ld: [personLD, websiteLD, { '@type': 'CollectionPage', url: abs('/work/'), name: w.title, isPartOf: { '@id': abs('/#website') },
      mainEntity: { '@type': 'ItemList', itemListElement: C.projects.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs('/work/' + p.slug + '/'), name: p.title })) } }, crumbsLD(crumbs)] }, '/work/', body);
}

function projectPage(p, i) {
  const next = C.projects[(i + 1) % C.projects.length];
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Work', href: '/work/' }, { name: p.title, href: `/work/${p.slug}/` }];
  const title = `${p.title} — ${p.categoryLabel} Website Case Study | TENING BORIS`;
  const description = `${p.summary} Case study of the ${p.title} website by TENING BORIS, frontend developer in Yaoundé, Cameroon.`;
  const body = `
${pageHero({ crumbs, eyebrow: `Case study · ${p.categoryLabel}`, h1: p.title, lede: p.summary, extra: `
    <dl class="case-meta">
      <div><dt>Client</dt><dd>${p.client}</dd></div>
      <div><dt>My role</dt><dd>${p.roleShort}</dd></div>
      <div><dt>Context</dt><dd>${p.context}</dd></div>
      ${p.platform ? `<div><dt>Platform</dt><dd>${p.platform}</dd></div>` : ''}
      <div><dt>Live site</dt><dd><a href="${p.url}" target="_blank" rel="noopener">Visit website<span class="sr-only"> (opens in a new tab)</span></a></dd></div>
    </dl>` })}
<section class="section" style="padding-top:0">
  <div class="wrap">
    <figure class="case-shot">${browser(p, { sizes: '(max-width: 1300px) 92vw, 1240px', eager: true })}<figcaption>Homepage of the live ${p.title} website.</figcaption></figure>
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="case-body reveal"><h2>Objective</h2><div class="prose"><p>${p.objective}</p></div></div>
    <div class="case-body reveal"><h2>My role</h2><div class="prose"><p>${p.role}</p>${p.note ? `<p class="muted" style="font-size:1rem">${p.note}</p>` : ''}</div></div>
    <div class="case-body reveal"><h2>Approach</h2><ol>${p.approach.map((x) => `<li>${x}</li>`).join('')}</ol></div>
    <div class="case-body reveal"><h2>What the site includes</h2><div><div class="tags">${p.highlights.map((t) => `<span class="tag">${t}</span>`).join('')}</div><div class="btn-row" style="margin-top:2rem"><a class="btn btn--dark" href="${p.url}" target="_blank" rel="noopener">Visit the live site ${I.external}<span class="sr-only"> (opens in a new tab)</span></a></div></div></div>
  </div>
</section>
<section class="section on-paper-2" aria-label="Next project">
  <div class="wrap">
    <a class="next-project reveal" href="${L('/work/' + next.slug + '/')}">
      <div><p class="eyebrow">Next project</p><h2>${next.title}</h2><p class="muted" style="margin-top:.75rem">${next.summary}</p><span class="link-arrow" style="margin-top:1.5rem">View case study ${I.arrow}</span></div>
      ${browser(next, { sizes: '(max-width: 760px) 92vw, 600px' })}
    </a>
  </div>
</section>
${ctaBand({ title: `Planning a ${p.category === 'ecommerce' ? 'store' : p.category === 'education' ? 'school or training website' : p.category === 'nonprofit' ? 'website for your association' : 'business website'}?`, text: 'I can help you plan, build and launch a site like this one. Tell me about your project.' })}`;
  return page({ title, description, path: `/work/${p.slug}/`, type: 'article', image: `/assets/img/${p.image}-1200.jpg`,
    ld: [personLD, websiteLD, { '@type': 'CreativeWork', '@id': abs(`/work/${p.slug}/#work`), name: `${p.title} website`, description: p.summary, url: abs(`/work/${p.slug}/`), image: abs(`/assets/img/${p.image}-1200.jpg`), contributor: { '@id': personId }, ...(p.producer ? { producer: { '@type': 'Organization', name: p.producer } } : {}), sameAs: p.url, genre: p.categoryLabel, inLanguage: 'en' }, crumbsLD(crumbs)] }, '/work/', body);
}

function contactPage() {
  const c = C.contactPage;
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact/' }];
  const body = `
${pageHero({ crumbs, eyebrow: 'Contact', h1: c.headline, lede: c.lede })}
<section class="section">
  <div class="wrap contact-grid">
    <div class="form-card">
      <form id="enquiry-form" name="project-enquiry" method="POST" action="${PREVIEW ? '#' : '/contact/thanks/'}" data-netlify="true" netlify-honeypot="company_website" novalidate data-whatsapp="${site.whatsapp}" data-email="${site.email}" aria-describedby="form-intro">
        <input type="hidden" name="form-name" value="project-enquiry">
        <p id="form-intro" class="muted" style="margin-bottom:1.5rem">Fields marked <span aria-hidden="true">*</span><span class="sr-only">with an asterisk</span> are required.</p>
        <p class="hp" aria-hidden="true"><label>Leave this field empty <input name="company_website" tabindex="-1" autocomplete="off"></label></p>
        <div class="form-grid">
          <div class="field">
            <label for="name">Your name <span aria-hidden="true">*</span></label>
            <input id="name" name="name" type="text" autocomplete="name" required aria-describedby="name-error">
            <p class="field__error" id="name-error" aria-live="polite"></p>
          </div>
          <div class="field">
            <label for="email">Email <span aria-hidden="true">*</span></label>
            <input id="email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="email-error">
            <p class="field__error" id="email-error" aria-live="polite"></p>
          </div>
          <div class="field">
            <label for="project_type">Project type <span aria-hidden="true">*</span></label>
            <select id="project_type" name="project_type" required aria-describedby="project_type-error">
              <option value="">Choose one…</option>
              ${c.projectTypes.map((t) => `<option>${t}</option>`).join('')}
            </select>
            <p class="field__error" id="project_type-error" aria-live="polite"></p>
          </div>
          <div class="field">
            <label for="budget">Budget range <span class="opt">(optional)</span></label>
            <select id="budget" name="budget" aria-describedby="budget-hint">
              <option value="">Prefer not to say</option>
              ${c.budgets.map((t) => `<option>${t}</option>`).join('')}
            </select>
            <p class="field__hint" id="budget-hint">Helps me suggest the right scope.</p>
          </div>
          <div class="field field--full">
            <label for="message">About your project <span aria-hidden="true">*</span></label>
            <textarea id="message" name="message" rows="6" required aria-describedby="message-hint message-error" placeholder="What does your business do, what should the website achieve, and when do you need it?"></textarea>
            <p class="field__hint" id="message-hint">A few sentences is plenty. Include a link to your current site if you have one.</p>
            <p class="field__error" id="message-error" aria-live="polite"></p>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn--primary" type="submit">Send enquiry ${I.arrow}</button>
          <button class="btn btn--ghost" type="button" id="send-whatsapp">${I.whatsapp} Send via WhatsApp instead</button>
        </div>
        <p class="muted" style="margin-top:1rem;font-size:.9rem">${site.responseTime} Your details are only used to reply to your enquiry.</p>
        <div id="form-status" class="form-status" role="alert"></div>
      </form>
      <div id="form-success" class="form-success" hidden tabindex="-1">
        <div class="form-success__icon">${I.check}</div>
        <h2>Thank you, <span id="success-name">there</span>.</h2>
        <p>Your enquiry has been sent. I'll reply within one working day. If it's urgent, message me on WhatsApp.</p>
        <div class="btn-row"><a class="btn btn--dark" href="${L('/work/')}">Browse my work</a><a class="btn btn--ghost" href="${waHref()}" target="_blank" rel="noopener">${I.whatsapp} WhatsApp</a></div>
      </div>
    </div>
    <aside class="contact-aside" aria-label="Direct contact details">
      <div class="contact-card">
        <h2>Prefer to reach me directly?</h2>
        <ul class="contact-list" role="list">
          <li><a href="${waHref()}" target="_blank" rel="noopener"><span class="contact-list__icon">${I.whatsapp}</span><span><small>WhatsApp</small>${site.whatsappDisplay}</span></a></li>
          <li><a href="mailto:${site.email}"><span class="contact-list__icon">${I.mail}</span><span><small>Email</small>${site.email}</span></a></li>
          <li><a href="tel:${site.phone}"><span class="contact-list__icon">${I.phone}</span><span><small>Phone</small>${site.phoneDisplay}</span></a></li>
          <li><a href="${site.linkedin}" target="_blank" rel="noopener"><span class="contact-list__icon">${I.linkedin}</span><span><small>LinkedIn</small>TENING BORIS</span></a></li>
        </ul>
        <div class="contact-card__meta">
          <p>${site.city}, ${site.country} · West Africa Time (UTC+1)</p>
          <p>${site.hours}</p>
        </div>
      </div>
      <div class="faq">${C.faq.slice(0, 3).map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}</div>
    </aside>
  </div>
</section>`;
  return page({ title: c.title, description: c.description, path: '/contact/',
    ld: [personLD, websiteLD, { '@type': 'ContactPage', url: abs('/contact/'), name: c.title, about: { '@id': personId }, isPartOf: { '@id': abs('/#website') } }, crumbsLD(crumbs)] }, '/contact/', body);
}

function thanksPage() {
  const body = `
<section class="page-hero on-ink" style="min-height:60vh">
  ${stripes()}
  <div class="wrap">
    <p class="eyebrow">Message sent</p>
    <h1>Thank you. I'll be in touch soon.</h1>
    <p class="lede">Your enquiry has arrived. I reply within one working day. For anything urgent, message me on WhatsApp.</p>
    <div class="btn-row" style="margin-top:2rem"><a class="btn btn--primary" href="${L('/work/')}">Browse my work ${I.arrow}</a><a class="btn btn--ghost" href="${waHref()}" target="_blank" rel="noopener">${I.whatsapp} WhatsApp</a></div>
  </div>
</section>`;
  return page({ title: 'Thank you — TENING BORIS', description: 'Your enquiry has been sent.', path: '/contact/thanks/', noindex: true }, '/contact/', body);
}

function insightsPage() {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Insights', href: '/insights/' }];
  const posts = [...insights].sort((a, b) => b.date.localeCompare(a.date));
  const body = `
${pageHero({ crumbs, eyebrow: 'Insights', h1: 'Notes on building better business websites', lede: 'Practical guides on responsive design, WordPress and website speed, written for business owners.' })}
<section class="section">
  <div class="wrap">
    <div class="post-list">
      ${posts.map((p) => `<a class="post-row reveal" href="${L('/insights/' + p.slug + '/')}"><div><span class="post-row__tag">${p.tag}</span><time datetime="${p.date}">${fmtDate(p.date)}</time></div><div><h2>${p.title}</h2><p>${p.excerpt}</p></div>${go}</a>`).join('')}
    </div>
  </div>
</section>
${ctaBand()}`;
  return page({ title: 'Insights — Web Development Guides for Businesses | TENING BORIS', description: 'Practical guides on mobile-first design, WordPress and website speed for business owners in Cameroon and across Africa.', path: '/insights/',
    ld: [personLD, websiteLD, { '@type': 'Blog', url: abs('/insights/'), name: 'Insights by TENING BORIS', author: { '@id': personId }, blogPost: posts.map((p) => ({ '@type': 'BlogPosting', headline: p.title, url: abs('/insights/' + p.slug + '/'), datePublished: p.date })) }, crumbsLD(crumbs)] }, '/insights/', body);
}

function postPage(p) {
  const crumbs = [{ name: 'Home', href: '/' }, { name: 'Insights', href: '/insights/' }, { name: p.title, href: `/insights/${p.slug}/` }];
  const others = insights.filter((x) => x.slug !== p.slug).slice(0, 2);
  const body = `
${pageHero({ crumbs, eyebrow: p.tag, h1: p.title, lede: p.excerpt, extra: `<p class="article-meta"><span>By TENING BORIS</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span>${p.readMins} min read</span></p>` })}
<section class="section">
  <div class="wrap">
    <article class="article">${p.body.replace(/href="\/contact\/"/g, `href="${L('/contact/')}"`)}</article>
    <div class="author-box">${picture({ name: 'tening-boris-square', widths: [400], sizes: '64px', alt: '', w: 400, h: 400 })}<p><strong>TENING BORIS</strong> is a frontend developer in ${site.city}, Cameroon. He spent three years building client websites at Highupweb and now works freelance.</p></div>
  </div>
</section>
<section class="section on-paper-2" aria-labelledby="more-title">
  <div class="wrap">
    <h2 id="more-title" class="h-sm" style="margin-bottom:2rem">Keep reading</h2>
    <div class="post-list">${others.map((o) => `<a class="post-row" href="${L('/insights/' + o.slug + '/')}"><div><span class="post-row__tag">${o.tag}</span><time datetime="${o.date}">${fmtDate(o.date)}</time></div><div><h3 style="font-size:var(--step-2)">${o.title}</h3><p>${o.excerpt}</p></div>${go}</a>`).join('')}</div>
  </div>
</section>
${ctaBand()}`;
  return page({ title: `${p.title} | TENING BORIS`, description: p.description, path: `/insights/${p.slug}/`, type: 'article',
    ld: [personLD, websiteLD, { '@type': 'BlogPosting', headline: p.title, description: p.description, datePublished: p.date, dateModified: p.date, author: { '@id': personId }, publisher: { '@id': personId }, mainEntityOfPage: abs(`/insights/${p.slug}/`), image: abs('/assets/img/og-default.jpg'), inLanguage: 'en' }, crumbsLD(crumbs)] }, '/insights/', body);
}

function notFoundPage() {
  const body = `
<section class="page-hero on-ink" style="min-height:70vh">
  ${stripes()}
  <div class="wrap">
    <p class="error-code" aria-hidden="true">404</p>
    <h1 style="font-size:var(--step-4);margin-top:1.5rem">This page doesn't exist.</h1>
    <p class="lede">The link may be old or mistyped. Here are some places to go instead.</p>
    <div class="btn-row" style="margin-top:2rem"><a class="btn btn--primary" href="${L('/')}">Back to home ${I.arrow}</a><a class="btn btn--ghost" href="${L('/work/')}">See my work</a><a class="btn btn--ghost" href="${L('/contact/')}">Contact me</a></div>
  </div>
</section>`;
  return page({ title: 'Page not found — TENING BORIS', description: 'The page you were looking for could not be found.', path: '/404.html', noindex: true }, '', body);
}

// ---------- write ----------
async function write(p, html) {
  const file = p.endsWith('.html') ? path.join(OUT, p) : path.join(OUT, p, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html.replace(/\n\s*\n/g, '\n'));
}
const render = async (p, fn) => { CURRENT = p.endsWith('.html') ? '/' : p; await write(p, fn()); };

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  await cp('src/assets', path.join(OUT, 'assets'), { recursive: true });
  await cp('src/static', OUT, { recursive: true });
  const hash = async (f) => createHash('sha1').update(await readFile(f)).digest('hex').slice(0, 8);
  CSS_HASH = await hash('src/assets/css/styles.css');
  JS_HASH = await hash('src/assets/js/main.js');

  const pages = [];
  const add = async (p, fn, opts = {}) => { await render(p, fn); if (!opts.noindex) pages.push({ p, ...opts }); };
  await add('/', homePage, { priority: '1.0' });
  await add('/about/', aboutPage, { priority: '0.8' });
  await add('/services/', servicesPage, { priority: '0.9' });
  await add('/work/', workPage, { priority: '0.9' });
  for (const [i, p] of C.projects.entries()) await add(`/work/${p.slug}/`, () => projectPage(p, i), { priority: '0.7' });
  await add('/contact/', contactPage, { priority: '0.8' });
  await add('/contact/thanks/', thanksPage, { noindex: true });
  await add('/insights/', insightsPage, { priority: '0.6' });
  for (const p of insights) await add(`/insights/${p.slug}/`, () => postPage(p), { priority: '0.5', lastmod: p.date });
  CURRENT = '/'; await write('/404.html', notFoundPage());

  if (!PREVIEW) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((x) => `  <url><loc>${abs(x.p)}</loc><lastmod>${x.lastmod || BUILD_DATE}</lastmod><priority>${x.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
    await writeFile(path.join(OUT, 'sitemap.xml'), sitemap);
    await writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /contact/thanks/\n\nSitemap: ${abs('/sitemap.xml')}\n`);
  }
  console.log(`Built ${pages.length + 2} pages → ${OUT}/  (site url: ${site.url}${PREVIEW ? ', preview mode' : ''})`);
}
main().catch((e) => { console.error(e); process.exit(1); });
