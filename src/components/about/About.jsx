import { ArrowUpRight, Container, Database, Network, Server } from 'lucide-react'
import Reveal from '../ui/Reveal'
import GlowCard from '../ui/GlowCard'
import SectionHeading from '../ui/SectionHeading'
import PillButton from '../ui/PillButton'
import ScrollRevealText from '../ui/ScrollRevealText'
import { ABOUT, PROFILE } from '../../data/profile'
import { findProject } from '../../data/projects'
import { caseStudyHref } from '../../hooks/useCaseStudyRoute'
import ProfileCard from './ProfileCard'
import Chapters from './Chapters'

const LEARNING_ICONS = { server: Server, database: Database, network: Network, container: Container }

function Learning() {
  return (
    <div className="mt-20">
      <Reveal>
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-zinc-400">Currently strengthening</p>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2">
        {ABOUT.learning.map(({ icon, label, text, project: slug }, i) => {
          const Icon = LEARNING_ICONS[icon]
          const project = slug && findProject(slug)
          return (
            <Reveal key={label} delay={i * 0.08}>
              <GlowCard className="h-full p-5 transition-transform duration-500 hover:-translate-y-1">
                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent-soft">
                    <Icon size={16} />
                  </div>
                  <h4 className="text-base font-medium text-white">{label}</h4>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{text}</p>
                  {project && (
                    <a
                      href={caseStudyHref(project.slug)}
                      className="group mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-accent-soft hover:text-white"
                    >
                      Applied in {project.short}
                      <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </GlowCard>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

function ConnectBanner() {
  return (
    <Reveal className="mt-16 flex flex-col items-start gap-5 rounded-3xl border border-white/20 bg-white/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <h3 className="font-display text-3xl text-white">
          Let&apos;s build something <em className="text-zinc-500">reliable.</em>
        </h3>
        <p className="mt-1 text-sm text-zinc-500">Open to frontend and full-stack roles.</p>
      </div>
      <a href={`mailto:${PROFILE.email}`} className="shrink-0" tabIndex={-1}>
        <PillButton className="text-sm">CONNECT WITH ME</PillButton>
      </a>
    </Reveal>
  )
}

export default function About() {
  return (
    <section id="About" className="relative bg-black px-5 py-20 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-dots mask-radial absolute inset-0 opacity-40" />
        <div className="absolute left-[-18%] top-[22%] h-[660px] w-[660px] bg-[radial-gradient(closest-side,rgba(29,78,216,0.1),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-2">
            <Reveal>
              <ProfileCard />
            </Reveal>
          </div>
        </aside>

        <div className="lg:col-span-7">
          <SectionHeading index="04" eyebrow="About me" title="Beyond" accent="the interface." />
          <ScrollRevealText
            className="font-display text-3xl leading-none text-white sm:text-4xl lg:text-[2.6rem]"
            text={ABOUT.intro}
          />
          <div className="mt-8 space-y-5">
            {ABOUT.paragraphs.map((paragraph) => (
              <Reveal key={paragraph}>
                <p className="max-w-xl text-base leading-8 text-zinc-400">{paragraph}</p>
              </Reveal>
            ))}
          </div>
          <Chapters chapters={ABOUT.chapters} label="Strength" />
          <Learning />
          <ConnectBanner />
        </div>
      </div>
    </section>
  )
}
