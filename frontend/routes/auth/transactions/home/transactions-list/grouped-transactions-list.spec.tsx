import { render, screen } from '@testing-library/react'

import { locators as subheaderLocators } from '@/components/sub-header'
import { TransactionState } from '@/types/backend'

import { GroupedTransactionList } from './grouped-transactions-list'

jest.mock('./transactions-list', () => ({
  TransactionsList: () => <div data-testid="transactions-list" />
}))

jest.mock('./transactions-list-empty', () => ({
  TransactionListEmpty: () => <div data-testid="empty" />
}))

describe('GroupedTransactionsList', () => {
  it('renders empty state if there are not transactions', () => {
    // 1148-TXLS-002 When I have no transactions I am presented with a message informing me so
    render(<GroupedTransactionList transactions={[]} />)
    expect(screen.getByTestId('empty')).toBeInTheDocument()
  })
  it('groups all transactions by date', () => {
    render(
      <GroupedTransactionList
        transactions={[
          {
            publicKey: '0'.repeat(64),
            id: '1',
            transaction: { transfer: {} },
            sendingMode: 'SYNC',
            keyName: 'Key 1',
            walletName: 'Wallet 1',
            origin: 'https://foo.com',
            receivedAt: new Date(0).toISOString(),
            networkId: '1',
            chainId: '2',
            decision: new Date(0).toISOString(),
            state: TransactionState.Confirmed,
            node: 'https://node.com',
            error: undefined,
            hash: undefined,
            code: undefined
          }
        ]}
      />
    )
    expect(screen.getByTestId(subheaderLocators.subHeader)).toHaveTextContent('1/1/1970')
    expect(screen.getByTestId('transactions-list')).toBeInTheDocument()
  })
})
