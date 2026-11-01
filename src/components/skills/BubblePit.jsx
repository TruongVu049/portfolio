import { useEffect, useRef, useState } from 'react'
import { useInViewport } from '../../hooks/useInViewport'
import { createBody, isSettled, poke, step } from './bubblePhysics'
import { MONO } from './skills.data'

const BASE_RADIUS = 56
const MAX_DT = 1 / 30
const FLICK_SCALE = 1

const scaleFor = (width) => (width < 640 ? 0.62 : width < 1024 ? 0.8 : 1)

function Bubble({ skill, radius, nodeRef }) {
  const Icon = skill.icon
  return (
    <div
      ref={nodeRef}
      className="absolute left-0 top-0 flex cursor-grab select-none flex-col items-center justify-center gap-1.5 rounded-full border border-(--bubble-border) shadow-(--bubble-shadow) will-change-transform active:cursor-grabbing"
      style={{
        width: radius * 2,
        height: radius * 2,
        // Start hidden above the box until the first physics frame positions it.
        transform: 'translate3d(0, -200%, 0)',
        background: `radial-gradient(circle at 50% 35%, ${skill.color === MONO ? 'transparent' : `${skill.color}26`}, var(--bubble-core) 70%)`,
      }}
    >
      {/* Monochrome logos follow the text colour so they stay visible in both themes. */}
      <Icon size={radius * 0.62} color={skill.color === MONO ? 'var(--color-white)' : skill.color} />
      <span className="text-[11px] font-medium text-zinc-200">{skill.name}</span>
    </div>
  )
}

/**
 * Bubbles fall into the box and pile up. Drag to grab, release to flick,
 * or sweep the pointer through them to poke.
 *
 * Performance: the loop only runs while the box is on screen and something is
 * moving; the box size is cached via ResizeObserver (no per-frame layout reads).
 */
export default function BubblePit({ skills }) {
  const boxRef = useRef(null)
  const nodesRef = useRef([])
  const bodiesRef = useRef([])
  const sizeRef = useRef({ width: 0, height: 0 })
  const wakeRef = useRef(() => {})
  const pointerRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, t: 0, dragIndex: -1, offsetX: 0, offsetY: 0 })
  const inView = useInViewport(boxRef, '100px')
  // Bubble scale per breakpoint; shared by the DOM size and the physics radius.
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const box = boxRef.current
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      sizeRef.current = { width, height }
      setScale(scaleFor(width))
      wakeRef.current()
    })
    observer.observe(box)
    return () => observer.disconnect()
  }, [])

  // (Re)spawn bodies whenever the visible skill set or the scale changes.
  useEffect(() => {
    const width = boxRef.current.clientWidth
    bodiesRef.current = skills.map((skill, i) => {
      const r = BASE_RADIUS * skill.size * scale
      const x = r + Math.random() * Math.max(1, width - 2 * r)
      return createBody(x, -r - i * r * 0.9, r)
    })
    wakeRef.current()
  }, [skills, scale])

  useEffect(() => {
    if (!inView) return undefined
    let frameId = 0
    let last = 0

    const render = () => {
      bodiesRef.current.forEach((body, i) => {
        const node = nodesRef.current[i]
        if (!node) return
        const x = Math.round((body.x - body.r) * 10) / 10
        const y = Math.round((body.y - body.r) * 10) / 10
        if (body.renderedX === x && body.renderedY === y) return
        body.renderedX = x
        body.renderedY = y
        node.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }

    const loop = (now) => {
      const dt = last ? Math.min(MAX_DT, (now - last) / 1000) : 1 / 60
      last = now
      const { width, height } = sizeRef.current
      step(bodiesRef.current, dt, width, height)
      render()
      // Go to sleep once everything has come to rest; interactions wake it up.
      if (pointerRef.current.dragIndex < 0 && isSettled(bodiesRef.current)) {
        frameId = 0
        return
      }
      frameId = requestAnimationFrame(loop)
    }

    const wake = () => {
      if (frameId) return
      last = 0
      frameId = requestAnimationFrame(loop)
    }
    wakeRef.current = wake
    wake()

    return () => {
      cancelAnimationFrame(frameId)
      frameId = 0
      wakeRef.current = () => {}
    }
  }, [inView])

  const localPoint = (e) => {
    const rect = boxRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e) => {
    const { x, y } = localPoint(e)
    const index = bodiesRef.current.findIndex((b) => Math.hypot(b.x - x, b.y - y) <= b.r)
    if (index < 0) return
    const body = bodiesRef.current[index]
    body.dragging = true
    Object.assign(pointerRef.current, { dragIndex: index, offsetX: x - body.x, offsetY: y - body.y })
    boxRef.current.setPointerCapture(e.pointerId)
    wakeRef.current()
  }

  const handlePointerMove = (e) => {
    const { x, y } = localPoint(e)
    const pointer = pointerRef.current
    const now = performance.now()
    const dt = Math.max(1, now - pointer.t) / 1000
    const vx = (x - pointer.x) / dt
    const vy = (y - pointer.y) / dt
    Object.assign(pointer, { x, y, vx, vy, t: now })

    if (pointer.dragIndex >= 0) {
      const body = bodiesRef.current[pointer.dragIndex]
      if (body) {
        body.x = x - pointer.offsetX
        body.y = y - pointer.offsetY
      }
    } else if (poke(bodiesRef.current, x, y, vx, vy)) {
      wakeRef.current()
    }
  }

  const handlePointerUp = (e) => {
    const pointer = pointerRef.current
    const body = bodiesRef.current[pointer.dragIndex]
    if (body) {
      body.dragging = false
      body.vx = pointer.vx * FLICK_SCALE
      body.vy = pointer.vy * FLICK_SCALE
    }
    pointer.dragIndex = -1
    if (boxRef.current?.hasPointerCapture(e.pointerId)) boxRef.current.releasePointerCapture(e.pointerId)
    wakeRef.current()
  }

  return (
    <div
      ref={boxRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative h-full w-full touch-none overflow-hidden [contain:strict]"
    >
      {skills.map((skill, i) => (
        <Bubble
          key={skill.name}
          skill={skill}
          radius={BASE_RADIUS * skill.size * scale}
          nodeRef={(el) => (nodesRef.current[i] = el)}
        />
      ))}
    </div>
  )
}
