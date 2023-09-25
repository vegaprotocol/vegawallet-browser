import { Transfer as TransferType } from '@vegaprotocol/protos/vega/commands/v1/Transfer'
import { AccountType } from '@vegaprotocol/protos/vega/AccountType'
import { render, screen } from '@testing-library/react'
import { locators, Transfer } from '.'
import { useAssetsStore } from '../../../stores/assets-store'
import { useWalletStore } from '../../../stores/wallets'
import { VegaAsset, VegaAssetStatus } from '../../../types/rest-api'

jest.mock('./basic-transfer-view', () => ({
  BasicTransferView: () => <div data-testid="basic-transfer-view" />
}))

jest.mock('./enriched-transfer-view', () => ({
  EnrichedTransferView: () => <div data-testid="enriched-transfer-view" />
}))

jest.mock('../utils/receipt-wrapper', () => ({
  ReceiptWrapper: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="receipt-wrapper">{children}</div>
  }
}))

jest.mock('../utils/string-amounts/amount-with-tooltip', () => ({
  AmountWithTooltip: () => <div data-testid="amount-with-tooltip" />
}))

jest.mock('../../../stores/assets-store', () => ({
  useAssetsStore: jest.fn()
}))

jest.mock('../../../stores/wallets', () => ({
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

const mockAsset: VegaAsset = {
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
  status: VegaAssetStatus.ENABLED
}

const mockWallets = [
  {
    name: 'Wallet 1',
    keys: [
      {
        name: 'Key 1',
        publicKey: '1'.repeat(64),
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
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        assets: [],
        getAssetById: jest.fn().mockReturnValue(mockAsset)
      })
    )
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
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

  it('if transfer time is in the past renders now', () => {
    // 1124-TRAN-002 For a oneOff transfer which is has a delivery date in the past there is a way to see that the transfer will be executed immediately
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
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
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
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
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
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

  it('should render BasicTransferView whilst loading', async () => {
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: true,
        assets: []
      })
    )
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId('basic-transfer-view')).toBeVisible()
  })

  it('should render EnrichedTransferView when loading is false', () => {
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        assets: [mockAsset]
      })
    )
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId('enriched-transfer-view')).toBeVisible()
  })

  it('should render show EnrichedTransferView showing key data when available - transferring to own key', () => {
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        assets: [mockAsset]
      })
    )
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: () => ({
          index: 0,
          metadata: [],
          name: 'Key 1',
          publicKey: '1'.repeat(64)
        })
      })
    )

    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId('enriched-transfer-view')).toBeVisible()
  })

  it('should render show EnrichedTransferView showing key data when available - transferring to external key', () => {
    ;(useAssetsStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        assets: [mockAsset]
      })
    )
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((selector) =>
      selector({
        loading: false,
        wallets: mockWallets,
        getKeyInfo: jest.fn().mockReturnValue(undefined)
      })
    )
    const oneOffTransfer = {
      transfer: {
        ...baseTransfer,
        to: '2'.repeat(64),
        oneOff: {
          deliverOn: '0'
        }
      }
    }

    render(<Transfer transaction={oneOffTransfer} />)
    expect(screen.getByTestId('enriched-transfer-view')).toBeVisible()
  })
})
