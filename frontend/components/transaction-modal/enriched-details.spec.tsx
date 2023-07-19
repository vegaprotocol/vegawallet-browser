import React from 'react'
import { render, screen } from '@testing-library/react'
import { EnrichedDetails } from './enriched-details'
import { ReceiptComponentProps } from '../receipts/receipts'

jest.mock('../vega-section', () => ({
  VegaSection: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="vega-section">{children}</div>
  }
}))

jest.mock('../receipts', () => ({
  TransactionSwitch: ({ transaction }: ReceiptComponentProps) => {
    if (transaction === null) return null
    return <div data-testid="mocked-transaction-switch" />
  }
}))

describe('EnrichedDetails', () => {
  test('renders null when TxSwitch is falsy', () => {
    render(<EnrichedDetails transaction={null} />)
    const enrichedDetailsElement = screen.queryByTestId('mocked-transaction-switch')
    expect(enrichedDetailsElement).not.toBeInTheDocument()
  })

  test('renders VegaSection with TransactionSwitch when TxSwitch is truthy', () => {
    const transaction = { id: 1, amount: 100 }
    render(<EnrichedDetails transaction={transaction} />)
    const vegaSectionElement = screen.getByTestId('vega-section')
    const transactionSwitchElement = screen.getByTestId('mocked-transaction-switch')

    expect(vegaSectionElement).toBeInTheDocument()
    expect(transactionSwitchElement).toBeInTheDocument()
  })
})
