import { render, screen } from '@testing-library/react'
import { TransactionSwitch } from '.'

jest.mock('./transaction-map', () => ({
  TransactionMap: {
    transfer: () => <div data-testid="transfer" />
  }
}))

describe('TransactionSwitch', () => {
  test('renders null when transaction is unknown', () => {
    const { container } = render(<TransactionSwitch transaction={{ someUnknownType: {} }} />)
    expect(container).toBeEmptyDOMElement()
  })

  test('renders the correct component based on transaction type', () => {
    const transaction = {
      transfer: {
        amount: 200
      }
    }
    render(<TransactionSwitch transaction={transaction} />)
    expect(screen.getByTestId('transfer')).toBeInTheDocument()
  })
})
