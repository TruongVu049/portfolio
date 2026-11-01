// Selected projects and their case studies.
//
// Company projects: describe only the parts you personally built or solved, and
// never publish source code, customer data or internal documents without permission.

export const PROJECTS = [
  {
    slug: 'po5-commerce',
    short: 'PowerShop',
    title: 'PowerShop',
    category: 'E-commerce · Affiliate · Payments',
    stack: 'Medusa',
    tags: ['Medusa v2', 'Next.js', 'TypeScript', 'PostgreSQL', 'Redis', 'RabbitMQ'],
    kind: 'company',
    description:
      'A direct-to-consumer commerce platform with a multi-level affiliate programme, built on Medusa v2 and connected to payment, shipping and commission systems.',
    links: { live: 'https://powershop.vn/' },
    caseStudy: {
      overview:
        'PowerShop replaced a legacy Magento store and added an affiliate programme. Shoppers buy online, partners track referrals, ranks and earnings in their own portal, and operations, finance and support staff run everything from one back-office.',
      role: {
        title: 'Main developer · full-stack',
        timeline: 'Jul 2026 – present',
        team: 'Six developers; I made about 70% of the commits',
        responsibilities: [
          'Payments end to end: OnePay through the commission engine, SePay bank transfers, reconciliation, payment expiry, refunds and two-person approval for manual settlement.',
          'The integration with a commission engine owned by another team: a transactional outbox and inbox over RabbitMQ with signed, versioned event contracts.',
          'Affiliate features: referral capture, a partner portal with referral tree, ranks and wallet, and agent registration through a paid package.',
          'Fulfilment with ViettelPost (labels, multiple warehouses, webhook status updates, returns) and stock reservation guards.',
          'Migrated the storefront to Next.js, customised the Medusa admin, and added role-based access control and audit logs.',
        ],
      },
      challenges: [
        {
          problem: 'Overlapping scheduled runs could send the same order event to the commission engine twice.',
          solution:
            'The outbox dispatcher claims each row with a token under a lock, only the current holder can mark it sent, and failed sends retry with exponential backoff.',
        },
        {
          problem: 'Payment confirmations arrive at least once, through both RabbitMQ and HTTP callbacks, and occasionally not at all.',
          solution:
            'Both paths share one ingestion flow with a unique inbox index, so duplicates are harmless, and a reconciliation job re-checks payments still pending after ten minutes, for up to seven days.',
        },
        {
          problem: 'ViettelPost retries any webhook slower than one second, and our handler took 1.2–2.2 seconds on staging.',
          solution: 'The handler now only records the new status and responds; the follow-up updates run in an asynchronous subscriber.',
        },
      ],
      architecture: ['Storefront & admin', 'Medusa v2 API', 'PostgreSQL · Redis', 'Outbox / inbox · RabbitMQ', 'Payments · shipping · commissions'],
      results: [
        'Live in production at powershop.vn since October 2026.',
        '314 of 452 commits, the most of anyone on the backend, storefront and admin.',
        'More than 500 unit tests passing at the August 2026 internal review.',
      ],
      learnings: [
        'In payment flows, assume every message can arrive twice, late or never, and design idempotency and reconciliation first.',
        'Clear, versioned contracts are what make it possible to integrate with a service another team owns.',
      ],
    },
  },
  {
    slug: 'meu-omni-pos',
    short: 'MeU Omni POS',
    title: 'MeU Omni POS',
    category: 'SaaS · POS · Offline-first',
    stack: 'Next.js',
    tags: ['Next.js', 'TypeScript', 'IndexedDB', 'Service Worker', 'TanStack Query', 'SignalR'],
    kind: 'company',
    description:
      'A multi-tenant point-of-sale SaaS for retail shops: back-office, cashier screen and tenant admin, built to keep selling when the connection drops.',
    links: {},
    caseStudy: {
      overview:
        'MeU Omni POS is a SaaS for retail shops. Owners manage products, stock, purchasing, staff, cash and reports in the back-office, and cashiers sell from a POS screen. A lost connection must never stop a sale, so the POS works offline and syncs when the network returns.',
      role: {
        title: 'Main frontend developer',
        timeline: 'Apr 2026 – Sep 2026',
        team: 'About ten contributors with a .NET backend team; I made about 90% of the frontend commits',
        responsibilities: [
          'Set up the project: Next.js App Router, design system and theming, an API client generated from OpenAPI with Orval, and team coding guidelines.',
          'Built every back-office module (products, price books, purchasing, stock-takes, invoices, customers, staff and payroll, cash book, eight reports, settings) and the tenant admin portal.',
          'Built the cashier screen: shifts, checkout, held orders, customer-group pricing, returns, payment reconciliation, printing and keyboard shortcuts.',
          'Designed and wrote the offline engine on my own: service worker, IndexedDB storage, offline session and sync queue.',
          'Authentication with token refresh, role-based permissions, audit log and real-time updates over SignalR.',
        ],
      },
      challenges: [
        {
          problem: 'If a sync crashed halfway through an offline bill, the shop could end up with a duplicate or half-created bill.',
          solution:
            'Every submit path goes through one bill pipeline that checkpoints after the bill is created, checks the server when it resumes, and cancels the draft if a later step fails. Payments are compared so only the missing amount is posted.',
        },
        {
          problem: 'Replaying offline sales is risky: a request can fail for a moment, conflict for good, or carry a payment that cannot be verified offline.',
          solution:
            'Bills replay oldest first. A temporary failure pauses the batch, a conflict is skipped and shown to the cashier, non-cash offline payments go to manual review, and a Web Lock stops two tabs replaying the same queue.',
        },
        {
          problem: 'A double click, or a hotkey firing with a click, could submit the same order twice before React re-rendered.',
          solution: 'A synchronous lock per invoice tab blocks the second submit, and a single price resolver keeps group pricing consistent across components.',
        },
      ],
      architecture: ['Next.js · admin & POS', 'TanStack Query · Orval client', 'Service Worker · IndexedDB · sync queue', '.NET API · SignalR'],
      results: [
        '77 pages, 64 of them in the back-office, shipped to staging through GitLab CI and Docker.',
        'About 160 automated tests (Vitest with fake IndexedDB) covering POS money logic and offline storage.',
        '189 of 210 commits in the frontend repository.',
      ],
      learnings: [
        'Offline-first is mostly about failure cases: partial writes, retries, conflicts and multiple tabs.',
        'In a POS, the money logic deserves tests before anything else.',
      ],
    },
  },
  {
    slug: 'fosco-erp',
    short: 'FOSCO ERP',
    title: 'FOSCO ERP',
    category: 'ERP · HR services · Approval workflows',
    stack: 'React',
    tags: ['React 19', 'TypeScript', 'TanStack Query', 'React Hook Form', 'Zod', 'i18next'],
    kind: 'company',
    description:
      'A large bilingual ERP for an HR-services company that manages staff for foreign organisations: clients, payroll, foreign labour, documents and archives.',
    links: {},
    caseStudy: {
      overview:
        'FOSCO uses this internal ERP to manage its client organisations and their staff, payroll and income tax, foreign-labour recruitment, official documents and a paper-records archive. It is a large codebase of about 3,500 source files and 100+ pages, in Vietnamese and English.',
      role: {
        title: 'Frontend developer',
        timeline: 'Jun 2025 – Sep 2025',
        team: 'About ten frontend developers; I owned the recruitment module',
        responsibilities: [
          'Foreign-labour recruitment: forms, status tabs, a detail page with approve, reject-with-reason and close steps, and expandable tables listing each recruitment’s candidates.',
          'Candidates and workers: lists, create and detail pages, converting approved candidates into workers, and template-based exports.',
          'Statistics dashboards for customer, business and warehouse data, and revenue and expense reports with import and export.',
          'Accounting report screens: debt report, incoming payment analysis and overpayment list.',
          'Shipped every screen in Vietnamese and English (41 translation namespaces).',
        ],
      },
      challenges: [
        {
          problem: 'Recruitment and candidate forms are defined by the server, and edits should not resend unchanged data.',
          solution:
            'The forms build their validation from server field definitions. In edit mode only changed fields are sent, dates on the same day do not count as changes, and an untouched form sends nothing.',
        },
        {
          problem: 'After an approval, rejection or conversion to worker, other screens kept showing stale data.',
          solution: 'One shared helper refreshes every related cached query (lists, details, dropdown options, activity history) after each workflow action.',
        },
      ],
      architecture: ['React SPA · Vite', 'TanStack Query · Orval client', 'REST API', 'Socket.IO notifications'],
      results: [
        'About 30 pages: 21 for recruitment, 8 for statistics and 2 for accounting.',
        '126 commits over three months in a codebase with more than 3,300.',
      ],
      learnings: [
        'In approval workflows, the hard part is keeping cached data consistent across screens after every action.',
        'Building bilingual from the first screen is cheaper than translating afterwards.',
      ],
    },
  },
  {
    slug: 'bp-approval-portal',
    short: 'BP Portal',
    title: 'Business Partner Approval Portal',
    category: 'Enterprise · SAP · Maintenance',
    stack: 'Next.js',
    tags: ['Next.js', 'TypeScript', 'MUI', 'React Hook Form', 'Yup', 'Azure AD'],
    kind: 'company',
    description:
      'An enterprise portal where staff request changes to SAP Business Partner data, such as customers, vendors and employees, and route them through multi-step approvals.',
    links: {},
    caseStudy: {
      overview:
        'Staff use the portal to create, extend, revise or disable Business Partner records. Each request follows an approval route chosen from what changed, then reaches SAP. I joined about 15 months in, on a codebase with 4,000+ commits from 20+ developers, to fix bugs and deliver change requests.',
      role: {
        title: 'Frontend developer · maintenance',
        timeline: 'Aug 2025 – Oct 2026',
        team: '20+ contributors over the life of the project',
        responsibilities: [
          'Fixed bugs and delivered change requests in the request forms and the approver screens.',
          'Reworked the logic that picks the approval route for revise, extend, ship-to and disable requests.',
          'Added the validation rules the business asked for: duplicate tax numbers, postal codes, bank fields and payment-term prefixes.',
          'Kept sessions and security up to date: automatic logout on expiry, idle timeout, security headers and Next.js security upgrades.',
        ],
      },
      challenges: [
        {
          problem: 'Revise requests took the wrong approval route when several data views changed at once, and the rules were not documented.',
          solution:
            'I wrote the existing conditions down as decision tables before touching the code, then reworked the logic so a payment-term change takes priority over general changes.',
        },
        {
          problem: 'Users whose session had expired stayed on the page and ran into errors instead of being signed out.',
          solution: 'Handled expiry in the MSAL configuration and an Axios interceptor so the app signs out cleanly, then added an idle timeout.',
        },
        {
          problem: 'Requests with duplicate tax numbers could be submitted.',
          solution: 'Added a duplicate check to every create form that ignores the request’s own record.',
        },
      ],
      architecture: ['Next.js portal', 'Azure AD · MSAL', 'REST API', 'SAP · data warehouse'],
      results: [
        '50 commits: about 25 change requests and 15 bug fixes.',
        'More than a year maintaining a production approval system.',
      ],
      learnings: [
        'In an unfamiliar codebase, write the existing rules down before changing them.',
        'Small edits to approval logic need careful checking, because they decide who approves what.',
      ],
    },
  },
]

export const findProject = (slug) => PROJECTS.find((project) => project.slug === slug)
