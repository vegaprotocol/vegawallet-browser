import { fireEvent, render, screen } from '@testing-library/react'

import { useInteractionStore } from '@/stores/interaction-store'
import { mockStore } from '@/test-helpers/mock-store'

import genericLocators from '../../locators'
import { TransactionModal } from '.'
import { locators } from './transaction-modal'

const transaction = {
  orderSubmission: {
    marketId: '10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2',
    price: '0',
    size: '64',
    side: 'SIDE_SELL',
    timeInForce: 'TIME_IN_FORCE_GTT',
    expiresAt: '1678959957494396062',
    type: 'TYPE_LIMIT',
    reference: 'traderbot',
    peggedOrder: {
      reference: 'PEGGED_REFERENCE_BEST_ASK',
      offset: '15'
    }
  }
}

const data = {
  name: 'Key 1',
  origin: 'https://www.google.com',
  wallet: 'test-wallet',
  publicKey: '3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80',
  transaction: transaction,
  receivedAt: new Date('2021-01-01T00:00:00.000Z').toISOString()
}

jest.mock('./raw-transaction', () => ({
  RawTransaction: () => <div data-testid="raw-transaction" />
}))

jest.mock('./transaction-header', () => ({
  TransactionHeader: () => <div data-testid="transaction-header" />
}))

jest.mock('@/stores/interaction-store')

jest.mock('../../page-header', () => ({
  PageHeader: () => <div data-testid="page-header" />
}))

jest.mock('./enriched-details', () => ({
  EnrichedDetails: () => <div data-testid="enriched-details" />
}))

describe('TransactionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))
  })

  it('renders nothing when isOpen is false', () => {
    const handleTransactionDecision = jest.fn()
    mockStore(useInteractionStore, {
      transactionModalOpen: false,
      currentTransactionDetails: null,
      handleTransactionDecision
    })
    const { container } = render(<TransactionModal />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders page header, transaction type, hostname and key', () => {
    /* 1105-TRAN-011 For transactions that are not orders or withdraw / transfers, there is a standard template with the minimum information required i.e. 
-- [ ] When it was received
-- [ ] Raw JSON details
    1105-TRAN-012 I can copy the raw json to my clipboard
    1122-TSHR-001 I can see a receipt like view on the transaction confirmation screen if one is present
*/

    const handleTransactionDecision = jest.fn()
    mockStore(useInteractionStore, {
      transactionModalOpen: true,
      currentTransactionDetails: data,
      handleTransactionDecision
    })
    render(<TransactionModal />)
    expect(screen.getByTestId('enriched-details')).toBeVisible()
    expect(screen.getByTestId('raw-transaction')).toBeVisible()
    expect(screen.getByTestId('transaction-header')).toBeVisible()
    expect(screen.getByTestId(genericLocators.pageHeader)).toBeVisible()
    expect(screen.getByTestId(locators.transactionWrapper)).toBeVisible()
    expect(screen.getByTestId(locators.transactionTimeAgo)).toHaveTextContent('Received just now')
    expect(screen.getByTestId(locators.transactionModalApproveButton)).toBeVisible()
    expect(screen.getByTestId(locators.transactionModalDenyButton)).toBeVisible()
  })

  it('calls handleTransactionDecision with false if denying', async () => {
    const handleTransactionDecision = jest.fn()
    mockStore(useInteractionStore, {
      transactionModalOpen: true,
      currentTransactionDetails: data,
      handleTransactionDecision
    })
    render(<TransactionModal />)
    fireEvent.click(screen.getByTestId(locators.transactionModalDenyButton))
    expect(handleTransactionDecision).toHaveBeenCalledWith(false)
  })

  it('renders nothing after approving', async () => {
    const handleTransactionDecision = jest.fn()
    mockStore(useInteractionStore, {
      transactionModalOpen: true,
      currentTransactionDetails: data,
      handleTransactionDecision
    })
    render(<TransactionModal />)
    fireEvent.click(screen.getByTestId(locators.transactionModalApproveButton))
    expect(handleTransactionDecision).toHaveBeenCalledWith(true)
  })
})
