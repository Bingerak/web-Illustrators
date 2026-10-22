// Insights articles. Body is simple HTML so it can be pasted into a CMS later.
// Review the wording before publishing: these are written in Tening's voice.

export const insights = [
  {
    slug: 'mobile-first-websites-for-african-businesses',
    title: 'Design for the phone first: a practical guide for businesses in Cameroon',
    description:
      'Most of your customers will see your website on a phone, often on mobile data. Here is what a mobile-first business website needs, and what to drop.',
    date: '2026-10-20',
    readMins: 4,
    tag: 'Responsive design',
    excerpt: 'Most of your customers meet your business on a small screen and a limited data bundle. Build for that visitor first.',
    body: `
<p>When a business owner shows me their website, they usually open it on a laptop. When their customers look at it, they are usually holding a phone, often on mobile data that they pay for by the megabyte. A website that is designed for the first situation and merely "shrinks" for the second will lose people.</p>
<h2>Start from the visitor's question</h2>
<p>Someone on a phone wants one of a handful of things: what you offer, roughly what it costs, where you are, and how to reach you. On a mobile-first site, those answers appear in the first screen or two, with no hunting through menus.</p>
<ul>
  <li><strong>Say what you do in one sentence</strong> at the top of the homepage.</li>
  <li><strong>Make contact one tap away.</strong> A WhatsApp button and a click-to-call phone number beat a long form for many customers.</li>
  <li><strong>Show your location</strong> with a written address and a link to a map, not just an embedded map that is heavy to load.</li>
</ul>
<h2>Respect the data bundle</h2>
<p>Images are usually the heaviest part of a page. A single photo straight from a modern phone can be several megabytes; the same photo prepared for the web can be a small fraction of that and look identical on screen.</p>
<ul>
  <li>Resize images to the size they are actually displayed at.</li>
  <li>Use modern formats like WebP, with a JPEG fallback for older browsers.</li>
  <li>Load images below the first screen only when the visitor scrolls to them.</li>
  <li>Be selective with sliders, background videos and chat widgets. Each one adds weight.</li>
</ul>
<h2>Make it comfortable to use with a thumb</h2>
<p>Buttons should be large enough to tap without zooming, with space between them. Text should be readable without pinching. And never disable zoom: some visitors need it, and blocking it makes a site harder to use, not easier.</p>
<h2>Test on a real, ordinary phone</h2>
<p>Browser tools that simulate a phone are useful, but they run on a powerful computer with a fast connection. Before launch, open the site on a mid-range Android phone using mobile data. If it feels slow or awkward to you, it will feel worse to a customer who has never heard of you.</p>
<p>If you would like me to look at your current site on a phone and tell you what I would change first, <a href="/contact/">send me a message</a>.</p>
`,
  },
  {
    slug: 'wordpress-or-custom-website',
    title: 'WordPress or a custom-coded website? How to choose',
    description:
      'A plain-language comparison of WordPress and hand-coded websites for small businesses: who updates it, cost over time, speed and security.',
    date: '2026-10-13',
    readMins: 4,
    tag: 'WordPress',
    excerpt: 'Both can be excellent. The right choice depends on who will update the site and how often.',
    body: `
<p>"Should my website be on WordPress?" is one of the first questions clients ask me. Both WordPress and a custom-coded site can be fast, attractive and secure. The better choice depends less on technology and more on how you will use the site after launch.</p>
<h2>Choose WordPress when your team publishes often</h2>
<p>WordPress gives you an editor where you can add pages, write news, upload photos and manage products without touching code. It suits:</p>
<ul>
  <li>Shops and catalogues that add or change products regularly.</li>
  <li>Schools, training centres and associations that publish news and events.</li>
  <li>Teams where several people need to edit content.</li>
</ul>
<p>The trade-off is upkeep. WordPress, its theme and its plugins need regular updates, and every extra plugin adds weight and another thing that can break. A good WordPress build uses as few plugins as possible and comes with a maintenance plan.</p>
<h2>Choose a custom-coded site when content changes rarely</h2>
<p>A hand-coded site, built with HTML, CSS and a little JavaScript, has no database and no plugins to update. It suits:</p>
<ul>
  <li>Professional and service businesses whose pages change a few times a year.</li>
  <li>Landing pages for a campaign or product launch.</li>
  <li>Portfolios like this one.</li>
</ul>
<p>These sites are usually very fast, cheap to host and have a small security surface. The trade-off is that text changes go through a developer, or through a simple content file.</p>
<h2>Three questions to decide</h2>
<ol>
  <li><strong>Who will update the site, and how often?</strong> Weekly by your team points to WordPress. A few times a year points to custom code.</li>
  <li><strong>Do you need a shop, bookings or member accounts?</strong> WordPress has mature, tested tools for these.</li>
  <li><strong>Who will maintain it in two years?</strong> Plan for updates and backups whichever you choose.</li>
</ol>
<p>Not sure which fits your business? <a href="/contact/">Tell me how you plan to use the site</a> and I will recommend one, with reasons.</p>
`,
  },
  {
    slug: 'speed-up-a-slow-website',
    title: 'Five fixes that make a slow business website faster',
    description:
      'Practical, non-technical steps to speed up a slow website: image sizes, plugins, fonts, hosting and how to measure the result.',
    date: '2026-10-06',
    readMins: 3,
    tag: 'Performance',
    excerpt: 'Most slow sites are slow for the same few reasons. Here is where I look first.',
    body: `
<p>When a client tells me their website "feels slow", the cause is almost always one of a few familiar problems. Here is where I look first, in order.</p>
<h2>1. Oversized images</h2>
<p>Photos uploaded straight from a camera or phone are often many times larger than they need to be. Resizing them to their display size and converting them to WebP is usually the single biggest improvement, and it costs nothing in visual quality.</p>
<h2>2. Too many plugins and scripts</h2>
<p>Every slider, chat widget, social feed and tracking script adds code the browser must download and run. I list everything a page loads and ask one question of each item: does a visitor benefit from this? Anything that fails the test goes.</p>
<h2>3. Fonts loaded the slow way</h2>
<p>Using four font families in several weights can quietly add a lot of loading. Two families, only the weights you use, and text that displays immediately in a fallback font while the custom font arrives, keep pages readable from the first moment.</p>
<h2>4. Layout that jumps while loading</h2>
<p>If buttons move just as you try to tap them, images or banners are loading without reserved space. Giving every image its width and height fixes this, and makes the page feel faster even before it finishes loading.</p>
<h2>5. Hosting and caching</h2>
<p>Cheap hosting without caching or compression can make even a well-built site slow. Turning on caching and compression, or moving static pages to a content delivery network, often helps visitors far from the server.</p>
<h2>Measure before and after</h2>
<p>Run your site through a free tool such as Google PageSpeed Insights before changing anything, and again afterwards. Test on mobile, because that is where slow sites hurt most.</p>
<p>Want a second opinion on your site's speed? <a href="/contact/">Send me the link</a> and I will tell you the first three things I would fix.</p>
`,
  },
];
