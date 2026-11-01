import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { PROJECTS } from '../../data/projects'
import ProjectDetail from './ProjectDetail'

const pad = (n) => String(n).padStart(2, '0')
const EASE = [0.22, 1, 0.36, 1]
const INDICATOR_SPRING = { type: 'spring', stiffness: 400, damping: 36 }

function ProjectList({ activeIndex, onSelect }) {
  return (
    <ol className="flex flex-col">
      {PROJECTS.map((project, i) => {
        const active = i === activeIndex
        return (
          <li key={project.slug} className="border-b border-white/[0.06] py-1">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active}
              className="group relative flex w-full cursor-pointer items-center gap-6 rounded-2xl py-4 pl-4 pr-4 text-left"
            >
              {active && (
                <>
                  <motion.span
                    layoutId="project-highlight"
                    className="absolute inset-0 rounded-2xl bg-linear-to-r from-accent/[0.12] via-accent/[0.04] to-transparent"
                    transition={INDICATOR_SPRING}
                  />
                  <motion.span
                    layoutId="project-indicator"
                    className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-accent"
                    transition={INDICATOR_SPRING}
                  />
                </>
              )}
              <span className={`relative w-6 font-mono text-[11px] ${active ? 'text-accent-soft' : 'text-zinc-600'}`}>{pad(i + 1)}</span>
              <span className="relative flex min-w-0 flex-col gap-1">
                <span
                  className={`font-display text-3xl tracking-tight transition-all duration-500 ${active ? 'translate-x-1 text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                >
                  {project.short}
                </span>
                <span
                  className={`truncate font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'translate-x-1 text-zinc-400' : 'text-zinc-600'}`}
                >
                  {project.category}
                </span>
              </span>
              <ArrowRight
                size={18}
                className={`relative ml-auto flex-none transition-all duration-300 ${active ? 'text-accent-soft opacity-100' : '-translate-x-1 text-zinc-500 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`}
              />
            </button>
          </li>
        )
      })}
    </ol>
  )
}

// Counts such as "314", "3,300" or "20+"; years (19xx/20xx) are left alone.
const FIGURE = /((?<!\d)(?!(?:19|20)\d\d\b)\d(?:[\d,]*\d)?\+?%?)/

/** Wraps the figures in a result ("314 of 452 commits") so they stand out. */
function emphasiseNumbers(text) {
  return text.split(FIGURE).map((part, i) =>
    i % 2 ? (
      <strong key={i} className="font-medium text-white">
        {part}
      </strong>
    ) : (
      part
    ),
  )
}

/** The selected project's headline results, from its case study. */
function ProjectOutcomes({ project }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Outcomes</p>
      <AnimatePresence mode="wait">
        <motion.ul
          key={project.slug}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-4 flex flex-col gap-3"
        >
          {project.caseStudy.results.slice(0, 2).map((result) => (
            <li key={result} className="flex gap-3 text-sm leading-6 text-zinc-400">
              <Check size={15} className="mt-1 flex-none text-accent-soft" />
              <span>{emphasiseNumbers(result)}</span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  )
}

export default function Projects() {
  const [state, setState] = useState({ index: 0, direction: 1 })
  const sectionRef = useRef(null)
  const total = PROJECTS.length

  const select = useCallback(
    (next) => setState(({ index }) => ({ index: (next + total) % total, direction: next >= index ? 1 : -1 })),
    [total],
  )
  const next = useCallback(() => setState(({ index }) => ({ index: (index + 1) % total, direction: 1 })), [total])
  const prev = useCallback(() => setState(({ index }) => ({ index: (index - 1 + total) % total, direction: -1 })), [total])

  // Arrow keys switch projects while the section is on screen.
  useEffect(() => {
    let visible = false
    const observer = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0.4 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    const onKey = (e) => {
      if (!visible) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      observer.disconnect()
      window.removeEventListener('keydown', onKey)
    }
  }, [next, prev])

  return (
    <section id="Projects" ref={sectionRef} className="relative overflow-hidden bg-black px-5 py-20 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-lines mask-radial absolute inset-0 opacity-50" />
        <div className="absolute -left-[18%] top-1/4 h-[760px] w-[760px] bg-[radial-gradient(closest-side,rgba(29,78,216,0.1),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-[80rem]">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading index="01" eyebrow="Selected work" title="Featured" accent="projects." compact />
          <p className="mb-6 hidden font-mono text-xs text-zinc-500 sm:block">
            {pad(state.index + 1)} / {pad(total)}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
          {/* Stretches to the card's height: list on top, outcomes level with the card footer. */}
          <Reveal className="hidden gap-8 lg:flex lg:flex-col lg:justify-between">
            <ProjectList activeIndex={state.index} onSelect={select} />
            <ProjectOutcomes project={PROJECTS[state.index]} />
          </Reveal>
          <Reveal delay={0.1}>
            <ProjectDetail
              project={PROJECTS[state.index]}
              index={state.index}
              total={total}
              direction={state.direction}
              onPrev={prev}
              onNext={next}
              onSelect={select}
            />
          </Reveal>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          Click a project · use ← → · or swipe
        </p>
      </div>
    </section>
  )
}
