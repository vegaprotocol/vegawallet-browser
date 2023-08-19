import { Transfer as TransferType } from '@vegaprotocol/protos/dist/vega/commands/v1/Transfer.js'
import { AccountType } from '@vegaprotocol/protos/dist/vega/AccountType.js'
import { render, screen } from '@testing-library/react'
import { Transfer, locators } from '.'

jest.mock('../utils/price-with-symbol', () => ({
  PriceWithSymbol: () => <div data-testid="PriceWithSymbol" />
}))
jest.mock('../../keys/vega-key', () => ({
  VegaKey: ({ publicKey }: { publicKey: string }) => <div data-testid="VegaKey">{publicKey}</div>
}))

const baseTransfer: TransferType = {
  amount: '1',
  asset: '0'.repeat(64),
  to: '1'.repeat(64),
  fromAccountType: AccountType.ACCOUNT_TYPE_BOND,
  toAccountType: AccountType.ACCOUNT_TYPE_BOND,
  reference: 'reference'
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
  it('should render title, price, receiving key and when the transaction is scheduled to be delivered', () => {
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }
    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId(locators.transferSection)).toBeVisible()
    expect(screen.getByTestId(locators.transferTitle)).toHaveTextContent('Transfer')
    expect(screen.getByTestId('PriceWithSymbol')).toBeInTheDocument()
    expect(screen.getByTestId('VegaKey')).toHaveTextContent(
      '1111111111111111111111111111111111111111111111111111111111111111'
    )
    expect(screen.getByTestId(locators.whenSection)).toHaveTextContent('When')
  })
  it('if transfer time is in the past renders now', () => {
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
  it('if transfer is in future then it renders relative time', () => {
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
})
