import { useId, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInViewport } from '../../../hooks/useInViewport'

// Cool shadow tone at the end so the shaded side reads as blue-lit, not grey.
const SUIT = ['#ffffff', '#e2e8f0', '#a5b4cf']
// Blue rim light from the planet and horizon below-right of the figure.
const RIM = { stroke: '#93c5fd', strokeLinecap: 'round', fill: 'none' }
// Where the safety tether clips onto the belt.
const TETHER_ANCHOR = [64, 176]

function SuitGradient({ id }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      {SUIT.map((color, i) => (
        <stop key={color} offset={i / (SUIT.length - 1)} stopColor={color} />
      ))}
    </linearGradient>
  )
}

/** Gradient along the tether, fading out where it trails away. */
function TetherGradient({ id, color }) {
  const [x1, y1] = TETHER_ANCHOR
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2="18" y2="262">
      <stop offset="0" stopColor={color} />
      <stop offset="0.65" stopColor={color} stopOpacity="0.8" />
      <stop offset="1" stopColor={color} stopOpacity="0" />
    </linearGradient>
  )
}

/**
 * A rounded limb hanging from a joint; the wrapper animates it around that joint.
 * `rim` adds the blue rim light along its right edge.
 */
function Limb({ className, x, y, width, length, angle, suit, end, rim = false }) {
  const edge = x + width / 2 - 1.5
  return (
    <g className={className}>
      <g transform={`rotate(${angle} ${x} ${y})`}>
        <rect x={x - width / 2} y={y - 4} width={width} height={length} rx={width / 2} fill={suit} />
        {rim && <path d={`M${edge} ${y + 8} V${y + length - 14}`} {...RIM} strokeWidth="2.2" strokeOpacity="0.8" />}
        {end(x, y + length - 4)}
      </g>
    </g>
  )
}

function Tether({ ids }) {
  const d = `M${TETHER_ANCHOR.join(' ')} C40 180 20 202 30 224 S54 250 18 262`
  return (
    <g className="astro-tether">
      <path d={d} fill="none" stroke={`url(#${ids.tetherShade})`} strokeWidth="6.5" strokeLinecap="round" />
      <path d={d} fill="none" stroke={`url(#${ids.tether})`} strokeWidth="4" strokeLinecap="round" />
      {/* Braided texture */}
      <path d={d} fill="none" stroke="#64748b" strokeOpacity="0.45" strokeWidth="4" strokeDasharray="1.5 4" />
    </g>
  )
}

function Helmet({ ids }) {
  return (
    <g>
      <line x1="80" y1="30" x2="70" y2="10" stroke="#94a3b8" strokeWidth="2" />
      <circle className="astro-blink" cx="70" cy="9" r="3" fill="#93c5fd" />
      <ellipse cx="100" cy="106" rx="30" ry="8" fill="#94a3b8" />
      <circle cx="100" cy="66" r="44" fill={`url(#${ids.suit})`} stroke="#94a3b8" strokeWidth="1" />
      <path d="M142.8 73.6 A43.5 43.5 0 0 1 92.4 108.8" {...RIM} strokeWidth="2.5" strokeOpacity="0.85" />
      {/* Helmet lamp */}
      <rect x="140" y="56" width="9" height="14" rx="3" fill="#cbd5e1" />
      <circle className="astro-blink astro-blink--lamp" cx="146" cy="63" r="3" fill="#bfdbfe" />

      <ellipse cx="100" cy="69" rx="33" ry="29" fill={`url(#${ids.visor})`} stroke="#93c5fd" strokeOpacity="0.5" strokeWidth="1.5" />
      <g clipPath={`url(#${ids.visorClip})`}>
        {/* The ringed planet from the scene, reflected in the visor. */}
        <circle cx="116" cy="82" r="6" fill="#6366f1" opacity="0.85" />
        <ellipse cx="116" cy="82" rx="11" ry="2.6" fill="none" stroke="#c7d2fe" strokeOpacity="0.7" strokeWidth="1" transform="rotate(-20 116 82)" />
        {[[82, 60], [92, 84], [124, 58], [108, 50]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#ffffff" opacity="0.8" />
        ))}
        <path d="M74 60 Q82 44 102 42" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
        {/* Animated wrapper: a CSS transform would replace the rect's own skew. */}
        <g className="astro-visor-glint">
          <rect x="40" y="30" width="14" height="80" fill="#ffffff" opacity="0.22" transform="skewX(-20)" />
        </g>
      </g>
    </g>
  )
}

function Body({ ids }) {
  const suit = `url(#${ids.suit})`
  const glove = (x, y) => <circle cx={x} cy={y} r="11" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" />
  const boot = (x, y) => (
    <g>
      <rect x={x - 15} y={y - 6} width="30" height="18" rx="8" fill="#475569" />
      <path d={`M${x - 9} ${y + 11.5} H${x + 9}`} {...RIM} strokeWidth="2" strokeOpacity="0.7" />
    </g>
  )

  return (
    <g>
      {/* Jetpack with thruster puffs */}
      <rect x="52" y="92" width="96" height="96" rx="16" fill={`url(#${ids.pack})`} />
      <path d="M147 108 V174" {...RIM} strokeWidth="2" strokeOpacity="0.55" />
      {/* Nozzles sit at the pack's outer edges so the legs don't hide them. */}
      {[60, 140].map((x, i) => (
        <g key={x}>
          <rect x={x - 7} y="184" width="14" height="9" rx="2" fill="#475569" />
          <circle className="astro-puff" style={i ? { animationDelay: '-1.1s' } : undefined} cx={x} cy="199" r="6" fill="#bfdbfe" />
        </g>
      ))}

      <Limb className="astro-leg astro-leg--left" x={84} y={178} width={26} length={52} angle={14} suit={suit} end={boot} rim />
      <Limb className="astro-leg astro-leg--right" x={116} y={178} width={26} length={52} angle={-10} suit={suit} end={boot} rim />

      <rect x="64" y="102" width="72" height="88" rx="26" fill={suit} />
      <path d="M135 132 V164 A25 25 0 0 1 110 189 H96" {...RIM} strokeWidth="2.5" strokeOpacity="0.8" />
      <rect x="66" y="170" width="68" height="8" rx="3" fill="#cbd5e1" />
      {/* Tether clip on the belt, so it is clear where the line attaches. */}
      <circle cx={TETHER_ANCHOR[0]} cy={TETHER_ANCHOR[1]} r="5.5" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      <circle cx={TETHER_ANCHOR[0]} cy={TETHER_ANCHOR[1]} r="1.8" fill="#475569" />
      {/* Chest control panel */}
      <rect x="82" y="128" width="36" height="24" rx="4" fill="#1e293b" stroke="#64748b" />
      <circle cx="90" cy="140" r="3" fill="#3b82f6" />
      <circle className="astro-blink" cx="100" cy="140" r="3" fill="#34d399" />
      <circle cx="110" cy="140" r="3" fill="#f87171" />
      {/* Shoulder mission patch */}
      <circle cx="73" cy="118" r="7.5" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1.2" />
      <ellipse cx="73" cy="118" rx="10" ry="3" fill="none" stroke="#93c5fd" strokeWidth="0.9" transform="rotate(-20 73 118)" />

      <Limb className="astro-arm astro-arm--left" x={66} y={116} width={22} length={56} angle={28} suit={suit} end={glove} />
      <Limb className="astro-arm astro-arm--wave" x={134} y={116} width={22} length={56} angle={-150} suit={suit} end={glove} />
    </g>
  )
}

/**
 * Floating astronaut drawn in SVG to match the scene's planet, satellite and rocket.
 * It can be grabbed and flung; on release it springs back to where it was floating.
 * Idle motion is CSS (transform/opacity only) and pauses while off screen.
 */
export default function Astronaut({ className = '' }) {
  const rootRef = useRef(null)
  const inView = useInViewport(rootRef, '0px')
  const uid = useId()
  const ids = {
    suit: `${uid}-suit`,
    pack: `${uid}-pack`,
    visor: `${uid}-visor`,
    visorClip: `${uid}-visor-clip`,
    tether: `${uid}-tether`,
    tetherShade: `${uid}-tether-shade`,
  }

  return (
    <motion.div
      ref={rootRef}
      aria-hidden="true"
      data-paused={inView ? undefined : ''}
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      dragTransition={{ bounceStiffness: 140, bounceDamping: 11 }}
      whileDrag={{ scale: 1.06, rotate: -10 }}
      className={`astronaut pointer-events-auto cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
    >
      <div className="astro-float relative">
        {/* Soft glow that lifts the figure off the background. */}
        <div className="astro-glow absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,rgba(59,130,246,0.24),rgba(59,130,246,0.08)_55%,transparent)]" />
        <svg viewBox="0 0 200 260" className="relative h-auto w-full overflow-visible">
          <defs>
            <SuitGradient id={ids.suit} />
            <linearGradient id={ids.pack} x1="0" x2="1">
              <stop offset="0" stopColor="#94a3b8" />
              <stop offset="1" stopColor="#4b5d78" />
            </linearGradient>
            <linearGradient id={ids.visor} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1e3a8a" />
              <stop offset="0.55" stopColor="#0b1220" />
              <stop offset="1" stopColor="#020617" />
            </linearGradient>
            <TetherGradient id={ids.tether} color="#e2e8f0" />
            <TetherGradient id={ids.tetherShade} color="#334155" />
            <clipPath id={ids.visorClip}>
              <ellipse cx="100" cy="69" rx="33" ry="29" />
            </clipPath>
          </defs>
          <Tether ids={ids} />
          <Body ids={ids} />
          <Helmet ids={ids} />
        </svg>
      </div>
    </motion.div>
  )
}
