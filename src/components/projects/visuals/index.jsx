import OfflineSyncVisual from './OfflineSyncVisual'
import PaymentIngestionVisual from './PaymentIngestionVisual'
import ServerFormVisual from './ServerFormVisual'
import ApprovalRoutingVisual from './ApprovalRoutingVisual'

/** Explainer diagrams, keyed by the `visual` field of a project. */
const PROJECT_VISUALS = {
  'offline-sync': OfflineSyncVisual,
  'payment-ingestion': PaymentIngestionVisual,
  'server-form': ServerFormVisual,
  'approval-routing': ApprovalRoutingVisual,
}

/** The project's explainer, or nothing when it has none. */
export function ProjectVisual({ project, compact = false }) {
  const Visual = PROJECT_VISUALS[project.visual]
  return Visual ? <Visual compact={compact} /> : null
}
