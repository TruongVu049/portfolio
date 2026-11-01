import Reveal from './Reveal'

export default function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  description,
  align = 'left',
  className = '',
  compact = false,
}) {
  const isCenter = align === 'center'
  return (
    <div
      className={`relative z-10 ${compact ? 'mb-4 sm:mb-6' : 'mb-10 sm:mb-14'} ${isCenter ? 'mx-auto text-center' : ''} ${className}`}
    >
      <Reveal>
        <div
          className={`${compact ? 'mb-3' : 'mb-5'} flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 ${isCenter ? 'justify-center' : ''}`}
        >
          {index && <span className="text-accent-soft">{index}</span>}
          <span className="h-px w-8 bg-zinc-700" />
          <span>{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`font-display leading-[0.95] tracking-tight text-white ${compact ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-5xl sm:text-6xl lg:text-7xl'}`}
        >
          {title}
          {accent && (
            <>
              {' '}
              <em className="text-zinc-500">{accent}</em>
            </>
          )}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.16}>
          <p
            className={`${compact ? 'mt-3' : 'mt-5'} max-w-xl text-sm leading-7 text-zinc-500 sm:text-base ${isCenter ? 'mx-auto' : ''}`}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
