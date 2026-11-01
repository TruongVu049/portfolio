const LINK_DELAY_S = 0.35

const SIZES = {
  compact: {
    row: 'grid-cols-[6.5rem_minmax(0,1fr)] gap-3',
    label: 'text-[11px] tracking-[0.18em]',
    node: 'px-2.5 py-1.5 text-xs',
    link: 'ml-[7.25rem] h-3',
  },
  full: {
    row: 'gap-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6',
    label: 'text-xs tracking-[0.22em]',
    node: 'px-4 py-3 text-sm',
    link: 'ml-4 h-5 sm:ml-[12.5rem]',
  },
}

/**
 * A project's architecture as stacked layers (client → backend → data → external),
 * each holding its own components, with a signal pulsing down the links between them.
 *
 * @param {{ layers: { layer: string, nodes: string[] }[], size?: 'compact' | 'full', title?: string }} props
 */
export default function ArchitectureFlow({ layers, size = 'compact', title = 'Architecture' }) {
  const s = SIZES[size]
  return (
    <figure>
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">{title}</figcaption>
      <ol className="mt-4">
        {layers.map(({ layer, nodes }, i) => (
          <li key={layer}>
            <div className={`grid items-center ${s.row}`}>
              <span className={`font-mono uppercase text-zinc-400 ${s.label}`}>{layer}</span>
              <ul className="flex flex-wrap gap-1.5">
                {nodes.map((node) => (
                  <li
                    key={node}
                    className={`rounded-lg border border-white/10 bg-white/[0.03] leading-snug text-zinc-200 ${s.node}`}
                  >
                    {node}
                  </li>
                ))}
              </ul>
            </div>
            {i < layers.length - 1 && (
              <span aria-hidden="true" className={`relative block w-px overflow-hidden bg-white/15 ${s.link}`}>
                <span
                  className="absolute inset-0 animate-flow-pulse bg-accent-soft"
                  style={{ animationDelay: `${i * LINK_DELAY_S}s` }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  )
}
