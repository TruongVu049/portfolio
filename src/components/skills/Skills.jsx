import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import GlowCard from '../ui/GlowCard'
import BubblePit from './BubblePit'
import SkillInspector from './SkillInspector'
import ExpertiseList from './ExpertiseList'
import { SKILL_CATEGORIES, SKILLS } from './skills.data'

function countFor(category) {
  return category === 'All' ? SKILLS.length : SKILLS.filter((s) => s.category === category).length
}

function CategoryTabs({ active, onChange }) {
  return (
    <div role="tablist" aria-label="Filter skills" className="flex flex-wrap items-center gap-1">
      {SKILL_CATEGORIES.map((category) => {
        const selected = category === active
        return (
          <button
            key={category}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => onChange(category)}
            className={`relative cursor-pointer rounded-full px-4 py-2 text-[15px] ${selected ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
          >
            {selected && (
              <motion.span
                layoutId="skill-tab"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">
              {category} <sup className="ml-0.5 text-[11px] opacity-70">{countFor(category)}</sup>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState('All')
  const [inspected, setInspected] = useState(null)
  const selectCategory = (category) => {
    setActive(category)
    setInspected(null)
  }
  const visible = useMemo(
    () => (active === 'All' ? SKILLS : SKILLS.filter((s) => s.category === active)),
    [active],
  )

  return (
    <section id="Expertise" className="relative bg-black px-5 py-20 sm:px-8 lg:px-12">
      <div className="relative mx-auto max-w-[80rem]">
        <SectionHeading
          index="02"
          eyebrow="What I work with"
          title="Technical"
          accent="expertise."
          description="Grouped by how deeply I have used each skill, and where. Frontend is what I ship daily; backend is where I am growing."
        />
        <ExpertiseList />

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">Playground</p>
            <h3 className="mt-2 font-display text-3xl tracking-tight text-white sm:text-4xl">
              The toolbox <em className="text-zinc-400">— drag and flick.</em>
            </h3>
          </Reveal>
          <Reveal>
            <CategoryTabs active={active} onChange={selectCategory} />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-6">
          <GlowCard
            bare
            // Phones stack the bubbles higher, so the box is taller there to keep the inspector clear.
            className="h-[500px] overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/60 sm:h-[440px] lg:h-[460px]"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="bg-lines mask-radial absolute inset-0 opacity-60" />
              <div className="absolute bottom-[-35%] left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(29,78,216,0.16),transparent)]" />
              {/* Lit floor the bubbles land on */}
              <div className="absolute inset-x-[8%] bottom-0 h-px bg-linear-to-r from-transparent via-accent-soft/60 to-transparent" />
            </div>
            {/* Painted before the pit so flung bubbles pass over the read-out. */}
            <SkillInspector skill={inspected} total={visible.length} />
            {/* Keyed by category: each filter gets a fresh pit with no stale selection. */}
            <BubblePit key={active} skills={visible} onActiveChange={setInspected} />
          </GlowCard>
        </Reveal>
      </div>
    </section>
  )
}
