import { useEffect, useRef } from 'react'
import { useInViewport } from '../../hooks/useInViewport'

const MAX_PUPIL_SHIFT = 7
const BLINK_EVERY_MS = 3800
const BLINK_MS = 140
const EYES = [
  { cx: 66, cy: 120 },
  { cx: 134, cy: 120 },
]

/**
 * Original mascot: tall ears, round eyes whose pupils follow the cursor, and a blink.
 * Pupils are moved by writing SVG attributes directly (throttled to one write per
 * frame) so pointer movement never re-renders React.
 */
export default function Critter() {
  const svgRef = useRef(null)
  const pupilsRef = useRef([])
  const eyesRef = useRef([])
  const inView = useInViewport(svgRef, '100px')

  useEffect(() => {
    if (!inView) return undefined
    let frameId = 0
    let pointer = null

    const apply = () => {
      frameId = 0
      const rect = svgRef.current?.getBoundingClientRect()
      if (!rect || !pointer) return
      const dx = pointer.x - (rect.left + rect.width / 2)
      const dy = pointer.y - (rect.top + rect.height / 2)
      const distance = Math.hypot(dx, dy) || 1
      const strength = Math.min(1, distance / 300)
      const shiftX = (dx / distance) * MAX_PUPIL_SHIFT * strength
      const shiftY = (dy / distance) * MAX_PUPIL_SHIFT * strength
      pupilsRef.current.forEach((pupil) => {
        pupil?.setAttribute('transform', `translate(${shiftX.toFixed(2)} ${shiftY.toFixed(2)})`)
      })
    }

    const onMove = (e) => {
      pointer = { x: e.clientX, y: e.clientY }
      if (!frameId) frameId = requestAnimationFrame(apply)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frameId)
    }
  }, [inView])

  useEffect(() => {
    if (!inView) return undefined
    let reopenId
    const setLid = (scale) => {
      eyesRef.current.forEach((eye) => eye && (eye.style.transform = `scaleY(${scale})`))
    }
    const id = setInterval(() => {
      setLid(0.08)
      reopenId = setTimeout(() => setLid(1), BLINK_MS)
    }, BLINK_EVERY_MS)
    return () => {
      clearInterval(id)
      clearTimeout(reopenId)
    }
  }, [inView])

  return (
    // Colours come from theme tokens (white on dark; navy ears + outlined eyes on light).
    <svg ref={svgRef} viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {/* ears */}
      <path d="M58 92 C34 70 30 30 44 12 C60 8 74 50 80 80 Z" fill="var(--critter-ear)" />
      <path d="M142 92 C166 70 170 30 156 12 C140 8 126 50 120 80 Z" fill="var(--critter-ear)" />
      {/* eyes */}
      {EYES.map(({ cx, cy }, i) => (
        <g
          key={cx}
          ref={(el) => (eyesRef.current[i] = el)}
          style={{ transformOrigin: `${cx}px ${cy}px`, transition: 'transform 0.08s' }}
        >
          <ellipse cx={cx} cy={cy} rx={24} ry={21} fill="var(--critter-eye)" stroke="var(--critter-outline)" strokeWidth={3} />
          <ellipse
            ref={(el) => (pupilsRef.current[i] = el)}
            cx={cx - 4}
            cy={cy - 4}
            rx={6}
            ry={10}
            fill="var(--critter-pupil)"
            style={{ transition: 'transform 0.15s ease-out' }}
          />
        </g>
      ))}
      {/* nose */}
      <ellipse cx={100} cy={152} rx={8} ry={5} fill="#f9a8d4" />
    </svg>
  )
}
