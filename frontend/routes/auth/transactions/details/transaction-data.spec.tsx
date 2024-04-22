import { render, screen } from '@testing-library/react'

import { locators as subHeaderLocators } from '@/components/sub-header'
import { TransactionState } from '@/types/backend'

import { testingNetwork } from '../../../../../config/well-known-networks'
import { TransactionData } from './transaction-data'

jest.mock('@/components/modals/transaction-modal/raw-transaction', () => ({
  RawTransaction: () => <div data-testid="raw-transaction" />
}))
jest.mock('@/components/receipts', () => ({
  TransactionSwitch: () => <div data-testid="transaction-switch" />
}))

describe('TransactionData', () => {
  it('renders the header, enriched data, and raw transaction', async () => {
    const mockTransaction = {
      publicKey: '0x1234',
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
    render(<TransactionData transaction={mockTransaction} />)
    expect(screen.getByTestId(subHeaderLocators.subHeader)).toHaveTextContent('Transaction data')
    expect(screen.getByTestId('transaction-switch')).toBeInTheDocument()
    expect(screen.getByTestId('raw-transaction')).toBeInTheDocument()
  })
})
