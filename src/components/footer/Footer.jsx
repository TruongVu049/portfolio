import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { FOOTER, PROFILE } from '../../data/profile'
import { scrollToId } from '../../hooks/useLenis'
import Reveal from '../ui/Reveal'

const FOOTER_SOCIALS = [
  { key: 'github', label: 'GitHub', icon: FiGithub },
  { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin },
].filter(({ key }) => PROFILE.socials[key])

function FooterNav({ items }) {
  return (
    <nav aria-label="Footer navigation" className="text-right">
      <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">Navigation</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={item.target}>
            <button
              type="button"
              onClick={() => scrollToId(item.target)}
              className="group inline-flex cursor-pointer items-baseline gap-3 text-xl text-zinc-400 hover:text-white sm:text-[22px]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">{item.label}</span>
              <span className="w-4 font-mono text-[11px] text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Footer({ navItems }) {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-black px-5 pb-8 pt-16 sm:px-8 lg:px-12">
      <Reveal className="mx-auto max-w-[90rem]">
        <div className="relative flex min-h-[720px] flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-linear-to-b from-zinc-950 to-black p-7 sm:p-9">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="bg-dots mask-radial absolute inset-0 opacity-30" />
            <div className="absolute -bottom-[32%] -left-[18%] h-[800px] w-[800px] bg-[radial-gradient(closest-side,rgba(29,78,216,0.16),transparent)]" />
          </div>

          <div className="relative flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {PROFILE.role}
              </span>
              <h2 className="mt-6 font-display text-4xl leading-[1.1] tracking-tight text-white sm:text-[2.6rem]">
                {FOOTER.headline} <em className="text-zinc-500">{FOOTER.accent}</em>
              </h2>
              <p className="mt-5 hidden max-w-md text-sm leading-7 text-zinc-500 sm:block">{FOOTER.blurb}</p>
              <a href={`mailto:${PROFILE.email}`} className="group mt-6 inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white">
                {PROFILE.email}
                <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
            <FooterNav items={navItems} />
          </div>

          <div className="relative mt-auto flex items-end justify-between gap-6 pt-16">
            <p className="font-didone text-[clamp(5rem,17vw,15rem)] leading-[0.8] tracking-tight text-white">{PROFILE.firstName}</p>
            <button
              type="button"
              onClick={() => scrollToId('Home')}
              aria-label="Back to top"
              className="mb-2 flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white hover:-translate-y-1 hover:border-white/40"
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 px-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
            © {year} {PROFILE.firstName} {PROFILE.lastName}
          </p>
          <ul className="flex items-center gap-5">
            {FOOTER_SOCIALS.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <a href={PROFILE.socials[key]} target="_blank" rel="noreferrer" aria-label={label} className="text-zinc-300 hover:text-white">
                  <Icon size={26} strokeWidth={1.6} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </footer>
  )
}
