import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PROFILE } from '../../data/profile'

const DRAW_SECONDS = 2.6
const FILL_SECONDS = 0.9
const SHINE_SECONDS = 1.3
// Dash length must exceed the longest glyph outline so the stroke starts fully hidden.
const DASH = 3000

// Shared by the visible name, its glow and the clip path the shine is masked to.
const TEXT_PROPS = {
  x: '50%',
  y: '40%',
  textAnchor: 'middle',
  dominantBaseline: 'middle',
  className: 'font-signature',
  style: { fontSize: 210 },
}

/**
 * Handwritten name: the outline is "drawn" with a dash-offset animation, then the
 * fill and a soft glow fade in and a single highlight sweeps across the letters.
 * Calls `onDone` once the signature is complete.
 */
export default function SignatureText({ onDone }) {
  const reduceMotion = useReducedMotion()
  const name = `${PROFILE.firstName} ${PROFILE.lastName}`

  useEffect(() => {
    if (!reduceMotion) return undefined
    const id = setTimeout(onDone, 0)
    return () => clearTimeout(id)
  }, [reduceMotion, onDone])

  return (
    // Taller viewBox so deep script descenders (e.g. "Y") stay inside the box
    // instead of running into the tagline below.
    <svg
      viewBox="0 0 1000 320"
      className="block w-full overflow-visible"
      role="img"
      aria-label={name}
    >
      <defs>
        <linearGradient id="signature-fill" x1="0" y1="0" x2="1" y2="1">
          {/* Theme tokens: white→pale blue on dark, navy→blue on light */}
          <stop offset="0%" style={{ stopColor: 'var(--signature-1)' }} />
          <stop offset="55%" style={{ stopColor: 'var(--signature-2)' }} />
          <stop offset="100%" style={{ stopColor: 'var(--signature-3)' }} />
        </linearGradient>
        {/* Diagonal band of light, slanted by the gradient vector. */}
        <linearGradient id="signature-shine" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id="signature-blur" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <clipPath id="signature-clip">
          <text {...TEXT_PROPS}>{name}</text>
        </clipPath>
      </defs>

      <motion.text
        {...TEXT_PROPS}
        aria-hidden="true"
        fill="var(--signature-glow)"
        filter="url(#signature-blur)"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: DRAW_SECONDS * 0.8, ease: 'easeOut' }}
      >
        {name}
      </motion.text>

      <motion.text
        {...TEXT_PROPS}
        fill="url(#signature-fill)"
        stroke="var(--color-white)"
        style={{ ...TEXT_PROPS.style, strokeWidth: 1.4, strokeDasharray: DASH }}
        initial={reduceMotion ? false : { strokeDashoffset: DASH, fillOpacity: 0 }}
        animate={{ strokeDashoffset: 0, fillOpacity: 1 }}
        transition={{
          strokeDashoffset: { duration: DRAW_SECONDS, ease: [0.45, 0, 0.25, 1] },
          fillOpacity: { duration: FILL_SECONDS, delay: DRAW_SECONDS * 0.7, ease: 'easeOut' },
        }}
        onAnimationComplete={reduceMotion ? undefined : onDone}
      >
        {name}
      </motion.text>

      {!reduceMotion && (
        <g clipPath="url(#signature-clip)" aria-hidden="true">
          <motion.rect
            y={-100}
            width={320}
            height={520}
            fill="url(#signature-shine)"
            initial={{ x: -400 }}
            animate={{ x: 1100 }}
            transition={{ duration: SHINE_SECONDS, delay: DRAW_SECONDS, ease: [0.4, 0, 0.2, 1] }}
          />
        </g>
      )}
    </svg>
  )
}
