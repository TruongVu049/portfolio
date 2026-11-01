import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, Download, MapPin } from 'lucide-react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import { PROFILE, TERMINAL_LINES } from '../../data/profile'
import { scrollToId } from '../../hooks/useLenis'
import LiveClock from '../about/LiveClock'
import SignatureText from './SignatureText'
import Terminal from './Terminal'
import ScrollBadge from './ScrollBadge'
import CursorSpotlight from './CursorSpotlight'

// three.js + rapier are heavy; load them only once the intro has finished.
const Lanyard = lazy(() => import('./lanyard/Lanyard'))

const EASE = [0.22, 1, 0.36, 1]
const fadeUp = (delay = 0, y = 16) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
})

function AuroraBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Gradients instead of blur() filters: the drift animation stays compositor-only. */}
      <div className="absolute -left-[22%] -top-[8%] h-[85vmax] max-h-[1100px] w-[85vmax] max-w-[1100px] animate-aurora bg-[radial-gradient(closest-side,rgba(29,78,216,0.32),rgba(29,78,216,0.08)_60%,transparent)] will-change-transform" />
      <div className="absolute -right-[22%] -bottom-[16%] h-[70vmax] max-h-[920px] w-[70vmax] max-w-[920px] animate-aurora bg-[radial-gradient(closest-side,rgba(147,197,253,0.14),transparent)] will-change-transform [animation-delay:-6s] [animation-direction:alternate-reverse]" />
      {/* Halo behind the name to lift it off the background */}
      <div className="absolute left-1/2 top-1/2 h-[46vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(59,130,246,0.12),transparent)]" />
      <div className="bg-lines mask-radial absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black to-transparent" />
    </div>
  )
}

function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-300 shadow-[0_0_30px_-8px_rgba(59,130,246,0.5)]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {/* The role is the positioning, so it stays visible on phones; availability does not. */}
      <span className="hidden sm:inline">{PROFILE.available ? 'Available for work' : 'Currently busy'}</span>
      <span className="hidden text-zinc-600 sm:inline">/</span>
      <span className="text-accent-soft">{PROFILE.role}</span>
      <span className="hidden text-zinc-500 lg:inline">· {PROFILE.focus}</span>
    </span>
  )
}

const ICON_LINKS = [
  { key: 'github', label: 'GitHub', icon: FiGithub },
  { key: 'linkedin', label: 'LinkedIn', icon: FiLinkedin },
].filter(({ key }) => PROFILE.socials[key])

function HeroActions() {
  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => scrollToId('Projects')}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_10px_40px_-10px_rgba(147,197,253,0.6)] hover:-translate-y-0.5 hover:bg-zinc-100"
      >
        View my projects
        <ArrowDownRight size={16} className="transition-transform duration-300 group-hover:rotate-[-45deg]" />
      </button>
      {PROFILE.resumeUrl && (
        <a
          href={PROFILE.resumeUrl}
          download
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10"
        >
          Download résumé
          <Download size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
        </a>
      )}
      {ICON_LINKS.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={PROFILE.socials[key]}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-zinc-300 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10 hover:text-white"
        >
          <Icon size={17} />
        </a>
      ))}
    </div>
  )
}

function CornerMeta() {
  return (
    <div className="absolute bottom-8 left-10 z-20 hidden flex-col gap-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500 lg:flex">
      <span className="flex items-center gap-2 text-zinc-400">
        <MapPin size={13} className="text-accent-soft" /> {PROFILE.location}
      </span>
      <span>
        Local time · <LiveClock timeZone={PROFILE.timeZone} className="tabular-nums text-zinc-300" />
      </span>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const [introDone, setIntroDone] = useState(false)
  const handleSignatureDone = useCallback(() => setIntroDone(true), [])

  return (
    <section id="Home" ref={sectionRef} className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black">
      <AuroraBackdrop />
      <CursorSpotlight containerRef={sectionRef} />

      <AnimatePresence>
        {introDone && (
          <motion.div
            key="lanyard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="lanyard-layer pointer-events-none absolute inset-0 z-40 hidden lg:block [&_canvas]:pointer-events-auto"
          >
            <Suspense fallback={null}>
              <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-28 sm:pb-36">
        <motion.div {...fadeUp(0.2, 10)}>
          <StatusPill />
        </motion.div>

        <h1 className="mt-2 w-full max-w-[20rem] sm:mt-4 sm:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[48rem]">
          <SignatureText onDone={handleSignatureDone} />
        </h1>

        {/* Reserve the space up front so nothing jumps when these fade in. */}
        <div className="flex min-h-[8.5rem] flex-col items-center gap-7 sm:min-h-[9rem]">
          <AnimatePresence>
            {introDone && (
              <motion.p
                key="tagline"
                {...fadeUp(0)}
                className="-mt-2 text-center text-lg text-zinc-400 sm:-mt-6 sm:text-2xl lg:text-3xl"
              >
                {PROFILE.tagline.plain}{' '}
                <span className="font-display italic tracking-tight text-zinc-100">{PROFILE.tagline.script}</span>
              </motion.p>
            )}
            {introDone && (
              <motion.div key="actions" {...fadeUp(0.25)}>
                <HeroActions />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {introDone && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="absolute bottom-0 left-1/2 z-30 w-[min(92vw,22rem)] -translate-x-1/2 sm:w-[min(58vw,36rem)] lg:w-[34rem]"
          >
            <Terminal lines={TERMINAL_LINES} className="h-32 sm:h-36" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{introDone && <CornerMeta key="meta" />}</AnimatePresence>

      <AnimatePresence>
        {introDone && (
          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="absolute bottom-[8.5rem] right-3 z-40 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-10"
          >
            <div className="sm:hidden"><ScrollBadge size={76} /></div>
            <div className="hidden sm:block lg:hidden"><ScrollBadge size={108} /></div>
            <div className="hidden lg:block"><ScrollBadge size={136} /></div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
