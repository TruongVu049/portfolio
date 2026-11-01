// Skills grouped by depth of experience. No percentage bars: each group says how
// the skills were used and, where it applies, which projects used them.
// `usedIn` holds project slugs from ./projects.js.

export const EXPERTISE = [
  {
    group: 'Core Expertise',
    level: 'Daily, in production',
    items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'HTML', 'CSS', 'Tailwind CSS'],
    usedIn: ['po5-commerce', 'meu-omni-pos', 'fosco-erp', 'bp-approval-portal'],
  },
  {
    group: 'Frontend Engineering',
    level: 'In production',
    items: ['TanStack Query', 'Zustand', 'React Hook Form', 'Zod', 'Offline-first (IndexedDB)', 'i18n', 'API integration'],
    usedIn: ['meu-omni-pos', 'fosco-erp', 'po5-commerce'],
  },
  {
    group: 'Backend & Database',
    level: 'Growing · ~1 year',
    items: ['Node.js', 'Medusa v2', 'PostgreSQL', 'Redis', 'RabbitMQ', 'REST APIs'],
    usedIn: ['po5-commerce'],
  },
  {
    group: 'Development & Deployment',
    level: 'Working knowledge',
    items: ['Git', 'Docker', 'Linux', 'Nginx', 'CI/CD'],
    usedIn: [],
  },
  {
    group: 'Engineering Practices',
    level: 'Applied every day',
    items: ['Component architecture', 'Clean code', 'Debugging', 'Performance optimisation', 'System design fundamentals'],
    usedIn: [],
  },
]
