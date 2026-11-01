import { useCallback, useRef } from 'react'

export default function GlowCard({
  as: Tag = 'div',
  className = '',
  bare = false,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const onPointerMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])

  return (
    <Tag
      ref={ref}
      onPointerMove={onPointerMove}
      className={`glow-card ${bare ? '' : 'rounded-3xl border border-white/[0.08] bg-zinc-900/90'} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
