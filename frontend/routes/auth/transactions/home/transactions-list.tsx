import { NavLink } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'

import { HostImage } from '@/components/host-image'
import { ChevronRight } from '@/components/icons/chevron-right'
import { List } from '@/components/list'
import { getTitle } from '@/components/modals/transaction-modal/get-title'
import { FULL_ROUTES } from '@/routes/route-names'
import { StoredTransaction, TransactionState } from '@/types/backend'

const TRANSACTION_STATE_COLOR = {
  Confirmed: 'text-vega-blue-500',
  Rejected: 'text-vega-dark-300',
  Error: 'text-vega-red-500'
}

const VegaTransactionState = ({ state }: { state: TransactionState }) => {
  const color = TRANSACTION_STATE_COLOR[state]
  return <span className={color}>{state}</span>
}

export const TransactionsList = ({ transactions }: { transactions: StoredTransaction[] }) => {
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
            to={`${FULL_ROUTES.transactions}/${transaction.id}`}
          >
            <ChevronRight />
          </NavLink>
        </div>
      )}
      idProp="id"
    />
  )
}
