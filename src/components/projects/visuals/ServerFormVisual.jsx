import { Check, Minus } from 'lucide-react'
import { Drop, Flow, Step, VisualFrame } from './parts'

const PIPELINE = [
  { kicker: 'Server', text: 'Field definitions' },
  { kicker: 'Runtime', text: 'Zod schema built from them' },
  { kicker: 'Edit mode', text: 'Diff against the loaded values' },
  { kicker: 'PATCH', text: 'Only changed fields', tone: 'accent' },
]

// Example rows: field names and values are made up.
const DIFF = [
  { field: 'phone', change: '0901… → 0938…', sent: true },
  { field: 'startDate', change: '09:00 → 14:30, same day', sent: false },
  { field: 'fullName', change: 'unchanged', sent: false },
]

const REFRESHED = ['Lists', 'Detail pages', 'Dropdown options', 'Activity history']

function DiffTable() {
  return (
    <table className="w-full text-left text-[13px]">
      <caption className="sr-only">Example edit: which fields are sent to the server</caption>
      <thead>
        <tr className="font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
          <th scope="col" className="pb-2 font-normal">Field</th>
          <th scope="col" className="pb-2 font-normal">Change</th>
          <th scope="col" className="pb-2 text-right font-normal">Sent</th>
        </tr>
      </thead>
      <tbody>
        {DIFF.map(({ field, change, sent }) => (
          <tr key={field} className="border-t border-white/[0.06]">
            <td className="py-2 font-mono text-zinc-200">{field}</td>
            <td className="py-2 text-zinc-400">{change}</td>
            <td className="py-2 text-right">
              {sent ? (
                <Check size={15} role="img" aria-label="sent" className="ml-auto text-accent-soft" />
              ) : (
                <Minus size={15} role="img" aria-label="not sent" className="ml-auto text-zinc-400" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** FOSCO ERP: server-driven forms that send only real changes, then refresh related caches. */
export default function ServerFormVisual({ compact = false }) {
  return (
    <VisualFrame title="Server-driven form → minimal update" compact={compact}>
      <Flow steps={PIPELINE} breakpoint="sm" />
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
        <DiffTable />
      </div>
      {!compact && (
        <>
          <Drop label="after approve · reject · convert to worker" />
          <div className="flex flex-wrap items-center gap-1.5">
            <Step kicker="One helper" tone="accent">Invalidates every related query</Step>
            {REFRESHED.map((item) => (
              <span key={item} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300">
                {item}
              </span>
            ))}
          </div>
        </>
      )}
    </VisualFrame>
  )
}
