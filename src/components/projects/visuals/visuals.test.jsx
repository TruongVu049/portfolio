import { describe, expect, test } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import OfflineSyncVisual from './OfflineSyncVisual'
import PaymentIngestionVisual from './PaymentIngestionVisual'
import ServerFormVisual from './ServerFormVisual'
import ApprovalRoutingVisual from './ApprovalRoutingVisual'
import ArchitectureFlow from '../ArchitectureFlow'

const VISUALS = [
  ['OfflineSyncVisual', OfflineSyncVisual, /resumes from its checkpoint/],
  ['PaymentIngestionVisual', PaymentIngestionVisual, /outgoing events/i],
  ['ServerFormVisual', ServerFormVisual, /invalidates every related query/i],
  ['ApprovalRoutingVisual', ApprovalRoutingVisual, /payment-term change had to take priority/],
]

describe.each(VISUALS)('%s', (_, Visual, fullOnly) => {
  test('the full version adds detail and an honesty note', () => {
    render(<Visual />)

    expect(screen.getByText(fullOnly)).toBeInTheDocument()
    expect(screen.getByText(/illustrat/i)).toBeInTheDocument()
  })

  test('the compact version for the project card drops the detail but still says it is illustrative', () => {
    render(<Visual compact />)

    expect(screen.queryByText(fullOnly)).not.toBeInTheDocument()
    expect(screen.getByText('Illustrative')).toBeInTheDocument()
  })
})

test('flow steps are an ordered list, so their order is announced', () => {
  render(<OfflineSyncVisual compact />)

  const steps = within(screen.getByRole('list')).getAllByRole('listitem')
  expect(steps.map((li) => li.textContent)).toEqual([
    'OfflineCashier completes a sale',
    'IndexedDBBill stored and queued',
    'Online againOne tab takes the Web Lock',
    'ReplayOldest bill first',
  ])
})

test('the decision table is named and keyboard-scrollable', () => {
  render(<ApprovalRoutingVisual compact />)

  const region = screen.getByRole('region', { name: 'Approval route decision table' })
  expect(region).toHaveAttribute('tabindex', '0')
  expect(within(region).getByRole('table')).toHaveAccessibleName(/which approval route/i)
})

test('the offline sync diagram lists every replay outcome', () => {
  render(<OfflineSyncVisual compact />)

  for (const outcome of ['Accepted', 'Temporary failure', 'Conflict', 'Non-cash payment']) {
    expect(screen.getByText(outcome)).toBeInTheDocument()
  }
})

test('the server form diff marks which fields are sent', () => {
  render(<ServerFormVisual compact />)

  expect(screen.getAllByRole('img', { name: 'sent' })).toHaveLength(1)
  expect(screen.getAllByRole('img', { name: 'not sent' })).toHaveLength(2)
})

describe('ArchitectureFlow', () => {
  const layers = [
    { layer: 'Client', nodes: ['Web', 'Admin'] },
    { layer: 'Backend', nodes: ['API'] },
  ]

  test('renders each layer with its nodes, under the given title', () => {
    render(<ArchitectureFlow layers={layers} size="full" title="Simplified layers" />)

    const figure = screen.getByText('Simplified layers').closest('figure')
    expect(within(figure).getByText('Client')).toBeInTheDocument()
    for (const node of ['Web', 'Admin', 'API']) expect(within(figure).getByText(node)).toBeInTheDocument()
  })

  test('draws one link between each pair of layers', () => {
    const { container } = render(<ArchitectureFlow layers={layers} />)

    // Links are the spans between layer rows, one per layer except the last.
    const links = [...container.querySelectorAll('figure > ol > li')].map((li) => li.querySelector(':scope > span'))
    expect(links.map(Boolean)).toEqual([true, false])
    expect(links[0]).toHaveAttribute('aria-hidden', 'true')
  })
})
