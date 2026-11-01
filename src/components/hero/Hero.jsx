import { useCallback, useRef, useState } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion"
import { ArrowDownRight, Download, MapPin } from "lucide-react"
import { FiGithub, FiLinkedin } from "react-icons/fi"
import { PROFILE, TERMINAL_LINES } from "../../data/profile"
import { scrollToId } from "../../hooks/useLenis"
import LiveClock from "../about/LiveClock"
import SignatureText from "./SignatureText"
import Terminal from "./Terminal"
import ScrollBadge from "./ScrollBadge"
import CursorSpotlight from "./CursorSpotlight"
import SpaceScene from "./space/SpaceScene"
import Astronaut from "./space/Astronaut"
import { SCENE_DELAY, SCENE_EASE as EASE } from "./introTimeline"

// The pitch and the buttons must not wait for the signature animation to finish.
const PITCH_DELAY_S = 0.5
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
      <div className="bg-grain absolute inset-0" />
    </div>
  )
}

const HORIZON_DISC =
  "absolute left-1/2 top-[calc(100%-10rem)] aspect-square w-[150vw] -translate-x-1/2 rounded-full sm:top-[calc(100%-11.5rem)] lg:top-[calc(100%-12.5rem)]"

/**
 * Lit, curved horizon the terminal rises out of. The viewport-sized wrapper carries
 * the motion and clips the oversized circle, so no huge layer is ever animated.
 */
function Horizon() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 120 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6, ease: EASE }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[max(50vh,22rem)] overflow-hidden"
    >
      <div className={`hero-horizon ${HORIZON_DISC}`} />
      {/* The lit rim fades out toward the screen edges instead of running off them at full strength. */}
      <div className="absolute inset-0 mask-[linear-gradient(90deg,transparent,#000_24%,#000_76%,transparent)]">
        <div className={`hero-horizon-rim ${HORIZON_DISC}`} />
      </div>
      {/* Dissolve into the page colour so the next section continues without a seam. */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black via-black/70 to-transparent sm:h-32" />
    </motion.div>
  )
}

function StatusPill() {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2.5 pr-4 font-mono text-xs uppercase tracking-[0.2em] text-zinc-300 shadow-[0_0_30px_-8px_rgba(59,130,246,0.5)]">
      <span aria-hidden="true" className="relative flex h-2 w-2">
        {PROFILE.available && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${PROFILE.available ? "bg-emerald-400" : "bg-amber-400"}`}
        />
      </span>
      {/* Availability is spelled out on wide screens and always for screen readers. */}
      <span className="sr-only xl:not-sr-only">
        {PROFILE.available ? "Open to work" : "Currently busy"}
      </span>
      <span className="hidden text-zinc-500 xl:inline">/</span>
      {/* The signature is decorative script, so the name is also set in plain type here. */}
      <span className="hidden text-zinc-100 sm:inline">{`${PROFILE.firstName} ${PROFILE.lastName}`}</span>
      <span className="hidden text-zinc-500 sm:inline">/</span>
      <span className="text-accent-soft">{PROFILE.role}</span>
      <span className="hidden text-zinc-400 lg:inline">· {PROFILE.focus}</span>
    </span>
  )
}

const ICON_LINKS = [
  { key: "github", label: "GitHub", icon: FiGithub },
  { key: "linkedin", label: "LinkedIn", icon: FiLinkedin },
].filter(({ key }) => PROFILE.socials[key])

function HeroActions() {
  return (
    <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => scrollToId("Projects")}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_10px_40px_-10px_rgba(147,197,253,0.6)] hover:-translate-y-0.5 hover:bg-zinc-100"
      >
        View my projects
        <ArrowDownRight
          size={16}
          className="transition-transform duration-300 group-hover:rotate-[-45deg]"
        />
      </button>
      {PROFILE.resumeUrl && (
        <a
          href={PROFILE.resumeUrl}
          download
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-medium text-white hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10"
        >
          Download résumé
          <Download
            size={16}
            className="transition-transform duration-300 group-hover:translate-y-0.5"
          />
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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: SCENE_DELAY.cornerMeta, ease: EASE }}
      className="absolute bottom-8 left-10 z-20 hidden flex-col gap-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 lg:flex"
    >
      <span className="flex items-center gap-2 text-zinc-400">
        <MapPin size={13} className="text-accent-soft" /> {PROFILE.location}
      </span>
      <span>
        Local time ·{" "}
        <LiveClock
          timeZone={PROFILE.timeZone}
          className="tabular-nums text-zinc-300"
        />
      </span>
    </motion.div>
  )
}

export default function Hero() {
  const sectionRef = useRef(null)
  const [introDone, setIntroDone] = useState(false)
  const handleSignatureDone = useCallback(() => setIntroDone(true), [])
  // As the hero scrolls away its content sinks and fades, so the next section
  // slides over it instead of meeting it at a hard edge.
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 160])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      id="Home"
      ref={sectionRef}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black"
    >
      <AuroraBackdrop />
      <SpaceScene scrollYProgress={scrollYProgress} revealed={introDone} />
      <CursorSpotlight containerRef={sectionRef} />

      <AnimatePresence>
        {introDone && (
          // Drifts in from the left once the signature is written. On phones and
          // tablets it floats above the status pill, opposite the planet; on desktop
          // it moves into the gutter beside the name, as close to it as the width allows.
          <motion.div
            key="astronaut"
            initial={{ opacity: 0, x: -120, rotate: -25 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.8, delay: SCENE_DELAY.astronaut, ease: EASE }}
            // Short phones have no room above the pill, so it sits out there.
            className="pointer-events-none absolute left-[16%] top-[8%] z-20 w-20 max-sm:[@media(max-height:739px)]:hidden sm:left-[12%] sm:top-[9%] sm:w-28 lg:left-[2%] lg:top-[30%] lg:w-32 xl:left-[4%] xl:top-[25%] xl:w-48 2xl:left-[9%] 2xl:w-56"
          >
            <Astronaut />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={
          reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pb-28 sm:pb-36"
      >
        <motion.div {...fadeUp(0.2, 10)}>
          <StatusPill />
        </motion.div>

        <h1 className="mt-4 w-full max-w-[20rem] sm:mt-8 sm:max-w-[36rem] lg:max-w-[42rem] xl:max-w-[48rem]">
          <SignatureText onDone={handleSignatureDone} />
        </h1>

        <div className="flex flex-col items-center gap-7">
          <div className="-mt-2 flex flex-col items-center gap-3 sm:-mt-6">
            <motion.p
              {...fadeUp(PITCH_DELAY_S)}
              className="max-w-4xl text-center text-lg text-zinc-300 sm:text-2xl lg:text-3xl"
            >
              {PROFILE.tagline.plain}{" "}
              <span className="font-display italic tracking-tight text-zinc-100">
                {PROFILE.tagline.script}
              </span>
            </motion.p>
            <motion.p
              {...fadeUp(PITCH_DELAY_S + 0.1)}
              className="max-w-xl text-center text-sm leading-6 text-zinc-400 sm:text-base"
            >
              {PROFILE.positioning}
            </motion.p>
          </div>
          <motion.div {...fadeUp(PITCH_DELAY_S + 0.25)}>
            <HeroActions />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {introDone && <Horizon key="horizon" />}
      </AnimatePresence>

      <AnimatePresence>
        {introDone && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: SCENE_DELAY.terminal, ease: EASE }}
            className="absolute bottom-0 left-1/2 z-30 w-[min(92vw,22rem)] -translate-x-1/2 sm:w-[min(58vw,36rem)] lg:w-[34rem]"
          >
            <Terminal
              lines={TERMINAL_LINES}
              className="h-32 shadow-[0_-12px_50px_-16px_rgba(59,130,246,0.55)] sm:h-36"
            />
            {/* Fades the window's side borders out at the section edge. */}
            <div className="pointer-events-none absolute -inset-x-1 bottom-0 h-14 bg-linear-to-t from-black to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {introDone && <CornerMeta key="meta" />}
      </AnimatePresence>

      <AnimatePresence>
        {introDone && (
          <motion.div
            key="badge"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: SCENE_DELAY.scrollBadge, ease: EASE }}
            className="absolute bottom-[8.5rem] right-3 z-40 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-10"
          >
            <div className="sm:hidden">
              <ScrollBadge size={76} />
            </div>
            <div className="hidden sm:block lg:hidden">
              <ScrollBadge size={108} />
            </div>
            <div className="hidden lg:block">
              <ScrollBadge size={136} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
