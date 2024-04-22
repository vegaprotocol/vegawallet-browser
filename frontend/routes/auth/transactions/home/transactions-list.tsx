import { NavLink } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'

import { HostImage } from '@/components/host-image'
import { ChevronRight } from '@/components/icons/chevron-right'
import { List } from '@/components/list'
import { getTitle } from '@/components/modals/transaction-modal/get-title'
import { FULL_ROUTES } from '@/routes/route-names'
import { StoredTransaction } from '@/types/backend'

import { VegaTransactionState } from '../transactions-state'

export const locators = {
  transactionListItem: 'transaction-list-item',
  transactionListItemKeyName: 'transaction-list-item-key-name',
  transactionListItemTransactionType: 'transaction-list-item-transaction-type',
  // TODO This is hostImage
  // transactionListItemOrigin: 'transaction-list-item-origin',
  transactionListItemDecision: 'transaction-list-item-decision',
  // TODO this is the transaction state component
  // transactionListItemState: 'transaction-list-item-state',
  transactionListItemLink: 'transaction-list-item-link',
  transactionListEmpty: 'transaction-list-empty'
}

const TransactionListEmpty = () => {
  return (
    <div data-testid={locators.transactionListEmpty} className="mt-6 text-sm">
      No transactions have been placed using this wallet on this network.
    </div>
  )
}

export const TransactionsList = ({ transactions }: { transactions: StoredTransaction[] }) => {
  return (
    <List<StoredTransaction>
      items={transactions}
      empty={<TransactionListEmpty />}
      renderItem={(transaction) => (
        <div data-testid={locators.transactionListItem} className="flex flex-row justify-between h-12">
          <div className="flex flex-col w-full mr-2">
            <div className="flex flex-row items-center">
              <HostImage hostname={transaction.origin} size={20} />
              <div data-testid={locators.transactionListItemTransactionType} className="ml-2 text-white">
                {getTitle(transaction.transaction)}
              </div>
            </div>
            <div className="flex flex-row justify-between items-center text-sm mt-1">
              <div className="flex flex-row">
                <div data-testid={locators.transactionListItemKeyName} className="text-vega-dark-300">
                  {transaction.keyName}
                </div>
                <span className="mx-2">•</span>
                <ReactTimeAgo
                  data-testid={locators.transactionListItemDecision}
                  timeStyle="round"
                  date={new Date(transaction.decision)}
                  locale="en-US"
                />
              </div>
              <VegaTransactionState state={transaction.state} />
            </div>
          </div>
          <NavLink
            data-testid={locators.transactionListItemLink}
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
