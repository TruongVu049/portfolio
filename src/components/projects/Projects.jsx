import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { PROJECTS } from '../../data/projects'
import ProjectDetail from './ProjectDetail'

const pad = (n) => String(n).padStart(2, '0')

function ProjectList({ activeIndex, onSelect }) {
  return (
    <ol className="flex flex-col">
      {PROJECTS.map((project, i) => {
        const active = i === activeIndex
        return (
          <li key={project.slug} className="border-b border-white/[0.06]">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={active}
              className="group relative flex w-full cursor-pointer items-center gap-8 py-5 pl-2 text-left"
            >
              {active && (
                <motion.span
                  layoutId="project-indicator"
                  className="absolute inset-y-2 left-0 w-px bg-accent"
                  transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                />
              )}
              <span className={`w-6 font-mono text-[11px] ${active ? 'text-accent-soft' : 'text-zinc-600'}`}>{pad(i + 1)}</span>
              <span
                className={`font-display text-3xl tracking-tight transition-all duration-500 ${active ? 'translate-x-1 text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}
              >
                {project.short}
              </span>
              {active && (
                <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">{project.stack}</span>
              )}
            </button>
          </li>
        )
      })}
    </ol>
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
          <Reveal className="hidden lg:block">
            <ProjectList activeIndex={state.index} onSelect={select} />
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
