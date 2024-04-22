import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { locators as subHeaderLocators } from '@/components/sub-header'
import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import { StoredTransaction, TransactionState } from '@/types/backend'

import { testingNetwork } from '../../../../../config/well-known-networks'
import { locators, TransactionMetadata } from './transaction-metadata'

jest.mock('../transactions-state', () => ({
  VegaTransactionState: () => <div data-testid="transaction-state" />
}))

const renderComponent = (transaction: StoredTransaction) => {
  render(
    <MemoryRouter>
      <MockNetworkProvider>
        <TransactionMetadata transaction={transaction} />
      </MockNetworkProvider>
    </MemoryRouter>
  )
}

describe('TransactionMeta', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })
  it('renders transaction state, subheader and all metadata', () => {
    const mockTransaction = {
      publicKey: '0'.repeat(64),
      id: '1',
      transaction: { transfer: {} },
      sendingMode: 'SYNC',
      keyName: 'Key 1',
      walletName: 'Wallet 1',
      origin: 'https://foo.com',
      receivedAt: new Date(0).toISOString(),
      networkId: testingNetwork.id,
      chainId: testingNetwork.chainId,
      decision: new Date(0).toISOString(),
      state: TransactionState.Confirmed,
      node: 'https://node.com',
      error: undefined,
      hash: '0'.repeat(64),
      code: undefined
    }
    renderComponent(mockTransaction)
    expect(screen.getByTestId('transaction-state')).toBeInTheDocument()
    expect(screen.getByTestId(subHeaderLocators.subHeader)).toHaveTextContent('Transaction Details')

    expect(screen.getByTestId(locators.transactionMetadataPublicKey)).toHaveTextContent('000000…0000')
    expect(screen.getByTestId(locators.transactionMetadataHash)).toHaveTextContent('000000…0000')
    expect(screen.getByTestId(locators.transactionMetadataNetwork)).toHaveTextContent(testingNetwork.id)
    expect(screen.getByTestId(locators.transactionMetadataNode)).toHaveTextContent('https://node.com')
    expect(screen.getByTestId(locators.transactionMetadataOrigin)).toHaveTextContent('https://foo.com')
    expect(screen.getByTestId(locators.transactionMetadataSent)).toHaveTextContent('1/1/1970, 12:00:00 AM')
  })

  it('shows error if there is error present', () => {
    const mockTransaction = {
      publicKey: '0'.repeat(64),
      id: '1',
      transaction: { transfer: {} },
      sendingMode: 'SYNC',
      keyName: 'Key 1',
      walletName: 'Wallet 1',
      origin: 'https://foo.com',
      receivedAt: new Date(0).toISOString(),
      networkId: testingNetwork.id,
      chainId: testingNetwork.chainId,
      decision: new Date(0).toISOString(),
      state: TransactionState.Confirmed,
      node: 'https://node.com',
      error: 'Some error',
      hash: '0'.repeat(64),
      code: undefined
    }
    renderComponent(mockTransaction)
    expect(screen.getByText('Some error')).toBeInTheDocument()
  })

  it('handles no transaction hash', () => {
    const mockTransaction = {
      publicKey: '0'.repeat(64),
      id: '1',
      transaction: { transfer: {} },
      sendingMode: 'SYNC',
      keyName: 'Key 1',
      walletName: 'Wallet 1',
      origin: 'https://foo.com',
      receivedAt: new Date(0).toISOString(),
      networkId: testingNetwork.id,
      chainId: testingNetwork.chainId,
      decision: new Date(0).toISOString(),
      state: TransactionState.Confirmed,
      node: 'https://node.com',
      error: undefined,
      hash: undefined,
      code: undefined
    }
    renderComponent(mockTransaction)
    expect(screen.queryByTestId(locators.transactionMetadataHash)).not.toBeInTheDocument()
  })
})
