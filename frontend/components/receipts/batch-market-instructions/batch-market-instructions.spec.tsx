import { render, screen } from '@testing-library/react'
import { BatchMarketInstructions } from './batch-market-instructions'
import locators from '../../locators'

jest.mock('../orders/amend', () => ({
  AmendmentView: () => <div data-testid="amendment-view" />
}))
jest.mock('../orders/cancellation', () => ({
  CancellationView: () => <div data-testid="cancellation-view" />
}))
jest.mock('../orders/submission', () => ({
  SubmissionView: () => <div data-testid="submission-view" />
}))
jest.mock('../orders/stop-submission', () => ({
  StopOrdersSubmissionView: () => <div data-testid="stop-orders-submission-view" />
}))
jest.mock('../orders/stop-cancellation', () => ({
  StopOrderCancellationView: () => <div data-testid="stop-order-cancellation-view" />
}))

describe('BatchMarketInstructions component', () => {
  const transaction = {
    batchMarketInstructions: {
      cancellations: [{}],
      amendments: [{}],
      submissions: [{}],
      stopOrdersSubmission: [{}],
      stopOrdersCancellation: [{}]
    }
  }

  test('renders all command sections', () => {
    render(<BatchMarketInstructions transaction={transaction} />)
    // 1114-BMKI-001 If there is at least one present I can see all submission details
    // 1114-BMKI-002 If there is at least one present I can see all amendment details
    // 1114-BMKI-003 If there is at least one present I can see all cancellation details
    // 1114-BMKI-004 If there is at least one present I can see all stop order submission details
    // 1114-BMKI-005 If there is at least one present I can see all stop order cancellation details
    const [submission, cancellation, amendment, stopOrderSubmission, stopOrderCancellation] = screen.getAllByTestId(
      locators.collapsiblePanelTitle
    )
    expect(submission).toHaveTextContent('Submission')
    expect(cancellation).toHaveTextContent('Cancellation')
    expect(amendment).toHaveTextContent('Amendment')
    expect(stopOrderSubmission).toHaveTextContent('Stop Order Submission')
    expect(stopOrderCancellation).toHaveTextContent('Stop Order Cancellation')

    expect(screen.getByTestId('submission-view')).toBeInTheDocument()
    expect(screen.getByTestId('cancellation-view')).toBeInTheDocument()
    expect(screen.getByTestId('amendment-view')).toBeInTheDocument()
    expect(screen.getByTestId('stop-orders-submission-view')).toBeInTheDocument()
    expect(screen.getByTestId('stop-order-cancellation-view')).toBeInTheDocument()
  })

  test('does not render command section if no items', () => {
    const transaction = {
      batchMarketInstructions: {
        cancellations: [],
        amendments: [],
        submissions: [],
        stopOrdersSubmission: [],
        stopOrdersCancellation: []
      }
    }
    render(<BatchMarketInstructions transaction={transaction} />)
    expect(screen.queryByTestId(locators.collapsiblePanelTitle)).not.toBeInTheDocument()
  })

  test('renders item for each submission', () => {
    const transactionWithSubmissions = {
      batchMarketInstructions: {
        cancellations: [],
        amendments: [],
        stopOrdersSubmission: [],
        stopOrdersCancellation: [],
        submissions: [
          { id: 1, name: 'Submission 1' },
          { id: 2, name: 'Submission 2' }
        ]
      }
    }
    render(<BatchMarketInstructions transaction={transactionWithSubmissions} />)

    expect(screen.getAllByTestId('header')).toHaveLength(2)
    expect(screen.getAllByTestId('header')[0]).toHaveTextContent('1.')
    expect(screen.getAllByTestId('header')[1]).toHaveTextContent('2.')
  })
})
