import { render, screen } from '@testing-library/react'
import { EnrichedDetails } from './enriched-details'

jest.mock('../../vega-section', () => ({
  VegaSection: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="vega-section">{children}</div>
  }
}))

jest.mock('../../receipts', () => ({
  TransactionSwitch: () => {
    return <div data-testid="mocked-transaction-switch" />
  }
}))

describe('EnrichedDetails', () => {
  test('renders null when TxSwitch is falsy', () => {
    const { container } = render(<EnrichedDetails transaction={{ someUnknownTransaction: {} }} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders VegaSection with TransactionSwitch when TxSwitch is truthy', () => {
    const transaction = { transfer: { id: 1, amount: 100 } }
    render(<EnrichedDetails transaction={transaction} />)
    const vegaSectionElement = screen.getByTestId('vega-section')
    const transactionSwitchElement = screen.getByTestId('mocked-transaction-switch')

    expect(vegaSectionElement).toBeInTheDocument()
    expect(transactionSwitchElement).toBeInTheDocument()
  })
})
