import { useEffect } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Lock } from 'lucide-react'
import { FiGithub } from 'react-icons/fi'
import Reveal from '../ui/Reveal'
import GlowCard from '../ui/GlowCard'
import { PROJECTS } from '../../data/projects'
import { caseStudyHref, leaveCaseStudy } from '../../hooks/useCaseStudyRoute'
import { ProjectBadge } from './ProjectDetail'

const pad = (n) => String(n).padStart(2, '0')
const LABEL = 'font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500'

function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}

/** One numbered part of the case study: sticky label on the left, content on the right. */
function Chapter({ n, title, children }) {
  return (
    <section className="grid gap-6 border-t border-white/[0.08] py-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <Reveal className="lg:sticky lg:top-28 lg:self-start">
        <p className={LABEL}>
          <span className="text-accent-soft">{n}</span> · {title}
        </p>
      </Reveal>
      <Reveal delay={0.08}>{children}</Reveal>
    </section>
  )
}

function MetaItem({ label, children }) {
  return (
    <div>
      <dt className={LABEL}>{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-zinc-200">{children}</dd>
    </div>
  )
}

function Header({ project, index }) {
  const { role } = project.caseStudy
  return (
    <header className="pb-14">
      <div className="flex flex-wrap items-center gap-3">
        <p className={LABEL}>
          Case study {pad(index + 1)} / {pad(PROJECTS.length)}
        </p>
        <ProjectBadge project={project} />
      </div>
      <p className="mt-10 font-mono text-xs text-accent-soft">{project.category}</p>
      <h1 className="mt-3 font-display text-6xl leading-[0.92] tracking-tight text-white sm:text-7xl lg:text-8xl">
        {project.title}
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">{project.description}</p>

      <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <MetaItem label="Role">{role.title}</MetaItem>
        <MetaItem label="Timeline">{role.timeline}</MetaItem>
        <MetaItem label="Team">{role.team}</MetaItem>
        <MetaItem label="Stack">{project.tags.join(' · ')}</MetaItem>
      </dl>

      {project.kind === 'company' && (
        <p className="mt-10 flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-[13px] leading-6 text-zinc-500">
          <Lock size={15} className="mt-1 shrink-0 text-accent-soft" />
          Company project. Source code, customer data and internal documents stay private; this page covers my own
          contribution, and any diagrams are simplified.
        </p>
      )}
      <ProjectLinks links={project.links} />
    </header>
  )
}

function ProjectLinks({ links }) {
  if (!links.repo && !links.live) return null
  return (
    <div className="mt-10 flex flex-wrap gap-3">
      {links.repo && (
        <a
          href={links.repo}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white hover:border-accent/60 hover:bg-accent/10"
        >
          <FiGithub size={16} /> Repository
        </a>
      )}
      {links.live && (
        <a
          href={links.live}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Live site <ArrowUpRight size={15} />
        </a>
      )}
    </div>
  )
}

function BulletList({ items }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-4 text-base leading-7 text-zinc-300">
          <span className="mt-3 h-px w-4 shrink-0 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}

function ChallengeList({ challenges }) {
  return (
    <ol className="space-y-5">
      {challenges.map(({ problem, solution }, i) => (
        <li key={problem}>
          <GlowCard className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 md:gap-10">
            <div>
              <p className={LABEL}>Challenge {pad(i + 1)}</p>
              <p className="mt-3 font-display text-2xl leading-snug text-white">{problem}</p>
            </div>
            <div className="border-t border-white/[0.08] pt-6 md:border-l md:border-t-0 md:pl-10 md:pt-0">
              <p className={`${LABEL} text-accent-soft!`}>Approach</p>
              <p className="mt-3 text-[15px] leading-7 text-zinc-400">{solution}</p>
            </div>
          </GlowCard>
        </li>
      ))}
    </ol>
  )
}

/** Request path through the system, left to right on wide screens and top to bottom on phones. */
function FlowDiagram({ nodes }) {
  return (
    <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center" aria-label="Request flow">
      {nodes.map((node, i) => (
        <li key={node} className="flex flex-col items-center gap-2 md:flex-1 md:flex-row">
          <span className="w-full rounded-2xl border border-white/10 bg-zinc-900/90 px-4 py-5 text-center font-mono text-xs leading-5 text-zinc-200 shadow-[0_0_30px_-12px_rgba(59,130,246,0.45)]">
            {node}
          </span>
          {i < nodes.length - 1 && (
            <>
              <ArrowDown size={16} aria-hidden="true" className="shrink-0 text-accent-soft md:hidden" />
              <ArrowRight size={16} aria-hidden="true" className="hidden shrink-0 text-accent-soft md:block" />
            </>
          )}
        </li>
      ))}
    </ol>
  )
}

function NextProject({ project }) {
  return (
    <a
      href={caseStudyHref(project.slug)}
      className="group mt-6 flex items-end justify-between gap-6 border-t border-white/[0.08] pt-14"
    >
      <div>
        <p className={LABEL}>Next case study</p>
        <p className="mt-3 font-display text-5xl tracking-tight text-zinc-500 transition-colors group-hover:text-white sm:text-6xl">
          {project.title}
        </p>
      </div>
      <span className="mb-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-transform group-hover:translate-x-1 group-hover:border-accent/60">
        <ArrowRight size={20} />
      </span>
    </a>
  )
}

export default function CaseStudy({ project }) {
  const index = PROJECTS.indexOf(project)
  const next = PROJECTS[(index + 1) % PROJECTS.length]
  const { caseStudy } = project
  useDocumentTitle(`${project.title} · Case study`)

  return (
    <main key={project.slug} className="relative bg-black px-5 pb-24 pt-28 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-lines mask-radial absolute inset-x-0 top-0 h-[900px] opacity-60" />
        <div className="absolute -right-[20%] -top-[10%] h-[820px] w-[820px] bg-[radial-gradient(closest-side,rgba(29,78,216,0.16),transparent)]" />
      </div>

      <article className="relative mx-auto max-w-[72rem]">
        <button
          type="button"
          onClick={() => leaveCaseStudy('Projects')}
          className="group mb-12 inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          All projects
        </button>

        <Header project={project} index={index} />

        <Chapter n="01" title="Overview">
          <p className="font-display text-3xl leading-tight text-white sm:text-4xl">{caseStudy.overview}</p>
        </Chapter>
        <Chapter n="02" title="My role">
          <BulletList items={caseStudy.role.responsibilities} />
        </Chapter>
        <Chapter n="03" title="Challenges & solutions">
          <ChallengeList challenges={caseStudy.challenges} />
        </Chapter>
        <Chapter n="04" title="Architecture">
          <FlowDiagram nodes={caseStudy.architecture} />
        </Chapter>
        <Chapter n="05" title="Results & learnings">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mb-5 font-display text-3xl text-white">Results</h2>
              <BulletList items={caseStudy.results} />
            </div>
            <div>
              <h2 className="mb-5 font-display text-3xl text-white">Learnings</h2>
              <BulletList items={caseStudy.learnings} />
            </div>
          </div>
        </Chapter>

        {next !== project && <NextProject project={next} />}
      </article>
    </main>
  )
}
