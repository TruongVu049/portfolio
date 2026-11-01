import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import BubblePit from './BubblePit'
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
              {category} <sup className="ml-0.5 text-[9px] opacity-60">{countFor(category)}</sup>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function Skills() {
  const [active, setActive] = useState('All')
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
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">The toolbox · play with it</p>
          </Reveal>
          <Reveal>
            <CategoryTabs active={active} onChange={setActive} />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-4">
          <div className="relative h-[460px] overflow-hidden rounded-3xl border border-white/[0.08] bg-zinc-950/60 sm:h-[520px] lg:h-[560px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="bg-lines mask-radial absolute inset-0 opacity-60" />
              <div className="absolute bottom-[-35%] left-1/2 h-full w-full -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(29,78,216,0.16),transparent)]" />
            </div>
            <BubblePit skills={visible} />
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-600">
              Poke · drag · flick
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
