import { fireEvent, render, screen } from '@testing-library/react'

import { JsonRPCProvider } from '@/contexts/json-rpc/json-rpc-provider'
import { useConnectionStore } from '@/stores/connections'
import { mockClient } from '@/test-helpers/mock-client'
import { mockStore } from '@/test-helpers/mock-store'

import { testingNetwork } from '../../../../config/well-known-networks'
import { locators, TransactionModalFooter } from './transaction-modal-footer'

jest.mock('@/stores/connections')

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
  sendingMode: 'TYPE_SYNC',
  publicKey: '3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80',
  transaction,
  chainId: testingNetwork.chainId,
  receivedAt: new Date('2021-01-01T00:00:00.000Z').toISOString()
}

const renderComponent = () => {
  mockClient()
  mockStore(useConnectionStore, {
    connections: [
      {
        origin: 'https://www.google.com',
        chainId: testingNetwork.chainId,
        networkId: testingNetwork.id,
        autoConsent: false,
        accessedAt: 0,
        allowList: {
          publicKeys: [],
          wallets: ['test-wallet']
        }
      }
    ]
  })
  const function_ = jest.fn()
  const view = render(
    <JsonRPCProvider>
      <TransactionModalFooter details={data} handleTransactionDecision={function_} />
    </JsonRPCProvider>
  )
  return {
    view,
    fn: function_
  }
}

describe('TransactionModalFooter', () => {})
test('renders approve and deny buttons', async () => {
  renderComponent()
  expect(screen.getByTestId(locators.transactionModalApproveButton)).toBeVisible()
  expect(screen.getByTestId(locators.transactionModalDenyButton)).toBeVisible()
})

test('calls handleTransactionDecision with false if rejecting', async () => {
  const { fn } = renderComponent()
  fireEvent.click(screen.getByTestId(locators.transactionModalDenyButton))
  expect(fn).toHaveBeenCalledWith(false)
})

test('calls handleTransactionDecision with false if approving', async () => {
  const { fn } = renderComponent()
  fireEvent.click(screen.getByTestId(locators.transactionModalApproveButton))
  expect(fn).toHaveBeenCalledWith(true)
})
