import { Transfer as TransferType } from '@vegaprotocol/protos/vega/commands/v1/Transfer.js'
import { AccountType } from '@vegaprotocol/protos/vega/AccountType.js'
import { render, screen } from '@testing-library/react'
import { Transfer, locators } from '.'

jest.mock('../utils/receipt-wrapper', () => ({
  ReceiptWrapper: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="receipt-wrapper">{children}</div>
  }
}))

jest.mock('../utils/price-with-symbol', () => ({
  PriceWithSymbol: () => <div data-testid="PriceWithSymbol" />
}))
jest.mock('../../keys/vega-key', () => ({
  VegaKey: ({ publicKey }: { publicKey: string }) => <div data-testid="VegaKey">{publicKey}</div>
}))
jest.mock('../utils/amount-with-tooltip', () => ({
  AmountWithTooltip: () => <div data-testid="amount-with-tooltip" />
}))

const baseTransfer: TransferType = {
  amount: '1',
  asset: '0'.repeat(64),
  to: '1'.repeat(64),
  fromAccountType: AccountType.ACCOUNT_TYPE_BOND,
  toAccountType: AccountType.ACCOUNT_TYPE_BOND,
  reference: 'reference',
  kind: null
}

describe('TransferReceipt', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(1000)
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it('should render nothing if the transfer type is recurring', () => {
    const recurringTransfer = {
      transfer: {
        ...baseTransfer,
        recurring: {
          startEpoch: 0,
          endEpoch: 1,
          factor: '1'
        }
      }
    }
    const { container } = render(<Transfer transaction={recurringTransfer} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('should render wrapper, amount, receiving key and when the transaction is scheduled to be delivered', () => {
    // 1114-RCPT-004 I can see the receiving key of the transfer
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }
    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId('receipt-wrapper')).toBeVisible()
    expect(screen.getByTestId('amount-with-tooltip')).toBeVisible()
    expect(screen.getByTestId('VegaKey')).toHaveTextContent(
      '1111111111111111111111111111111111111111111111111111111111111111'
    )
    expect(screen.getByTestId(locators.whenSection)).toHaveTextContent('When')
  })
  it('if transfer time is in the past renders now', () => {
    // 1114-RCPT-005 For a oneOff transfer which is has a delivery date in the past there is a way to see that the transfer will be executed immediately
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }
    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId(locators.whenElement)).toHaveTextContent('Now')
  })
  it('if deliverOn is not provided renders now', () => {
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer
      }
    }
    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId(locators.whenElement)).toHaveTextContent('Now')
  })
  it('if transfer is in future then it renders relative & absolute time', () => {
    // 1114-RCPT-006 For a oneOff transfer which is has a delivery date in the future there is a way to see when the transfer will be delivered
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: (1000 * 1000 * 60 * 60 * 24 * 100).toString()
        }
      }
    }
    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId(locators.whenElement)).toHaveTextContent('in 3 months')
    expect(screen.getByTestId(locators.whenElement)).toHaveTextContent('4/11/1970, 12:00:00 AM')
  })
})
