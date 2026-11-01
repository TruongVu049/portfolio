import { useId } from 'react'

// The moon orbit is squashed to the ring's perspective; the moon itself is un-squashed.
const ORBIT_SQUASH = 0.24
const ORBIT_RADIUS = 72

/**
 * A moon on a tilted orbit. The orbit wrapper rotates and the moon counter-rotates,
 * so it travels an ellipse while staying round and lit from the same side.
 */
function Moon({ fill }) {
  return (
    <g transform={`translate(100 100) scale(1 ${ORBIT_SQUASH})`}>
      <g className="space-moon-orbit">
        <g transform={`translate(${ORBIT_RADIUS} 0)`}>
          <g className="space-moon-orbit space-moon-orbit--counter">
            <circle r="6.5" fill={fill} transform={`scale(1 ${1 / ORBIT_SQUASH})`} />
          </g>
        </g>
      </g>
    </g>
  )
}

/**
 * Ringed gas giant with an orbiting moon. Ring and moon are drawn twice: the back
 * copies sit under the planet, the front copies are clipped to the near half.
 */
export function RingedPlanet({ className = '' }) {
  const id = useId()
  const body = `${id}-body`
  const ring = `${id}-ring`
  const front = `${id}-front`
  const disc = `${id}-disc`
  const moon = `${id}-moon`
  const ringPath = (props) => <ellipse cx="100" cy="100" rx="94" ry="20" fill="none" {...props} />
  const ringBand = (props) => ringPath({ stroke: `url(#${ring})`, strokeWidth: 5, ...props })
  const ringDust = (props) =>
    ringPath({ className: 'space-ring-dust', stroke: '#e0e7ff', strokeWidth: 1.6, strokeLinecap: 'round', strokeDasharray: '0.5 9.5', ...props })

  return (
    <div className={`space-planet ${className}`}>
      <div className="space-planet-glow absolute inset-[16%] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.4),transparent)]" />
      <svg viewBox="0 0 200 200" className="relative h-full w-full overflow-visible">
        <defs>
          <radialGradient id={body} cx="34%" cy="28%" r="78%">
            <stop offset="0" stopColor="#c7d2fe" />
            <stop offset="0.3" stopColor="#6366f1" />
            <stop offset="0.7" stopColor="#1e1b4b" />
            <stop offset="1" stopColor="#030312" />
          </radialGradient>
          <linearGradient id={ring} x1="0" x2="1">
            <stop offset="0" stopColor="#93c5fd" stopOpacity="0.1" />
            <stop offset="0.5" stopColor="#e0e7ff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#93c5fd" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id={moon} cx="35%" cy="35%" r="70%">
            <stop offset="0" stopColor="#f1f5f9" />
            <stop offset="0.55" stopColor="#94a3b8" />
            <stop offset="1" stopColor="#1e293b" />
          </radialGradient>
          <clipPath id={front}>
            <rect x="0" y="100" width="200" height="100" />
          </clipPath>
          <clipPath id={disc}>
            <circle cx="100" cy="100" r="50" />
          </clipPath>
        </defs>
        <g transform="rotate(-20 100 100)">
          {ringBand({ opacity: 0.45 })}
          {ringDust({ opacity: 0.35 })}
          <Moon fill={`url(#${moon})`} />

          <circle cx="100" cy="100" r="50" fill={`url(#${body})`} />
          <g clipPath={`url(#${disc})`}>
            <g fill="none" stroke="#c7d2fe" strokeOpacity="0.14">
              <path d="M40 84 Q100 74 160 84" strokeWidth="6" />
              <path d="M40 112 Q100 102 160 112" strokeWidth="4" />
            </g>
            {/* Storms drifting across the disc read as the planet turning. */}
            <ellipse className="space-planet-storm" cx="100" cy="92" rx="9" ry="3.5" fill="#e0e7ff" opacity="0.25" />
            <ellipse className="space-planet-storm space-planet-storm--slow" cx="100" cy="114" rx="6" ry="2.5" fill="#1e1b4b" opacity="0.5" />
          </g>
          <circle cx="100" cy="100" r="50.5" fill="none" stroke="#a5b4fc" strokeOpacity="0.35" strokeWidth="1.2" />

          <g clipPath={`url(#${front})`}>
            <Moon fill={`url(#${moon})`} />
            {ringBand()}
            {ringDust({ opacity: 0.8 })}
          </g>
        </g>
      </svg>
    </div>
  )
}

export function Satellite({ className = '' }) {
  const id = useId()
  const hull = `${id}-hull`
  const glint = `${id}-glint`
  const panels = `${id}-panels`
  const panel = (x) => (
    <g>
      <rect x={x} y="22" width="38" height="18" rx="1.5" fill="#1e3a8a" stroke="#93c5fd" strokeOpacity="0.7" strokeWidth="0.8" />
      {[1, 2, 3].map((i) => (
        <line key={i} x1={x + i * 9.5} y1="22" x2={x + i * 9.5} y2="40" stroke="#93c5fd" strokeOpacity="0.35" strokeWidth="0.6" />
      ))}
      <line x1={x} y1="31" x2={x + 38} y2="31" stroke="#93c5fd" strokeOpacity="0.35" strokeWidth="0.6" />
    </g>
  )

  // Drift on X and Y runs on different periods, so the path never visibly repeats.
  return (
    <div className={className}>
      <div className="space-satellite-x h-full w-full">
        <div className="space-satellite-y h-full w-full">
          <svg viewBox="0 0 120 60" className="space-satellite-tilt h-full w-full overflow-visible">
            <defs>
              <linearGradient id={hull} x1="0" x2="1">
                <stop offset="0" stopColor="#64748b" />
                <stop offset="0.45" stopColor="#e2e8f0" />
                <stop offset="1" stopColor="#475569" />
              </linearGradient>
              <linearGradient id={glint} x1="0" x2="1">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <clipPath id={panels}>
                <rect x="4" y="22" width="38" height="18" rx="1.5" />
                <rect x="78" y="22" width="38" height="18" rx="1.5" />
              </clipPath>
            </defs>
            {panel(4)}
            {panel(78)}
            {/* Sunlight sweeping across the solar panels. */}
            <g clipPath={`url(#${panels})`}>
              <rect className="space-satellite-glint" x="-26" y="18" width="22" height="26" fill={`url(#${glint})`} />
            </g>
            <line x1="42" y1="31" x2="50" y2="31" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="70" y1="31" x2="78" y2="31" stroke="#94a3b8" strokeWidth="1.2" />
            <rect x="50" y="20" width="20" height="22" rx="3" fill={`url(#${hull})`} />
            <path d="M53 20 Q60 9 67 20" fill="#cbd5e1" />
            <line x1="60" y1="15" x2="60" y2="5" stroke="#94a3b8" strokeWidth="0.8" />
            {/* Signal pulses leaving the antenna. */}
            {[0, 1].map((i) => (
              <circle
                key={i}
                className="space-signal"
                style={i ? { animationDelay: '-1.2s' } : undefined}
                cx="60"
                cy="4"
                r="5"
                fill="none"
                stroke="#34d399"
                strokeWidth="0.8"
              />
            ))}
            <circle className="space-beacon" cx="60" cy="4" r="1.8" fill="#34d399" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/** Upright rocket; the flight path and tilt are applied by the wrappers in SpaceScene. */
export function Rocket({ className = '' }) {
  const id = useId()
  const hull = `${id}-hull`
  const flame = `${id}-flame`

  return (
    <div className={`relative ${className}`}>
      {/* Exhaust trail: a soft glow plus a hot core, both fading out behind the rocket. */}
      <div className="absolute left-1/2 top-[88%] h-48 w-4 -translate-x-1/2 rounded-full bg-linear-to-b from-sky-300/30 via-sky-400/10 to-transparent" />
      <div className="absolute left-1/2 top-[88%] h-36 w-[3px] -translate-x-1/2 rounded-full bg-linear-to-b from-amber-200/90 via-sky-300/40 to-transparent" />
      <svg viewBox="0 0 40 100" className="relative h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={hull} x1="0" x2="1">
            <stop offset="0" stopColor="#64748b" />
            <stop offset="0.4" stopColor="#f8fafc" />
            <stop offset="0.7" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
          <linearGradient id={flame} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fef3c7" />
            <stop offset="0.4" stopColor="#fb923c" />
            <stop offset="1" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="space-flame" d="M13 76 L27 76 L20 100 Z" fill={`url(#${flame})`} />
        <path d="M12 56 L2 76 L12 72 Z" fill="#2563eb" />
        <path d="M28 56 L38 76 L28 72 Z" fill="#2563eb" />
        <path d="M20 2 C30 14 30 40 28 74 L12 74 C10 40 10 14 20 2 Z" fill={`url(#${hull})`} />
        <path d="M20 2 C24.5 7.5 26.6 13 27.4 20 L12.6 20 C13.4 13 15.5 7.5 20 2 Z" fill="#3b82f6" />
        <circle cx="20" cy="34" r="5" fill="#0b1220" stroke="#93c5fd" strokeWidth="2" />
        <circle cx="18.4" cy="32.4" r="1.4" fill="#e0f2fe" opacity="0.8" />
        <rect x="19" y="58" width="2" height="16" fill="#1d4ed8" />
        <rect x="14" y="73" width="12" height="4" rx="1" fill="#475569" />
      </svg>
    </div>
  )
}
