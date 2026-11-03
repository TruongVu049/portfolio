// Single source of truth for the personal content on the site.
// Projects and case studies live in ./projects.js, skills in ./expertise.js.
// Lines marked TODO still hold placeholders: replace them with your own details.

export const PROFILE = {
  firstName: 'Truong Vu',
  lastName: 'Nguyen',
  initials: 'TV',
  role: 'Full-stack Developer',
  focus: 'React · Next.js · Node.js',
  tagline: { plain: 'Commerce, POS and enterprise apps', script: 'that keep working when things fail.' },
  positioning: 'Full-stack developer with a strong frontend core and production backend work since 2026: offline-first POS, payments and enterprise workflows.',
  location: 'Ho Chi Minh City, Vietnam',
  locationShort: 'HCMC, VN',
  timeZone: 'Asia/Ho_Chi_Minh',
  email: 'nguyenvu492003@gmail.com',
  available: true,
  // Drop your CV at public/resume.pdf and set this to '/resume.pdf' to show the download button.
  resumeUrl: '',
  // An empty URL hides that icon everywhere on the site.
  socials: {
    github: 'https://github.com/TruongVu049',
    linkedin: '',
  },
}

export const BADGE_TEXT = 'FULL-STACK DEVELOPER • REACT • NODE.JS • '

export const TERMINAL_LINES = [
  { kind: 'type', text: '$ whoami' },
  { kind: 'line', text: '✔ ~2 yrs frontend · commerce, POS, ERP' },
  { kind: 'line', text: '✔ backend in production since Jul 2026 · Medusa' },
  { kind: 'type', text: 'next → deeper backend → system design', muted: true },
]

export const ABOUT = {
  intro:
    "I'm a software developer who enjoys turning complex business requirements into practical, maintainable web applications.",
  paragraphs: [
    'My strongest area is frontend development with React, Next.js and TypeScript. Since July 2026 I have also owned backend modules in production: payments, messaging and fulfilment on a Medusa v2 commerce platform.',
    "I'm still early on the backend side, so I keep studying Node.js, PostgreSQL and system design alongside the work. My long-term goal is to grow into an engineer who can understand, design and build reliable software systems end to end.",
  ],
  chapters: [
    {
      n: '01',
      title: 'Frontend Engineering',
      body: 'Shipping real-world web applications: component design, state management, API integration, and the UX and performance details users actually feel.',
    },
    {
      n: '02',
      title: 'System Thinking',
      body: 'Following the business flow and the data flow end to end, and understanding how the frontend, backend, database and external systems connect.',
    },
    {
      n: '03',
      title: 'Engineering Growth',
      body: 'Deepening backend, database, DevOps and system design knowledge, from my first production modules toward software architecture.',
    },
  ],
  // `project` links a topic to the case study where it was applied in production.
  learning: [
    { icon: 'server', label: 'Node.js', text: 'Event loop, async patterns and how backend services are structured.', project: 'po5-commerce' },
    { icon: 'database', label: 'PostgreSQL', text: 'Indexes, transactions, joins and reading query plans.', project: 'po5-commerce' },
    { icon: 'network', label: 'System design', text: 'Consistency, caching, queues and the trade-offs between them.', project: 'po5-commerce' },
    { icon: 'container', label: 'DevOps', text: 'Docker, Linux, Nginx and CI/CD pipelines for shipping safely.' },
  ],
}

export const EXPERIENCE = [
  {
    stage: '01',
    badge: 'Frontend',
    title: 'Frontend Developer',
    company: 'MeU Solutions',
    place: 'Ho Chi Minh City',
    from: 'Dec 2024',
    to: 'Present',
    icon: 'code',
    body: 'Building commerce, point-of-sale and enterprise workflow applications with React, Next.js and TypeScript.',
    highlights: [
      'Main frontend developer of MeU Omni POS, including its offline-first sales engine.',
      'Built the recruitment module and the statistics and accounting report screens of a large bilingual ERP.',
      'Maintained an enterprise SAP approval portal: bug fixes, change requests and security upkeep.',
    ],
    projects: ['meu-omni-pos', 'fosco-erp', 'bp-approval-portal'],
  },
  {
    stage: '02',
    badge: 'Backend',
    title: 'Growing into backend',
    company: 'Node.js · Medusa · PostgreSQL',
    place: 'Self-study, then PowerShop at MeU Solutions',
    from: 'Late 2025',
    to: 'Present',
    icon: 'server',
    body: 'About six months of structured self-study, then my first production backend role: main developer of PowerShop since July 2026, a Medusa v2 commerce platform live since October 2026.',
    highlights: [
      'Built payment, shipping and affiliate workflows on Medusa v2 with PostgreSQL, Redis and RabbitMQ.',
      'Designed the outbox and inbox integration with a commission engine owned by another team.',
      'Keep studying databases, DevOps and system design alongside the work.',
    ],
    projects: ['po5-commerce'],
  },
]

export const NOTES = [
  {
    title: 'Understanding the Node.js Event Loop',
    summary: 'Phases of the event loop, blocking versus non-blocking work, and the bugs that show up when you get it wrong.',
    topics: ['Node.js', 'Runtime'],
    href: '', // add the article URL once it is published
  },
  {
    title: 'PostgreSQL for Application Developers',
    summary: 'Indexes, transactions and joins from the point of view of someone writing the queries, with real query plans.',
    topics: ['PostgreSQL', 'Performance'],
    href: '',
  },
  {
    title: 'Building Offline-first Web Applications',
    summary: 'IndexedDB, caching, sync strategies and conflict handling, drawn from working on a point-of-sale app.',
    topics: ['PWA', 'Sync'],
    href: '',
  },
  {
    title: 'Frontend Architecture in Next.js',
    summary: 'Splitting Server and Client Components, where logic should live, and the performance trade-offs of each choice.',
    topics: ['Next.js', 'Architecture'],
    href: '',
  },
]

// Only published notes are shown; with none, the section and its menu entry are hidden.
export const PUBLISHED_NOTES = NOTES.filter((note) => note.href)

export const MARQUEE_WORDS = ['RELIABLE', 'SCALABLE', 'USER-FOCUSED', 'MAINTAINABLE', 'TYPE-SAFE']

export const FOOTER = {
  headline: 'Turning complex business requirements into',
  accent: 'reliable, maintainable software.',
  blurb: 'Strong on the frontend, growing on the backend, and always curious about how the whole system fits together.',
}
