import { VisualFrame } from './parts'

// Illustrative only: the real conditions and route names are internal.
const ROWS = [
  { paymentTerms: true, otherViews: false, route: 'Payment-term route', note: '' },
  { paymentTerms: true, otherViews: true, route: 'Payment-term route', note: 'payment terms take priority' },
  { paymentTerms: false, otherViews: true, route: 'General route', note: '' },
]

function YesNo({ value }) {
  return <span className={value ? 'text-zinc-100' : 'text-zinc-400'}>{value ? 'Yes' : 'No'}</span>
}

/** Business Partner portal: the decision table written before changing revise routing. */
export default function ApprovalRoutingVisual({ compact = false }) {
  return (
    <VisualFrame
      title="Revise request → approval route"
      note="Illustrative decision table; real conditions are internal"
      compact={compact}
    >
      {/* Focusable so keyboard users can scroll the table sideways on narrow screens. */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Approval route decision table"
        className="overflow-x-auto rounded-xl border border-white/[0.06] focus-visible:outline-2 focus-visible:outline-accent"
      >
        <table className="w-full min-w-[22rem] text-left text-[13px]">
          <caption className="sr-only">Which approval route a revise request takes, by what changed</caption>
          <thead className="bg-white/[0.03] font-mono text-[11px] uppercase tracking-[0.16em] text-zinc-400">
            <tr>
              <th scope="col" className="px-3 py-2.5 font-normal">Payment terms changed</th>
              <th scope="col" className="px-3 py-2.5 font-normal">Other views changed</th>
              <th scope="col" className="px-3 py-2.5 font-normal">Route</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={`${row.paymentTerms}-${row.otherViews}`} className="border-t border-white/[0.06]">
                <td className="px-3 py-2.5"><YesNo value={row.paymentTerms} /></td>
                <td className="px-3 py-2.5"><YesNo value={row.otherViews} /></td>
                <td className="px-3 py-2.5">
                  <span className={row.paymentTerms ? 'text-accent-soft' : 'text-zinc-200'}>{row.route}</span>
                  {row.note && <span className="mt-0.5 block text-xs text-zinc-400">{row.note}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!compact && (
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Revise requests that changed several views at once took the wrong route. Writing every existing case down
          before touching the code showed where a payment-term change had to take priority.
        </p>
      )}
    </VisualFrame>
  )
}
