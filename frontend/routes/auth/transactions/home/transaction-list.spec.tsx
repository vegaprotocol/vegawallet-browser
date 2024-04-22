import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { StoredTransaction, TransactionState } from '@/types/backend'

import { testingNetwork } from '../../../../../config/well-known-networks'
import { locators, TransactionsList } from './transactions-list'

jest.mock('@/components/host-image', () => ({
  HostImage: () => <div data-testid="host-image" />
}))
jest.mock('../transactions-state', () => ({
  VegaTransactionState: () => <div data-testid="transaction-state" />
}))

const renderComponent = (transactions: StoredTransaction[]) => {
  return render(
    <MemoryRouter>
      <TransactionsList transactions={transactions} />
    </MemoryRouter>
  )
}

describe('TransactionList', () => {
  it('renders an empty message is there are no transactions present', async () => {
    renderComponent([])
    expect(screen.getByTestId(locators.transactionListEmpty)).toBeInTheDocument()
  })

  it('renders host image, transaction type, key used, time it was confirmed, transaction state and link', async () => {
    renderComponent([
      {
        publicKey: '0'.repeat(64),
        id: '1',
        transaction: { transfer: {} },
        sendingMode: 'SYNC',
        keyName: 'Key 1',
        walletName: 'Wallet 1',
        origin: 'https://foo.com',
        receivedAt: new Date().toISOString(),
        networkId: testingNetwork.id,
        chainId: testingNetwork.chainId,
        decision: new Date().toISOString(),
        state: TransactionState.Confirmed,
        node: 'https://node.com',
        error: undefined,
        hash: undefined,
        code: undefined
      }
    ])
    expect(screen.queryByTestId(locators.transactionListEmpty)).not.toBeInTheDocument()
    expect(screen.getByTestId('host-image')).toBeInTheDocument()
    expect(screen.getByTestId(locators.transactionListItemTransactionType)).toBeInTheDocument()
    expect(screen.getByTestId(locators.transactionListItemKeyName)).toBeInTheDocument()
    expect(screen.getByTestId(locators.transactionListItemDecision)).toBeInTheDocument()
    expect(screen.getByTestId('transaction-state')).toBeInTheDocument()
    expect(screen.getByTestId(locators.transactionListItemLink)).toBeInTheDocument()
  })
})
