import { Arrow, Drop, Flow, Step, VisualFrame } from './parts'

const SOURCES = [
  { kicker: 'RabbitMQ', text: 'Payment event' },
  { kicker: 'HTTP', text: 'Gateway callback' },
]

const OUTBOX = [
  { kicker: 'Order event', text: 'Outbox row, same transaction' },
  { kicker: 'Dispatcher', text: 'Claims the row with a token under a lock' },
  { kicker: 'RabbitMQ', text: 'Commission engine', tone: 'accent' },
  { kicker: 'On failure', text: 'Retry with exponential backoff', tone: 'wait' },
]

/** PowerShop: duplicate-safe payment ingestion, plus the outbox on the way out. */
export default function PaymentIngestionVisual({ compact = false }) {
  return (
    <VisualFrame title="Payment confirmations → one inbox" compact={compact}>
      <div className="grid items-stretch gap-1.5 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1.1fr)]">
        <div className="grid gap-1.5">
          {SOURCES.map((s) => (
            <Step key={s.kicker} kicker={s.kicker}>
              {s.text}
            </Step>
          ))}
        </div>
        <Arrow breakpoint="sm" />
        <Step kicker="Shared flow" tone="accent" className="flex flex-col justify-center">
          One ingestion path for both sources
        </Step>
        <Arrow breakpoint="sm" />
        <div className="grid gap-1.5">
          <Step kicker="New" tone="ok">
            Unique inbox index accepts it, order updated
          </Step>
          <Step kicker="Duplicate" tone="muted">
            Index rejects it, safely ignored
          </Step>
        </div>
      </div>
      <Drop label="safety net" />
      <Step kicker="Reconciliation job" tone="wait">
        Payments still pending after 10 minutes are re-checked with the gateway, for up to 7 days.
      </Step>
      {!compact && (
        <div className="mt-5 border-t border-white/[0.06] pt-5">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">Outgoing events</p>
          <Flow steps={OUTBOX} />
        </div>
      )}
    </VisualFrame>
  )
}
