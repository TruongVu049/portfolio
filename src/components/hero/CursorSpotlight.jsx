import { useEffect, useRef } from 'react'
import { useInViewport } from '../../hooks/useInViewport'

const SIZE = 720

/**
 * Soft light that trails the cursor across the hero. It is a fixed-size gradient
 * moved with transform only (no repaint), eased toward the pointer each frame,
 * and only active on hover-capable devices while the hero is visible.
 */
export default function CursorSpotlight({ containerRef }) {
  const spotRef = useRef(null)
  const inView = useInViewport(containerRef, '0px')

  useEffect(() => {
    if (!inView || !window.matchMedia('(hover: hover)').matches) return undefined
    const container = containerRef.current
    const spot = spotRef.current
    const target = { x: container.clientWidth / 2, y: container.clientHeight / 2 }
    const current = { ...target }
    let frameId = 0

    const loop = () => {
      current.x += (target.x - current.x) * 0.08
      current.y += (target.y - current.y) * 0.08
      spot.style.transform = `translate3d(${current.x - SIZE / 2}px, ${current.y - SIZE / 2}px, 0)`
      const settled = Math.abs(target.x - current.x) < 0.5 && Math.abs(target.y - current.y) < 0.5
      frameId = settled ? 0 : requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      const rect = container.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      spot.style.opacity = '1'
      if (!frameId) frameId = requestAnimationFrame(loop)
    }
    const onLeave = () => {
      spot.style.opacity = '0'
    }

    loop()
    container.addEventListener('pointermove', onMove, { passive: true })
    container.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frameId)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerleave', onLeave)
    }
  }, [inView, containerRef])

  return (
    <div
      ref={spotRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-700 will-change-transform"
      style={{
        width: SIZE,
        height: SIZE,
        background: 'radial-gradient(closest-side, rgba(59,130,246,0.16), rgba(59,130,246,0.05) 55%, transparent)',
      }}
    />
  )
}
