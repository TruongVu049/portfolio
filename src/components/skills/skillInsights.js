import { EXPERTISE } from '../../data/expertise'
import { PROJECTS } from '../../data/projects'
import { SKILLS } from './skills.data'

// A project tag can imply a tool it is built on: every Next.js project is a React
// project, and every TypeScript project ships JavaScript.
const IMPLIED_BY = { React: ['Next.js'], JavaScript: ['TypeScript'] }

/** "React 19" and "Medusa v2" count as React and Medusa; "React Hook Form" does not count as React. */
function matchesTag(name, tag) {
  if (tag === name) return true
  return tag.startsWith(`${name} `) && /^v?\d/.test(tag.slice(name.length + 1))
}

function levelFor(name) {
  const group =
    EXPERTISE.find((g) => g.items.includes(name)) ?? EXPERTISE.find((g) => g.items.some((item) => matchesTag(name, item)))
  return group?.level ?? null
}

function projectsFor(name) {
  const names = [name, ...(IMPLIED_BY[name] ?? [])]
  return PROJECTS.filter((project) => project.tags.some((tag) => names.some((n) => matchesTag(n, tag))))
}

/** Per skill: how deeply it has been used and in which projects, derived from the site data. */
export const SKILL_INSIGHTS = new Map(
  SKILLS.map((skill) => [skill.name, { level: levelFor(skill.name), projects: projectsFor(skill.name) }]),
)
