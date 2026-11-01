import { useRef } from 'react'
import { motion, useReducedMotion, useTransform } from 'framer-motion'
import { useInViewport } from '../../../hooks/useInViewport'
import { SCENE_DELAY, SCENE_EASE, SHOOTING_STAR_DELAY } from '../introTimeline'
import { createStars } from './starfield'
import { RingedPlanet, Rocket, Satellite } from './SpaceObjects'

const STARS = createStars(110)
// Start points keep each streak clear of the name: top-right corner, top-left
// above the astronaut, and lower right beside the planet.
const SHOOTING_STARS = [
  { top: '3%', left: '100%', duration: '11s' },
  { top: '6%', left: '30%', duration: '15s' },
  { top: '58%', left: '100%', duration: '19s' },
].map((star, i) => ({ ...star, delay: `${SHOOTING_STAR_DELAY[i]}s` }))

/** Act 2 entrance: hidden until the scene is revealed, then drifts in from `x`. */
const arrive = (shown, delay, x) => ({
  initial: { opacity: 0, x, scale: 0.85 },
  animate: shown ? { opacity: 1, x: 0, scale: 1 } : undefined,
  transition: { duration: 1.4, delay, ease: SCENE_EASE },
})

function Starfield() {
  return STARS.map((star) => (
    <span
      key={star.id}
      className={`space-star ${star.bright ? 'space-star--bright' : ''}`}
      style={{
        left: `${star.x}%`,
        top: `${star.y}%`,
        width: star.size,
        height: star.size,
        '--star-o': star.opacity,
        animationDuration: `${star.duration}s`,
        animationDelay: `${star.delay}s`,
      }}
    />
  ))
}

function ShootingStars() {
  return SHOOTING_STARS.map(({ top, left, duration, delay }) => (
    <span key={top} className="absolute -rotate-[24deg]" style={{ top, left }}>
      <span className="space-shooting-star" style={{ animationDuration: duration, animationDelay: delay }} />
    </span>
  ))
}

/**
 * The rocket's arc comes from three nested wrappers sharing one timeline: vertical
 * climb, a sideways drift that eases in harder (bending the path), and the tilt.
 */
function RocketLaunch() {
  return (
    // Launch pad sits right of the text column, so the climb never crosses the copy.
    // The delay is inherited by the drift and tilt wrappers through the custom property.
    <div
      className="space-rocket-climb absolute bottom-4 right-[10%] w-6 sm:w-8 lg:right-[20%]"
      style={{ '--rocket-delay': `${SCENE_DELAY.rocket}s` }}
    >
      <div className="space-rocket-drift">
        <div className="space-rocket-tilt">
          <Rocket />
        </div>
      </div>
    </div>
  )
}

/**
 * Decorative outer-space layer behind the hero content. The sky is there from the
 * start; the planet, satellite and rocket wait for `revealed` (the signature is
 * done) and arrive on the intro timeline. Every CSS animation is paused while the
 * hero is off screen.
 */
export default function SpaceScene({ scrollYProgress, revealed }) {
  const sceneRef = useRef(null)
  const inView = useInViewport(sceneRef, '0px')
  const reduceMotion = useReducedMotion()
  // Depth: distant stars barely move on scroll, the near planet moves the most.
  const starsY = useTransform(scrollYProgress, [0, 1], [0, 50])
  const planetY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const satelliteY = useTransform(scrollYProgress, [0, 1], [0, -70])
  const parallax = (y) => (reduceMotion ? undefined : { y })

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      data-paused={inView ? undefined : ''}
      className="space-scene pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div style={parallax(starsY)} className="absolute inset-0">
        <Starfield />
      </motion.div>
      {!reduceMotion && <ShootingStars />}

      <motion.div
        style={parallax(planetY)}
        // Right-hand side: on desktop the astronaut floats on the left.
        className="absolute -right-10 top-[13%] w-28 sm:right-[3%] sm:top-[62%] sm:w-40 lg:right-[5%] lg:top-[54%] lg:w-48"
      >
        <motion.div {...arrive(revealed, SCENE_DELAY.planet, 60)}>
          <RingedPlanet className="aspect-square w-full" />
        </motion.div>
      </motion.div>

      <motion.div
        style={parallax(satelliteY)}
        className="absolute right-[12%] top-[17%] hidden w-20 sm:block lg:right-[15%] lg:top-[19%] lg:w-24"
      >
        <motion.div {...arrive(revealed, SCENE_DELAY.satellite, 40)}>
          <Satellite className="aspect-[2/1] w-full" />
        </motion.div>
      </motion.div>

      {revealed && !reduceMotion && <RocketLaunch />}
    </div>
  )
}
