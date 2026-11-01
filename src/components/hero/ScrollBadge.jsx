import { ArrowDown } from 'lucide-react'
import { BADGE_TEXT } from '../../data/profile'
import { scrollToId } from '../../hooks/useLenis'

/** Rotating ring of text around a "scroll down" button. */
export default function ScrollBadge({ size = 136 }) {
  const letters = [...BADGE_TEXT]
  const step = 360 / letters.length
  const radius = size / 2 - size * 0.1
  const buttonSize = size * 0.52

  return (
    <button
      type="button"
      onClick={() => scrollToId('About')}
      aria-label="Scroll to About"
      className="group relative flex cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 backdrop-blur-sm"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 animate-spin-slow" aria-hidden="true">
        {letters.map((letter, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 font-mono uppercase text-white/80"
            style={{
              fontSize: Math.max(8, size * 0.075),
              transform: `translate(-50%, -50%) rotate(${i * step}deg) translateY(-${radius}px)`,
            }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span
        className="relative flex items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:scale-110"
        style={{ width: buttonSize, height: buttonSize }}
      >
        <ArrowDown size={size * 0.16} strokeWidth={1.8} className="transition-transform duration-500 group-hover:translate-y-0.5" />
      </span>
    </button>
  )
}
