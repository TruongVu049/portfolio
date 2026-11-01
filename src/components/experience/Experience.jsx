import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { Code2, MapPin, Server } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import GlowCard from '../ui/GlowCard'
import { EXPERIENCE } from '../../data/profile'
import { findProject } from '../../data/projects'
import { caseStudyHref } from '../../hooks/useCaseStudyRoute'

const EASE = [0.22, 1, 0.36, 1]
const ICONS = { code: Code2, server: Server }

function ProjectLinks({ slugs }) {
  const projects = slugs.map(findProject).filter(Boolean)
  if (projects.length === 0) return null
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {projects.map((project) => (
        <li key={project.slug}>
          <a
            href={caseStudyHref(project.slug)}
            className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300 hover:border-accent/60 hover:text-white"
          >
            {project.short}
          </a>
        </li>
      ))}
    </ul>
  )
}

function StageCard({ item }) {
  return (
    <GlowCard className="p-7 sm:p-9">
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">Stage {item.stage}</span>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-accent-soft">
          {item.badge}
        </span>
      </div>
      <h3 className="mt-8 font-display text-4xl tracking-tight text-white">{item.title}</h3>
      <p className="mt-3 text-base text-zinc-300">{item.company}</p>
      <p className="mt-3 flex items-center gap-1.5 text-[13px] text-zinc-500">
        <MapPin size={14} /> {item.place}
      </p>
      <div className="my-6 h-px bg-white/[0.08]" />
      <p className="text-sm leading-7 text-zinc-400">{item.body}</p>
      <ul className="mt-5 space-y-3">
        {item.highlights.map((highlight) => (
          <li key={highlight} className="flex gap-3 text-sm leading-6 text-zinc-500">
            <span className="mt-[11px] h-px w-3 shrink-0 bg-accent" />
            {highlight}
          </li>
        ))}
      </ul>
      <ProjectLinks slugs={item.projects} />
    </GlowCard>
  )
}

function YearLabel({ item, alignRight }) {
  return (
    <div className={alignRight ? 'text-right' : ''}>
      <p className="font-display text-7xl leading-none tracking-tight text-zinc-100 sm:text-8xl lg:text-[7.5rem]">{item.from}</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-zinc-500">→ {item.to}</p>
    </div>
  )
}

function Stage({ item, index }) {
  const cardOnLeft = index % 2 === 0
  const Icon = ICONS[item.icon] ?? Code2

  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] gap-x-6 md:grid-cols-[1fr_5rem_1fr] md:gap-x-6">
      <div className={`md:row-start-1 ${cardOnLeft ? 'md:col-start-1' : 'md:col-start-3'} col-start-2`}>
        <motion.div
          initial={{ opacity: 0, x: cardOnLeft ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <StageCard item={item} />
        </motion.div>
      </div>

      <div className="col-start-1 row-start-1 flex justify-center md:col-start-2">
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-accent/50 bg-black text-accent-soft shadow-[0_0_24px_4px_rgba(59,130,246,0.45)]"
        >
          <Icon size={16} />
        </motion.span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className={`col-start-2 mt-6 md:row-start-1 md:mt-24 md:self-start ${cardOnLeft ? 'md:col-start-3' : 'md:col-start-1'}`}
      >
        <YearLabel item={item} alignRight={!cardOnLeft} />
      </motion.div>
    </li>
  )
}

export default function Experience() {
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.7', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  return (
    <section id="Experience" className="relative bg-black px-5 py-20 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-dots mask-radial absolute inset-0 opacity-40" />
        <div className="absolute -right-[18%] top-[18%] h-[760px] w-[760px] bg-[radial-gradient(closest-side,rgba(29,78,216,0.1),transparent)]" />
      </div>

      <div className="relative mx-auto max-w-[80rem]">
        <SectionHeading
          index="03"
          eyebrow="Professional experience"
          title="Where I've"
          accent="been building."
          description="Real products for real businesses: e-commerce, point of sale and membership platforms."
        />

        <div ref={listRef} className="relative">
          <div className="absolute bottom-0 left-5 top-0 w-px bg-white/10 md:left-1/2" />
          <motion.div
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-5 top-0 w-px origin-top bg-linear-to-b from-accent-soft via-accent to-accent-deep md:left-1/2"
          />
          <ol className="space-y-24 md:space-y-28">
            {EXPERIENCE.map((item, i) => (
              <Stage key={item.stage} item={item} index={i} />
            ))}
          </ol>
        </div>

        <div className="mt-20 flex flex-wrap justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-600">
          <span>Frontend → Full-stack → Software architecture</span>
          <span>{EXPERIENCE.map((item) => item.badge).join(' → ')} → …</span>
        </div>
      </div>
    </section>
  )
}
