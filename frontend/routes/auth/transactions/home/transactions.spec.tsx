import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'
import { useTransactionsStore } from '@/stores/transactions-store'
import { mockStore } from '@/test-helpers/mock-store'
import { StoredTransaction } from '@/types/backend'

import { testingNetwork } from '../../../../../config/well-known-networks'
import { locators, Transactions } from './transactions'

jest.mock('@/stores/wallets')
jest.mock('@/stores/transactions-store')
jest.mock('./transactions-list', () => ({
  TransactionsList: ({ transactions }: { transactions: StoredTransaction[] }) => (
    <div data-testid="transactions-list">{transactions.length}</div>
  )
}))

const renderComponent = () => {
  render(
    <MockNetworkProvider>
      <Transactions />
    </MockNetworkProvider>
  )
}

describe('Transactions', () => {
  it('renders title, description and list to the parties', () => {
    mockStore(useTransactionsStore, {
      transactions: []
    })
    renderComponent()
    expect(screen.getByTestId(locators.transactions)).toBeVisible()
    expect(screen.getByTestId(locators.transactionsDescription)).toHaveTextContent(
      'This only includes transactions placed from this wallet, in order to see all transactions you can visit the block explorer.'
    )
    expect(screen.getByTestId('transactions-list')).toBeInTheDocument()
    expect(screen.getByTestId('transactions-list')).toHaveTextContent('0')
  })
  it('filters out transactions not in the current network', () => {
    mockStore(useTransactionsStore, {
      transactions: [
        { networkId: 'nope' },
        { networkId: 'nope' },
        { networkId: 'nope' },
        { networkId: 'nope' },
        { networkId: testingNetwork.id },
        { networkId: testingNetwork.id }
      ]
    })
    renderComponent()
    expect(screen.getByTestId(locators.transactions)).toBeVisible()
    expect(screen.getByTestId(locators.transactionsDescription)).toHaveTextContent(
      'This only includes transactions placed from this wallet, in order to see all transactions you can visit the block explorer.'
    )
    expect(screen.getByTestId('transactions-list')).toBeInTheDocument()
    expect(screen.getByTestId('transactions-list')).toHaveTextContent('2')
  })
})
