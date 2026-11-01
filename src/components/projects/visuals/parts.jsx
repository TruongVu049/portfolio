import { ArrowDown, ArrowRight } from 'lucide-react'

// One hue only (the site accent). Outcomes differ by weight and border style, not colour:
// accent = key step, ok = happy path, wait / fail = exception paths (dashed), muted = neutral.
const EXCEPTION = { box: 'border-dashed border-white/20 bg-transparent', kicker: 'text-zinc-300' }
const TONES = {
  accent: { box: 'border-accent/40 bg-accent/[0.08]', kicker: 'text-accent-soft' },
  ok: { box: 'border-accent/30 bg-transparent', kicker: 'text-accent-soft' },
  wait: EXCEPTION,
  fail: EXCEPTION,
  muted: { box: 'border-white/10 bg-white/[0.02]', kicker: 'text-zinc-400' },
}

/**
 * Frame shared by every project explainer: title, the diagram, and an honesty note,
 * which stays visible (shortened) in the compact card version too.
 */
export function VisualFrame({ title, note = 'Simplified for illustration', compact, children }) {
  return (
    <figure className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-4 sm:p-5">
      <figcaption className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-300">{title}</span>
        <span className="text-xs text-zinc-400">{compact ? 'Illustrative' : note}</span>
      </figcaption>
      {children}
    </figure>
  )
}

/** A box in a flow. `kicker` is a short mono label above the text. */
export function Step({ kicker, children, tone = 'muted', className = '' }) {
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${TONES[tone].box} ${className}`}>
      {kicker && <p className={`font-mono text-[11px] uppercase tracking-[0.16em] ${TONES[tone].kicker}`}>{kicker}</p>}
      <p className={`text-[13px] leading-snug text-zinc-200 ${kicker ? 'mt-1' : ''}`}>
        {children}
      </p>
    </div>
  )
}

/** Arrow between steps: down on narrow layouts, right from `breakpoint` up. */
export function Arrow({ breakpoint = 'md' }) {
  const down = breakpoint === 'md' ? 'md:hidden' : 'sm:hidden'
  const right = breakpoint === 'md' ? 'hidden md:block' : 'hidden sm:block'
  return (
    <span aria-hidden="true" className="flex shrink-0 items-center justify-center text-accent-soft">
      <ArrowDown size={14} className={down} />
      <ArrowRight size={14} className={right} />
    </span>
  )
}

/** Ordered steps laid out in a row (wide) or a column (narrow), with arrows between them. */
export function Flow({ steps, breakpoint = 'md' }) {
  const row = breakpoint === 'md' ? 'md:flex-row md:items-stretch' : 'sm:flex-row sm:items-stretch'
  return (
    <ol className={`flex flex-col gap-1.5 ${row}`}>
      {steps.map((step, i) => (
        <li key={step.kicker ?? i} className={`flex flex-1 flex-col gap-1.5 ${row}`}>
          <Step kicker={step.kicker} tone={step.tone} className="flex-1">
            {step.text}
          </Step>
          {i < steps.length - 1 && <Arrow breakpoint={breakpoint} />}
        </li>
      ))}
    </ol>
  )
}

/** Short vertical connector, e.g. from a flow down to its branches. */
export function Drop({ label }) {
  return (
    <div aria-hidden={!label} className="flex items-center gap-3 py-2 pl-4">
      <span className="h-5 w-px bg-accent-soft/50" />
      {label && <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">{label}</span>}
    </div>
  )
}
