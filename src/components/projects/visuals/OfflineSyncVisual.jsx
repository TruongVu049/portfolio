import { Drop, Flow, Step, VisualFrame } from './parts'

const PIPELINE = [
  { kicker: 'Offline', text: 'Cashier completes a sale' },
  { kicker: 'IndexedDB', text: 'Bill stored and queued' },
  { kicker: 'Online again', text: 'One tab takes the Web Lock' },
  { kicker: 'Replay', text: 'Oldest bill first', tone: 'accent' },
]

const OUTCOMES = [
  { kicker: 'Accepted', text: 'Checkpoint, move to the next bill', tone: 'ok' },
  { kicker: 'Temporary failure', text: 'Pause the batch, retry later', tone: 'wait' },
  { kicker: 'Conflict', text: 'Skip it and show it to the cashier', tone: 'fail' },
  { kicker: 'Non-cash payment', text: 'Send to manual review', tone: 'wait' },
]

/** MeU Omni POS: how an offline bill is queued and replayed. */
export default function OfflineSyncVisual({ compact = false }) {
  return (
    <VisualFrame title="Offline sale → sync" compact={compact}>
      <Flow steps={PIPELINE} breakpoint="sm" />
      <Drop label="each bill ends in one of" />
      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
        {OUTCOMES.map((o) => (
          <Step key={o.kicker} kicker={o.kicker} tone={o.tone}>
            {o.text}
          </Step>
        ))}
      </div>
      {!compact && (
        <p className="mt-4 border-t border-white/[0.06] pt-4 text-sm leading-6 text-zinc-400">
          If a sync stops halfway, the pipeline resumes from its checkpoint and checks the server before going on. A
          draft whose later steps fail is cancelled, and payments are compared so only the missing amount is posted.
        </p>
      )}
    </VisualFrame>
  )
}
