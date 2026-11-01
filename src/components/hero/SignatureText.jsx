import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { PROFILE } from '../../data/profile'

const DRAW_SECONDS = 2.6
const FILL_SECONDS = 0.9
// Dash length must exceed the longest glyph outline so the stroke starts fully hidden.
const DASH = 3000

/**
 * Handwritten name: the outline is "drawn" with a dash-offset animation,
 * then the fill fades in. Calls `onDone` once the signature is complete.
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
      </defs>
      <motion.text
        x="50%"
        y="40%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="url(#signature-fill)"
        stroke="var(--color-white)"
        className="font-signature"
        style={{ fontSize: 210, strokeWidth: 1.4, strokeDasharray: DASH }}
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
    </svg>
  )
}
