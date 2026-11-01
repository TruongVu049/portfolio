import { useEffect, useId, useRef, useState } from 'react'
import { MARQUEE_WORDS } from '../../data/profile'
import { useInViewport } from '../../hooks/useInViewport'

const SPEED = 1.4 // px per frame
const CURVE_DEPTH = 220
const PATH_LENGTH = 1800 // approx. length of the curve in viewBox units
const SEPARATOR = ' ✦ '

/** Text that loops along a downward curve; drag horizontally to scrub it. */
export default function CurvedMarquee() {
  const pathId = useId()
  const containerRef = useRef(null)
  const measureRef = useRef(null)
  const textPathRef = useRef(null)
  const [spacing, setSpacing] = useState(0)
  const drag = useRef({ active: false, lastX: 0, velocity: 0, offset: null, applyDelta: null })
  const inView = useInViewport(containerRef, '100px')

  const phrase = MARQUEE_WORDS.join(SEPARATOR) + SEPARATOR
  // Only as many copies as the path needs: re-laying out text along a path is costly.
  const copies = spacing ? Math.ceil(PATH_LENGTH / spacing) + 2 : 3
  const repeated = Array.from({ length: copies }, () => phrase).join('')

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength())
  }, [phrase])

  // Animate only while on screen; the offset survives pauses.
  useEffect(() => {
    if (!spacing || !inView) return undefined
    const state = drag.current
    if (state.offset === null) state.offset = -spacing
    let frameId
    const loop = () => {
      if (!state.active) {
        state.offset += state.velocity !== 0 ? state.velocity : -SPEED
        state.velocity *= 0.92
        if (Math.abs(state.velocity) < 0.2) state.velocity = 0
      }
      if (state.offset <= -spacing * 2) state.offset += spacing
      if (state.offset > 0) state.offset -= spacing
      textPathRef.current?.setAttribute('startOffset', `${state.offset.toFixed(1)}px`)
      frameId = requestAnimationFrame(loop)
    }
    state.applyDelta = (dx) => {
      state.offset += dx
    }
    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [spacing, inView])

  const onPointerDown = (e) => {
    drag.current.active = true
    drag.current.lastX = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    const state = drag.current
    if (!state.active) return
    const dx = e.clientX - state.lastX
    state.lastX = e.clientX
    state.applyDelta?.(dx)
    state.velocity = dx
  }
  const onPointerUp = () => {
    drag.current.active = false
  }

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="relative flex min-h-[420px] w-full cursor-grab items-center overflow-hidden bg-black active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <svg viewBox="0 0 1440 360" className="block w-full select-none overflow-visible font-sans text-[6rem] font-bold uppercase">
        <text ref={measureRef} xmlSpace="preserve" className="invisible" style={{ visibility: 'hidden' }}>
          {phrase}
        </text>
        <defs>
          <path id={pathId} d={`M-100,60 Q720,${60 + CURVE_DEPTH} 1540,60`} fill="none" />
        </defs>
        <text xmlSpace="preserve" className="fill-white" style={{ letterSpacing: '0.01em' }}>
          <textPath ref={textPathRef} href={`#${pathId}`} startOffset="0px">
            {repeated}
          </textPath>
        </text>
      </svg>
    </div>
  )
}
