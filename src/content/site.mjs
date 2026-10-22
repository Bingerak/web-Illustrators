// ---------------------------------------------------------------------------
// SITE CONTENT — single source of truth for every word on the website.
// Edit text here, run `node build.mjs`, and every page updates.
// To add French later: copy this file to site.fr.mjs and translate the values.
// ---------------------------------------------------------------------------

export const site = {
  // Change SITE_URL at build time:  SITE_URL=https://yourdomain.com node build.mjs
  url: (process.env.SITE_URL || 'https://webillustrators.online').replace(/\/$/, ''),
  name: 'Tening Boris',
  brand: 'Web Illustrators',
  role: 'Frontend Developer',
  locale: 'en',
  city: 'Yaoundé',
  region: 'Centre',
  country: 'Cameroon',
  countryCode: 'CM',
  email: 'teningboris01@gmail.com',
  phone: '+237682380446',
  phoneDisplay: '+237 682 380 446',
  whatsapp: '237672713856', // digits only, used for wa.me links
  whatsappDisplay: '+237 672 713 856',
  linkedin: 'https://www.linkedin.com/in/boris-tening-189b54226',
  responseTime: 'I reply within one working day.',
  hours: 'Monday – Friday, 8:00 – 18:30 WAT',
};

export const nav = [
  { href: '/work/', label: 'Work' },
  { href: '/services/', label: 'Services' },
  { href: '/about/', label: 'About' },
  { href: '/insights/', label: 'Insights' },
];

// --- Proof points: every figure here is from the resume --------------------
export const proof = [
  { value: '15+', label: 'websites launched, from hosting setup to go-live' },
  { value: '3 yrs', label: 'building client sites at Highupweb, Yaoundé (2021–2024)' },
  { value: '5', label: 'agency projects led, shown in the case studies below' },
];

export const home = {
  title: 'Tening Boris — Freelance Frontend Developer in Yaoundé, Cameroon',
  description:
    'Freelance frontend and WordPress developer in Yaoundé, Cameroon. I build fast, responsive websites for businesses in Cameroon, across Africa and abroad. 15+ sites launched.',
  eyebrow: 'Frontend developer · Yaoundé, Cameroon',
  headline: ['Turning ideas into', 'powerful digital', 'experiences.'],
  lede:
    'I build modern, responsive websites that help businesses explain what they do, look credible on every phone, and turn visitors into customers.',
  availability: 'Available for freelance projects and remote roles',
  introTitle: 'A developer who has run the whole launch, not just the code.',
  intro: [
    'For three years I built and maintained client websites at Highupweb, a digital agency in Yaoundé. I led projects for an e-commerce store, a medical-equipment supplier, a training academy, a driving school and an education consultancy.',
    'That meant more than writing HTML and CSS. I worked with designers and business owners, fixed what broke in older browsers, made slow pages faster, and took 15+ sites through hosting, deployment and launch day.',
  ],
};

// --- Services: each one maps to a resume responsibility -------------------
export const services = [
  {
    id: 'websites',
    num: '01',
    title: 'Business websites',
    short: 'A professional, responsive site that explains what you do and makes it easy to contact you.',
    problem:
      'Your customers look you up on their phone before they call. If the site is missing, outdated or hard to use on mobile, they choose someone else.',
    delivers: [
      'Custom-built pages for your services, story and contact details',
      'Layouts tested on phones, tablets and desktops',
      'Clear calls to action: WhatsApp, call, form or directions',
      'Search-friendly structure, page titles and descriptions',
    ],
    for: 'Small and medium businesses, schools, clinics, NGOs and professionals in Cameroon and beyond.',
    tech: ['HTML5', 'CSS3', 'Responsive design', 'Semantic markup'],
    evidence: 'Developed and maintained responsive websites for multiple clients at Highupweb.',
  },
  {
    id: 'wordpress',
    num: '02',
    title: 'WordPress & CMS websites',
    short: 'A site your team can update without calling a developer for every change.',
    problem:
      'Many businesses want to publish news, add products or change prices themselves, but end up with a fragile setup nobody dares to touch.',
    delivers: [
      'WordPress setup with a clean, maintainable theme',
      'Editable pages, posts and product listings',
      'Plugin choices kept lean for speed and security',
      'A short handover so your team can edit with confidence',
    ],
    for: 'Organisations that publish often: shops, training centres, agencies and associations.',
    tech: ['WordPress', 'CMS platforms', 'Git'],
    evidence: 'WordPress and CMS platforms are core tools on my resume; several of the projects below are catalogue and content sites.',
  },
  {
    id: 'redesign',
    num: '03',
    title: 'Redesign & UI improvement',
    short: 'Keep what works, fix what confuses visitors, and make the site look current.',
    problem:
      'An older site can still work technically while quietly losing trust: cluttered menus, inconsistent styling, buttons that are hard to find.',
    delivers: [
      'A review of navigation, layout and content hierarchy',
      'Redesigned key pages with consistent components',
      'Cross-browser fixes so every visitor sees the same site',
      'Before-and-after notes explaining each change',
    ],
    for: 'Businesses whose site is a few years old, or that grew page by page without a plan.',
    tech: ['UI enhancement', 'Cross-browser compatibility', 'CSS architecture'],
    evidence: 'Redesigned major client websites and resolved cross-browser issues at Highupweb.',
  },
  {
    id: 'performance',
    num: '04',
    title: 'Speed & usability optimisation',
    short: 'Faster pages on the mobile connections your customers actually use.',
    problem:
      'Heavy images and bloated pages load slowly on mobile data, and slow pages lose visitors before they see your offer.',
    delivers: [
      'A speed and usability audit with clear priorities',
      'Image compression, modern formats and lazy loading',
      'Removal of unused scripts and layout shifts',
      'Measured before-and-after results',
    ],
    for: 'Any site that feels slow, especially stores and sites with lots of photos.',
    tech: ['Web performance', 'Image optimisation', 'Usability'],
    evidence: 'Improved site loading speed and UI usability for Highupweb clients.',
  },
  {
    id: 'launch',
    num: '05',
    title: 'Launch, hosting & maintenance',
    short: 'I handle the technical side of going live, then keep the site healthy.',
    problem:
      'Domains, hosting, SSL, backups and updates are where many projects stall, or where a working site quietly breaks months later.',
    delivers: [
      'Domain, hosting and SSL setup',
      'Deployment and launch-day checks',
      'Updates, backups and fixes on a monthly plan',
      'Testing before every change goes live',
    ],
    for: 'Owners who want a site that keeps working without managing the technical details.',
    tech: ['Hosting & deployment', 'Git', 'Testing', 'Security awareness'],
    evidence: 'Launched 15+ websites, managing hosting, deployment and live-environment setup.',
  },
];

// --- Projects: credits exactly as published on the original portfolio ------
// Descriptions come from the delivered sites (screenshots). Stack details
// per project are not listed until confirmed.
export const projects = [
  {
    slug: 'duukaan',
    title: 'Duukaan',
    client: 'Duukaan',
    url: 'https://duukaan.cm/',
    category: 'ecommerce',
    categoryLabel: 'E-commerce',
    year: 'Highupweb, 2021–2024',
    image: 'duukaan',
    alt: 'Duukaan homepage: green category bar, product search and an appliance promotion banner',
    summary: 'A French-language online store for home appliances and electronics in Cameroon.',
    objective:
      'Give shoppers a clear way to browse a large appliance catalogue, from televisions to air conditioners, and reach the team quickly when they have questions before buying.',
    role: 'Project lead within the Highupweb team: coordinated delivery and built the frontend.',
    approach: [
      'A persistent "all categories" menu beside a horizontal bar of top categories, so shoppers reach televisions, fridges or phones in one tap.',
      'Search with a category filter at the top of every page.',
      'Large promotional banners in the hero to feature seasonal offers and brands.',
      'A WhatsApp button and live chat for questions before purchase, plus a cookie notice.',
    ],
    highlights: ['Category navigation for a large catalogue', 'Search with category filter', 'Cart and promotional banners', 'WhatsApp contact'],
  },
  {
    slug: 'medical-park',
    title: 'Medical Park Hospital Equipment',
    client: 'Medical Park',
    url: 'https://hemedicalpark.com/',
    category: 'ecommerce',
    categoryLabel: 'E-commerce',
    year: 'Highupweb, 2021–2024',
    image: 'medical-park',
    alt: 'Medical Park Hospital Equipment homepage: product search, green department menu and medical devices in the hero',
    summary: 'A bilingual product catalogue for a supplier of hospital and laboratory equipment.',
    objective:
      'Present a wide range of specialist equipment so hospitals and clinics can find products by department, in English or French.',
    role: 'Project lead within the Highupweb team: coordinated delivery and built the frontend.',
    approach: [
      'Products grouped by department: imaging, medical furniture, diagnostics, consumables, laboratory and hygiene.',
      'Prominent search with an "all categories" filter for buyers who know the product they need.',
      'An English/French language switch for an international and local audience.',
      'A blog and "about us" section to build trust with institutional buyers.',
    ],
    highlights: ['Bilingual English / French', 'Department-based catalogue', 'Product search and cart', 'Blog for credibility'],
  },
  {
    slug: 'highupweb-academy',
    title: 'Highupweb Academy',
    client: 'Highupweb Academy',
    url: 'https://highupwebacademy.com/',
    category: 'education',
    categoryLabel: 'Education',
    year: 'Highupweb, 2021–2024',
    image: 'highupweb-academy',
    alt: 'Highupweb Academy homepage: classroom photo with the heading "Welcome to Highupweb Academy"',
    summary: 'The website of an ICT training centre in Cameroon, built to bring in new students.',
    objective:
      'Show prospective students what they can learn and what studying there looks like, and make it easy to ask questions or enrol.',
    role: 'Project lead within the Highupweb team: coordinated delivery and built the frontend.',
    approach: [
      'A full-width hero using real classroom photography rather than stock images.',
      'Course categories, gallery and testimonials pages to answer the questions students ask first.',
      'Blog and news sections the academy can update itself.',
      'English/French switch, WhatsApp button and live chat for enquiries.',
    ],
    highlights: ['Course catalogue', 'Gallery and testimonials', 'Blog and news', 'Bilingual with live chat'],
  },
  {
    slug: 'auto-ecole-highupweb',
    title: 'Auto École Highupweb',
    client: 'Highupweb Driving School',
    url: 'https://autoecolehighupweb.com/',
    category: 'services',
    categoryLabel: 'Local business',
    year: 'Highupweb, 2021–2024',
    image: 'auto-ecole-highupweb',
    alt: 'Highupweb Driving School homepage: headline "Learn to Drive with HDS" beside a photo of instructors and the school car',
    summary: 'A conversion-focused website for a driving school in Yaoundé.',
    objective:
      'Turn local searches into enrolments: show the school is real and trusted, explain the offer and prices, and get a phone call booked.',
    role: 'Project lead within the Highupweb team: coordinated delivery and built the frontend.',
    approach: [
      'A bold, uncluttered headline with a real photo of the instructors and school car.',
      'A high-contrast "request a callback" button kept visible in the header.',
      'Dedicated pricing and FAQ pages to answer the questions that usually take a phone call.',
      'A gallery to show the school, team and vehicles.',
    ],
    highlights: ['Callback request in the header', 'Pricing and FAQ pages', 'Real team photography', 'Clean, modern layout'],
  },
  {
    slug: 'leaders-corporation',
    title: "Leader's Corporation",
    client: "Leader's Corporation",
    url: 'https://www.leaderscorporation.org/',
    category: 'education',
    categoryLabel: 'Education',
    year: 'Highupweb, 2021–2024',
    image: 'leaders-corporation',
    alt: "Leader's Corporation homepage: graduate in cap and gown under the heading Campus Universel",
    summary: 'A French-language site for an education and study-abroad consultancy.',
    objective:
      'Organise a lot of information (tests, careers and schools, exam preparation, documents and statistics) so students and parents can find what they need.',
    role: 'Project lead within the Highupweb team: coordinated delivery and built the frontend.',
    approach: [
      'A structured main menu with dropdowns for tests, exam preparation, services, documents and resources.',
      'A hero slider presenting programmes such as Campus Universel with a clear "read more" action.',
      'A language switcher, WhatsApp button and live chat for families with questions.',
      'Brand colours carried from the Africa-shaped logo into buttons and highlights.',
    ],
    highlights: ['Deep information architecture', 'Programme slider', 'WhatsApp and live chat', 'Language switcher'],
  },
];

export const workFilters = [
  { id: 'all', label: 'All work' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'education', label: 'Education' },
  { id: 'services', label: 'Local business' },
];

// --- Experience: resume, verbatim facts -----------------------------------
export const experience = [
  {
    role: 'Front End Developer',
    org: 'Highupweb',
    place: 'Yaoundé',
    start: '2021-10',
    end: '2024-12',
    dates: 'Oct 2021 – Dec 2024',
    points: [
      'Developed and maintained responsive websites for multiple clients, across mobile and desktop.',
      'Led collaboration with designers, product owners and stakeholders.',
      'Improved site loading speed and UI usability, contributing to a 25% increase in client retention.',
      'Launched 15+ websites, managing hosting, deployment and live-environment setup.',
      'Redesigned major client websites to improve visual appeal and navigation.',
      'Found and fixed cross-browser compatibility issues; wrote clean, semantic HTML and CSS.',
    ],
  },
  {
    role: 'Internship Coordinator',
    org: 'Highupweb',
    place: 'Yaoundé',
    start: '2023-04',
    end: '2023-10',
    dates: 'Apr 2023 – Oct 2023',
    points: [
      'Onboarded and trained 4+ interns across departments.',
      'Ran weekly workshops and coaching on digital tools and workplace culture.',
      'Evaluated intern progress and reported to management.',
    ],
  },
];

export const education = {
  degree: 'Bachelor of Arts, Sociology',
  school: 'University of Yaoundé 1',
  date: 'Dec 2020',
  note: 'Studying how people behave in groups turned out to be useful for designing websites: most usability problems are really communication problems.',
};

export const skills = [
  { group: 'Build', items: ['HTML5', 'CSS3', 'Responsive design', 'Semantic markup', 'Cross-browser compatibility'] },
  { group: 'Platforms', items: ['WordPress', 'CMS platforms', 'Git', 'Hosting & deployment'] },
  { group: 'Improve', items: ['UI enhancement', 'Web performance', 'Usability', 'Testing before release'] },
  { group: 'Work', items: ['Team leadership', 'Stakeholder communication', 'Time management', 'Training & mentoring'] },
];

export const alsoSkills = 'Also: graphic design, branding and print design under the Web Illustrators name. Currently deepening JavaScript and PHP.';

export const languages = 'English (first language) · French (elementary, A2)';

export const workProcess = [
  { num: '01', title: 'Conversation', text: 'We talk about your business, your customers and what the site must achieve. You get a written scope and a fixed quote.' },
  { num: '02', title: 'Structure & design', text: 'I map the pages and content, then show you the key layouts on desktop and mobile before building.' },
  { num: '03', title: 'Build & test', text: 'I build with clean, responsive code and test on real phones and browsers. You review on a private preview link.' },
  { num: '04', title: 'Launch & care', text: 'I set up the domain, hosting and SSL, launch, and stay available for fixes, updates and improvements.' },
];

export const principles = [
  { title: 'Mobile first, always', text: 'Most visitors in Cameroon arrive on a phone, often on mobile data. I design for that screen and connection first.' },
  { title: 'Plain language', text: 'You will always know what I am doing and why, without technical jargon.' },
  { title: 'Finished means launched', text: 'A project is done when the site is live, tested and in your hands, not when the code compiles.' },
  { title: 'Honest scope', text: 'If something is outside what I do well, I will say so and point you to the right person.' },
];

export const about = {
  title: 'About Tening Boris — Frontend Developer in Yaoundé',
  description:
    'Tening Boris is a frontend developer in Yaoundé, Cameroon. Three years at Highupweb, 15+ websites launched, now working freelance with businesses in Africa and abroad.',
  headline: 'I build websites that people find easy to use.',
  lede:
    "I'm Tening Boris, a frontend developer based in Yaoundé, Cameroon. I also work under the name Web Illustrators.",
  story: [
    'I started in web development through design: making things look right and feel clear. That led me to Highupweb, a digital agency in Yaoundé, where I spent three years as a Front End Developer, from October 2021 to December 2024.',
    'At Highupweb I built and maintained responsive websites for clients across e-commerce, healthcare supply, education and local services. I led several of those projects, working between designers, product owners and the business owners themselves, and I took more than fifteen sites through hosting, deployment and launch.',
    'In 2023 I also coordinated the internship programme, onboarding and training new interns and running weekly workshops. Teaching others made me more careful about writing code that someone else can understand and maintain.',
    'Today I work independently with businesses in Cameroon, elsewhere in Africa and internationally, and I am open to remote roles with product teams and agencies.',
  ],
};

export const servicesPage = {
  title: 'Website Development Services in Cameroon — Tening Boris',
  description:
    'Business websites, WordPress development, redesigns, speed optimisation and maintenance for businesses in Cameroon and across Africa. Fixed quotes, clear process.',
  headline: 'Services built around what your website has to do.',
  lede:
    'Each service below comes from work I did every week at a digital agency. Pick one, or combine them into a complete project.',
};

export const workPage = {
  title: 'Portfolio — Websites Built by Tening Boris',
  description:
    'Case studies of websites Tening Boris led at Highupweb in Yaoundé: e-commerce stores, a medical-equipment catalogue, a training academy and a driving school.',
  headline: 'Selected work',
  lede:
    'Five client websites I led as part of the Highupweb team in Yaoundé. Each opens to a short case study, with a link to the live site.',
  credit: 'All projects: designed by Highupweb, with Tening Boris as project lead.',
};

export const contactPage = {
  title: 'Contact Tening Boris — Start Your Website Project',
  description:
    'Tell me about your website project. Freelance frontend and WordPress development in Yaoundé, Cameroon, for clients in Africa and worldwide. WhatsApp or form.',
  headline: "Let's discuss your project.",
  lede:
    'Tell me what you need and I will reply with questions, a suggested approach and an estimate. No obligation.',
  projectTypes: [
    'New business website',
    'WordPress / CMS website',
    'Redesign of an existing site',
    'Speed & usability improvements',
    'Maintenance & support',
    'Agency collaboration / remote role',
    'Something else',
  ],
  budgets: [
    'Under 300,000 FCFA (≈ $500)',
    '300,000 – 750,000 FCFA (≈ $500 – $1,250)',
    '750,000 – 1,500,000 FCFA (≈ $1,250 – $2,500)',
    'Above 1,500,000 FCFA (≈ $2,500+)',
    'Not sure yet',
  ],
};

export const faq = [
  { q: 'Do you work with clients outside Cameroon?', a: 'Yes. I work remotely with clients anywhere, in English, and communicate by email, WhatsApp or video call. I work on West Africa Time (UTC+1).' },
  { q: 'How much does a website cost?', a: 'It depends on the number of pages, features and who writes the content. After a short conversation I send a fixed quote, so there are no surprises.' },
  { q: 'Can I update the website myself?', a: 'If you want to, yes. I can build on WordPress and show you how to edit pages, posts and products.' },
  { q: 'Do you handle hosting and the domain?', a: 'Yes. I can set up the domain, hosting and SSL certificate, or work with the provider you already have.' },
];
