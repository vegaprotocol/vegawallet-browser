import { act } from 'react-dom/test-utils'
import { Transfer as TransferType } from '@vegaprotocol/protos/vega/commands/v1/Transfer.js'
import { AccountType } from '@vegaprotocol/protos/vega/AccountType.js'
import { render, screen } from '@testing-library/react'
import { locators, Transfer } from '.'
import { Asset, useAssetsStore } from '../../../stores/assets-store.ts'
import { useWalletStore } from '../../../stores/wallets.ts'
import { AssetStatus } from '@vegaprotocol/types'

jest.mock('../utils/receipt-wrapper', () => ({
  ReceiptWrapper: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="receipt-wrapper">{children}</div>
  }
}))

jest.mock('../../keys/vega-key', () => ({
  VegaKey: ({ publicKey }: { publicKey: string }) => <div data-testid="VegaKey">{publicKey}</div>
}))

jest.mock('../utils/string-amounts/amount-with-tooltip', () => ({
  AmountWithTooltip: () => <div data-testid="amount-with-tooltip" />
}))

jest.mock('../utils/string-amounts/price-with-symbol', () => ({
  PriceWithSymbol: () => <div data-testid="price-with-symbol" />
}))

jest.mock('../../../stores/assets-store.ts', () => ({
  useAssetsStore: jest.fn()
}))

jest.mock('../../../stores/wallets.ts', () => ({
  useWalletStore: jest.fn()
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

const mockAsset: Asset = {
  id: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
  details: {
    name: 'Vega (fairground)',
    symbol: 'VEGA',
    decimals: '18',
    quantum: '1',
    erc20: {
      contractAddress: '0xdf1B0F223cb8c7aB3Ef8469e529fe81E73089BD9',
      lifetimeLimit: '0',
      withdrawThreshold: '0'
    }
  },
  status: AssetStatus.STATUS_ENABLED
}

const mockWallets = [
  {
    name: 'Wallet 1',
    keys: [
      {
        name: 'Key 1',
        publicKey: '633d699553a9923e5c3d42ab7281941eb77a2d6ef1a04ac397699eada41b313b',
        index: 2147483649
      }
    ]
  }
]

describe('TransferReceipt', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(1000)
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render nothing if the transfer type is recurring', () => {
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })
    ;(useWalletStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      wallets: mockWallets
    })
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

  it('should render loading state', async () => {
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: true
    })
    ;(useWalletStore as unknown as jest.Mock).mockReturnValue({
      loading: true
    })
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    act(() => {
      render(<Transfer transaction={oneOffTransfer} />)
    })

    expect(screen.getByTestId(locators.loading)).toBeVisible()
  })

  it('should render BasicTransferView on error', async () => {
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      getAssetById: jest.fn(() => {
        throw new Error('Asset not found')
      })
    })
    ;(useWalletStore as unknown as jest.Mock).mockReturnValue({
      loading: false
    })
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    act(() => {
      render(<Transfer transaction={oneOffTransfer} />)
    })

    expect(screen.getByTestId(locators.basicSection)).toBeVisible()
  })

  it('should render EnrichedTransferView when assetInfo is available', () => {
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })
    ;(useWalletStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      wallets: mockWallets
    })
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    act(() => {
      render(<Transfer transaction={oneOffTransfer} />)
    })

    expect(screen.getByTestId(locators.enrichedSection)).toBeVisible()
  })

  it('should render wrapper, amount, receiving key and when the transaction is scheduled to be delivered', () => {
    // 1124-TRAN-001 I can see the receiving key of the transfer
    // 1124-TRAN-006 I can see the price
    ;(useAssetsStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      getAssetById: jest.fn().mockReturnValue(mockAsset)
    })
    ;(useWalletStore as unknown as jest.Mock).mockReturnValue({
      loading: false,
      wallets: mockWallets
    })
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
    expect(screen.getByTestId('price-with-symbol')).toBeVisible()
    expect(screen.getByTestId('VegaKey')).toHaveTextContent(
      '1111111111111111111111111111111111111111111111111111111111111111'
    )
    expect(screen.getByTestId(locators.whenSection)).toHaveTextContent('When')
  })

  it('if transfer time is in the past renders now', () => {
    // 1124-TRAN-002 For a oneOff transfer which is has a delivery date in the past there is a way to see that the transfer will be executed immediately
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
    // 1124-TRAN-003 For a oneOff transfer which is has a delivery date in the future there is a way to see when the transfer will be delivered
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
