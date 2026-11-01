import { AnimatePresence, motion } from 'framer-motion'
import { MONO } from './skills.data'
import { SKILL_INSIGHTS } from './skillInsights'

const FADE = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.18, ease: 'easeOut' },
}

function ActiveSkill({ skill }) {
  const { level, projects } = SKILL_INSIGHTS.get(skill.name) ?? { level: null, projects: [] }
  const Icon = skill.icon
  const color = skill.color === MONO ? 'var(--color-white)' : skill.color
  return (
    <motion.div key={skill.name} {...FADE} className="relative">
      {/* Oversized, faint logo filling the empty top-right of the pit. */}
      <Icon className="absolute -top-2 right-0 hidden size-56 opacity-[0.07] sm:block lg:size-64" color={color} />
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
        {skill.category}
        {level && <span className="text-accent-soft"> · {level}</span>}
      </p>
      <div className="mt-3 flex items-center gap-4">
        <Icon className="size-9 flex-none sm:size-11" color={color} />
        <h3 className="font-display text-4xl leading-none tracking-tight text-white sm:text-6xl">{skill.name}</h3>
      </div>
      {projects.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">Used in</span>
          {projects.map((project) => (
            <span
              key={project.slug}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300"
            >
              {project.short}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/**
 * Read-out in the empty upper part of the pit: an invitation while idle, then the
 * hovered or grabbed tool with its level and the projects it shipped in.
 * Decorative for pointer users; the same facts are listed accessibly above the pit.
 */
export default function SkillInspector({ skill, total }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-6 sm:inset-x-10 sm:top-9">
      <AnimatePresence mode="wait" initial={false}>
        {skill ? (
          <ActiveSkill key={skill.name} skill={skill} />
        ) : (
          <motion.div key="idle" {...FADE}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">Inspector · {total} tools</p>
            <h3 className="mt-3 font-display text-4xl leading-none tracking-tight text-zinc-500 sm:text-6xl">
              Grab a bubble<em className="text-zinc-700">.</em>
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">
              Poke, drag or flick them. Each one shows how deeply I have used it and where.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
