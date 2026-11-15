import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const TYPE_INTERVAL_MS = 45
const LINE_PAUSE_MS = 260

function TerminalLine({ line, active, onDone }) {
  const [shown, setShown] = useState(line.kind === 'type' ? '' : null)

  useEffect(() => {
    if (!active) return undefined
    if (line.kind !== 'type') {
      const id = setTimeout(onDone, LINE_PAUSE_MS)
      return () => clearTimeout(id)
    }
    let index = 0
    const id = setInterval(() => {
      index += 1
      setShown(line.text.slice(0, index))
      if (index >= line.text.length) {
        clearInterval(id)
        setTimeout(onDone, LINE_PAUSE_MS)
      }
    }, TYPE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [active, line, onDone])

  // Lines are only mounted once reached, so plain lines stay visible after their turn.
  const visible = line.kind === 'type' ? shown : line.text

  return (
    <span
      className={`block text-sm font-normal tracking-tight transition-[opacity,transform] duration-300 ${line.muted ? 'text-zinc-500' : ''}`}
      style={{ animation: line.kind === 'type' ? undefined : 'terminal-line-in 0.3s ease-out both' }}
    >
      {visible}
    </span>
  )
}

/**
 * macOS-style terminal that types its lines one after another once it scrolls
 * into view. Lines not reached yet are laid out invisibly, so the window keeps
 * its final height and nothing below it moves while it types.
 */
export default function Terminal({ lines, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.6 })
  const reduceMotion = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const reached = reduceMotion ? lines.length : isInView ? activeIndex : -1

  return (
    <div
      ref={ref}
      className={`keep-dark relative w-full overflow-hidden rounded-xl border border-zinc-800 bg-black text-white ${className}`}
    >
      <style>{'@keyframes terminal-line-in{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:none}}'}</style>
      <div aria-hidden="true" className="flex gap-2 border-b border-zinc-800 p-3">
        <span className="h-3 w-3 rounded-full bg-red-500" />
        <span className="h-3 w-3 rounded-full bg-yellow-500" />
        <span className="h-3 w-3 rounded-full bg-green-500" />
      </div>
      <pre className="overflow-hidden whitespace-pre-wrap p-4 font-mono">
        <code className="flex flex-col gap-1">
          {lines.map((line, i) =>
            i <= reached ? (
              <TerminalLine
                key={line.text}
                line={reduceMotion ? { ...line, kind: 'line' } : line}
                active={i === reached}
                onDone={() => setActiveIndex((current) => (current === i ? i + 1 : current))}
              />
            ) : (
              <span key={line.text} className="invisible block text-sm tracking-tight">
                {line.text}
              </span>
            ),
          )}
        </code>
      </pre>
    </div>
  )
}
