import { format } from 'date-fns'
import groupBy from 'lodash/groupBy'
import { NavLink } from 'react-router-dom'
import ReactTimeAgo from 'react-time-ago'

import { HostImage } from '@/components/host-image'
import { ChevronRight } from '@/components/icons/chevron-right'
import { List } from '@/components/list'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { getTitle } from '@/lib/get-title'
import { formatDate, formatTime } from '@/lib/utils'
import { FULL_ROUTES } from '@/routes/route-names'
import type { StoredTransaction } from '@/types/backend'

import { VegaTransactionState } from '../transactions-state'

export const locators = {
  transactionListItem: 'transaction-list-item',
  transactionListItemKeyName: 'transaction-list-item-key-name',
  transactionListItemTransactionType: 'transaction-list-item-transaction-type',
  transactionListItemDecision: 'transaction-list-item-decision',
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

export const GroupedTransactionList = ({ transactions }: { transactions: StoredTransaction[] }) => {
  const transactionsByDate = transactions.map((transaction) => ({
    ...transaction,
    daySent: format(new Date(transaction.decision), 'yyyy-MM-dd')
  }))
  const groupedTransactions = groupBy(transactionsByDate, 'daySent')
  const today = format(new Date(), 'yyyy-MM-dd')
  return (
    <section>
      {Object.keys(groupedTransactions).map((date) => (
        <VegaSection key={date}>
          <SubHeader content={formatDate(date)} />
          <TransactionsList transactions={groupedTransactions[date]} renderTime={date === today} />
        </VegaSection>
      ))}
    </section>
  )
}

export const TransactionsList = ({
  transactions,
  renderTime
}: {
  transactions: StoredTransaction[]
  renderTime: boolean
}) => {
  return (
    <List<StoredTransaction>
      items={transactions}
      empty={<TransactionListEmpty />}
      renderItem={(transaction) => (
        <div data-testid={locators.transactionListItem} className="flex flex-row justify-between h-16">
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
              </div>
              <VegaTransactionState state={transaction.state} />
            </div>
            <div className="text-xs">
              <ReactTimeAgo
                data-testid={locators.transactionListItemDecision}
                timeStyle="round"
                date={new Date(transaction.decision)}
                locale="en-US"
              />
              <span className="mx-2">•</span>
              <span>{formatTime(new Date(transaction.decision).getTime())}</span>
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
