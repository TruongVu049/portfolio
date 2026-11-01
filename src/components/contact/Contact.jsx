import { lazy, Suspense } from 'react'
import { ArrowUpRight, Download, Mail, MapPin } from 'lucide-react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { PROFILE } from '../../data/profile'
import ContactForm from './ContactForm'

const LiquidBlob = lazy(() => import('./LiquidBlob'))

// Empty URLs are dropped, so each link appears once its value is filled in profile.js.
const QUICK_LINKS = [
  { label: 'Résumé (PDF)', href: PROFILE.resumeUrl, icon: Download, download: true },
  { label: 'LinkedIn', href: PROFILE.socials.linkedin, icon: FiLinkedin },
  { label: 'GitHub', href: PROFILE.socials.github, icon: FiGithub },
].filter((link) => link.href)

function QuickLinks() {
  return (
    <ul className="mb-8 flex flex-wrap gap-2.5">
      {QUICK_LINKS.map(({ label, href, icon: Icon, download }) => (
        <li key={label}>
          <a
            href={href}
            {...(download ? { download: true } : { target: '_blank', rel: 'noreferrer' })}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm text-zinc-200 hover:border-accent/60 hover:bg-accent/10 hover:text-white"
          >
            <Icon size={15} className="text-accent-soft" />
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Contact({ index = '06' }) {
  return (
    <section id="Contact" className="relative overflow-hidden bg-black px-5 py-28 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-dots mask-radial absolute inset-0 opacity-40" />
        <div className="absolute -left-[18%] -top-[10%] h-[800px] w-[800px] bg-[radial-gradient(closest-side,rgba(29,78,216,0.1),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-[80rem] items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            index={index}
            eyebrow="Contact"
            title="Let's work"
            accent="together."
            description="Hiring for a frontend or full-stack role, or want to talk through a product? Send me a message and I will get back to you."
            compact
          />
          <Reveal delay={0.1} className="mb-8 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm">
            <a href={`mailto:${PROFILE.email}`} className="group inline-flex items-center gap-2 text-zinc-300 hover:text-white">
              <Mail size={16} className="text-accent-soft" />
              {PROFILE.email}
              <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <span className="inline-flex items-center gap-2 text-zinc-300">
              <MapPin size={16} className="text-accent-soft" />
              {PROFILE.location}
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <QuickLinks />
          </Reveal>
          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>

        <Reveal delay={0.2} className="hidden flex-col items-center gap-8 lg:flex">
          <Suspense fallback={<div className="aspect-square w-full max-w-[340px]" />}>
            <LiquidBlob />
          </Suspense>
          <p aria-hidden="true" className="relative font-mono text-[11px] uppercase tracking-[0.25em] text-accent-soft/60">
            Move your cursor — it&apos;s alive
          </p>
        </Reveal>
      </div>
    </section>
  )
}
