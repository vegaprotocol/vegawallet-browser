import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'

import { HostImage } from '@/components/host-image'
import { ChevronRight } from '@/components/icons/chevron-right'
import { List } from '@/components/list'
import { getTitle } from '@/components/modals/transaction-modal/get-title'
import { BasePage } from '@/components/pages/page'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { WALLET_NAME } from '@/lib/create-wallet'
import { Transaction } from '@/lib/transactions'
import { FULL_ROUTES } from '@/routes/route-names'
import { useWalletStore } from '@/stores/wallets'

export const locators = {
  transactions: 'transactions',
  transactionsDescription: 'transactions-description'
}

type TransactionState = 'Confirmed' | 'Rejected'

interface StoredTransaction {
  transaction: Transaction
  publicKey: string
  sendingMode: string
  keyName: string
  walletName: string
  origin: string
  node?: string
  receivedAt: string // Date
  error?: string
  networkId: string
  chainId: string
  decision: string // Date
  state: TransactionState
}

const TRANSACTION_STATE_COLOR = {
  Confirmed: 'text-vega-blue-500',
  Rejected: 'text-vega-dark-300'
}

const VegaTransactionState = ({ state }: { state: TransactionState }) => {
  const color = TRANSACTION_STATE_COLOR[state]
  return <span className={color}>{state}</span>
}

const TransactionsList = ({ transactions }: { transactions: StoredTransaction[] }) => {
  return (
    <List<StoredTransaction>
      items={transactions}
      renderItem={(transaction) => (
        <div className="flex flex-row justify-between h-12">
          <div className="flex flex-col w-full mr-2">
            <div className="flex flex-row items-center">
              <HostImage hostname={transaction.origin} size={20} />
              <div className="ml-2 text-white">{getTitle(transaction.transaction)}</div>
            </div>
            <div className="flex flex-row justify-between items-center text-sm mt-1">
              <div className="flex flex-row">
                <div className="text-vega-dark-300">{transaction.keyName}</div>
                <span className="mx-2">•</span>
                <ReactTimeAgo timeStyle="round" date={new Date(transaction.decision)} locale="en-US" />
              </div>
              <VegaTransactionState state={transaction.state} />
            </div>
          </div>
          <NavLink
            className="hover:bg-vega-dark-200 w-12 h-full border-l border-1 border-vega-dark-150 flex items-center justify-center"
            to={`${FULL_ROUTES.home}`}
          >
            <ChevronRight />
          </NavLink>
        </div>
      )}
      idProp="publicKey"
    />
  )
}

export const Transactions = () => {
  const { request } = useJsonRpcClient()
  const [transactions, setTransactions] = useState<StoredTransaction[]>([])
  useEffect(() => {
    request(RpcMethods.ListTransactions, { wallet: WALLET_NAME }).then((transactions) => {
      const transactionsFlat = Object.values(transactions.transactions).flat(1) as StoredTransaction[]
      setTransactions(transactionsFlat)
    })
  }, [request])
  console.log(transactions)
  return (
    <BasePage dataTestId={locators.transactions} title="Transactions">
      <div className="mt-6">
        <TransactionsList transactions={transactions} />
      </div>
    </BasePage>
  )
}
