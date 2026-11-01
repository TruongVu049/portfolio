import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import GlowCard from '../ui/GlowCard'
import { caseStudyHref } from '../../hooks/useCaseStudyRoute'
import { ProjectVisual } from './visuals'

const EASE = [0.22, 1, 0.36, 1]
const pad = (n) => String(n).padStart(2, '0')

/** "Company project" or "Personal project", plus a status such as "In progress". */
export function ProjectBadge({ project }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
      {project.kind === 'personal' ? 'Personal project' : 'Company project'}
      {project.status && (
        <>
          <span className="text-zinc-700">/</span>
          <span className="text-amber-400">{project.status}</span>
        </>
      )}
    </span>
  )
}

function NavButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
    >
      {children}
    </button>
  )
}

/** Role, timeline and core stack, taken from the case study. */
function ProjectFacts({ project }) {
  const facts = [
    { label: 'Role', value: project.caseStudy.role.title },
    { label: 'Timeline', value: project.caseStudy.role.timeline },
    { label: 'Core', value: project.stack },
  ]
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
      {facts.map(({ label, value }) => (
        <div key={label}>
          <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">{label}</dt>
          <dd className="mt-2 text-sm leading-6 text-zinc-200">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Large card for the currently selected project, with swipe + pager controls. */
export default function ProjectDetail({ project, index, total, direction, onPrev, onNext, onSelect }) {
  return (
    <GlowCard className="flex min-h-[560px] flex-col overflow-hidden p-6 sm:p-10 lg:min-h-[820px] xl:min-h-[760px]">
      {/* Corner light; -z-10 keeps it under the content inside the card's isolated stack. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_45%_at_100%_0%,rgba(59,130,246,0.14),transparent)]"
      />
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={project.slug}
          custom={direction}
          initial={{ opacity: 0, x: direction * 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -40 }}
          transition={{ duration: 0.45, ease: EASE }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.x < -60) onNext()
            else if (info.offset.x > 60) onPrev()
          }}
          className="relative flex flex-1 flex-col touch-pan-y"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[9rem] leading-none text-transparent [-webkit-text-stroke:1px_var(--color-zinc-700)] sm:text-[12rem]"
          >
            {pad(index + 1)}
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Project {pad(index + 1)} / {pad(total)}
            </p>
            <ProjectBadge project={project} />
          </div>
          <p className="mt-8 font-mono text-xs text-accent-soft">{project.category}</p>
          {/* The short name keeps the heading on one line; a longer official name goes underneath. */}
          <h3 className="relative mt-2 font-display text-5xl leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {project.short}
          </h3>
          {project.title !== project.short && <p className="mt-3 text-sm text-zinc-500">{project.title}</p>}
          <p className="mt-6 max-w-xl text-base leading-8 text-zinc-400">{project.description}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs text-zinc-300">
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-8 pt-10">
            <ProjectFacts project={project} />
            {/* Fills the card on wider screens; phones get the full version in the case study. */}
            <div className="hidden sm:block">
              <ProjectVisual project={project} compact />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/[0.08] pt-6">
        <div className="flex items-center gap-3">
          <NavButton label="Previous project" onClick={onPrev}><ArrowLeft size={18} /></NavButton>
          <NavButton label="Next project" onClick={onNext}><ArrowRight size={18} /></NavButton>
          <div className="ml-3 hidden items-center gap-1.5 sm:flex">
            {Array.from({ length: total }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show project ${i + 1}`}
                onClick={() => onSelect(i)}
                className={`h-1 cursor-pointer rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-accent' : 'w-1.5 bg-zinc-700 hover:bg-zinc-500'}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-zinc-200 hover:border-accent/60 hover:bg-accent/10 hover:text-white sm:inline-flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live site
            </a>
          )}
          <a
            href={caseStudyHref(project.slug)}
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Read case study
            <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </GlowCard>
  )
}
