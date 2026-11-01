import {
  SiCss,
  SiDocker,
  SiGit,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMedusa,
  SiNextdotjs,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiRabbitmq,
  SiReact,
  SiReacthookform,
  SiReactquery,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
  SiZod,
} from 'react-icons/si'

// Logos that are pure black/white: rendered in the current text colour.
export const MONO = 'mono'

export const SKILL_CATEGORIES = ['All', 'Frontend', 'Backend', 'DevOps']

// size = relative bubble scale (1 = base). Larger for the tools used most in production.
export const SKILLS = [
  { name: 'TypeScript', icon: SiTypescript, color: '#3178c6', category: 'Frontend', size: 1.3 },
  { name: 'React', icon: SiReact, color: '#61dafb', category: 'Frontend', size: 1.3 },
  { name: 'Next.js', icon: SiNextdotjs, color: MONO, category: 'Frontend', size: 1.25 },
  { name: 'JavaScript', icon: SiJavascript, color: '#f7df1e', category: 'Frontend', size: 1.15 },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#38bdf8', category: 'Frontend', size: 1.1 },
  { name: 'HTML', icon: SiHtml5, color: '#e34f26', category: 'Frontend', size: 1.0 },
  { name: 'CSS', icon: SiCss, color: '#1572b6', category: 'Frontend', size: 1.0 },
  { name: 'TanStack Query', icon: SiReactquery, color: '#ff4154', category: 'Frontend', size: 1.0 },
  { name: 'React Hook Form', icon: SiReacthookform, color: '#ec5990', category: 'Frontend', size: 0.95 },
  { name: 'Zod', icon: SiZod, color: '#408afd', category: 'Frontend', size: 0.92 },
  { name: 'Node.js', icon: SiNodedotjs, color: '#5fa04e', category: 'Backend', size: 1.05 },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169e1', category: 'Backend', size: 1.0 },
  { name: 'Medusa', icon: SiMedusa, color: MONO, category: 'Backend', size: 0.95 },
  { name: 'Redis', icon: SiRedis, color: '#ff4438', category: 'Backend', size: 0.9 },
  { name: 'RabbitMQ', icon: SiRabbitmq, color: '#ff6600', category: 'Backend', size: 0.88 },
  { name: 'Git', icon: SiGit, color: '#f05032', category: 'DevOps', size: 1.05 },
  { name: 'Docker', icon: SiDocker, color: '#2496ed', category: 'DevOps', size: 0.95 },
  { name: 'Linux', icon: SiLinux, color: MONO, category: 'DevOps', size: 0.9 },
  { name: 'Nginx', icon: SiNginx, color: '#009639', category: 'DevOps', size: 0.88 },
  { name: 'CI/CD', icon: SiGithubactions, color: '#2088ff', category: 'DevOps', size: 0.88 },
]
