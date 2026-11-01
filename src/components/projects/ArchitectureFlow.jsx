const LINK_DELAY_S = 0.35

/**
 * A project's architecture as a chain of layers, with a signal pulsing through the
 * links between them. Horizontal from `sm` up, stacked vertically on phones.
 */
export default function ArchitectureFlow({ steps }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Architecture</p>
      <ol className="mt-4 flex flex-col sm:flex-row sm:items-stretch">
        {steps.map((step, i) => (
          <li key={step} className="flex flex-col items-start sm:flex-1 sm:flex-row sm:items-stretch">
            <span className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs leading-snug text-zinc-300 sm:flex sm:items-center sm:justify-center sm:text-center">
              {step}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="relative ml-5 h-4 w-px flex-none overflow-hidden bg-white/10 sm:ml-0 sm:h-px sm:w-4 sm:self-center"
              >
                <span
                  className="absolute inset-0 animate-flow-pulse bg-accent-soft"
                  style={{ animationDelay: `${i * LINK_DELAY_S}s` }}
                />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
