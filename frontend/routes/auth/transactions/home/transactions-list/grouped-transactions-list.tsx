import { format } from 'date-fns'
import groupBy from 'lodash/groupBy'

import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { formatDate } from '@/lib/utils'
import type { StoredTransaction } from '@/types/backend'

import { TransactionsList } from './transactions-list'
import { TransactionListEmpty } from './transactions-list-empty'

export const locators = {}

export const GroupedTransactionList = ({ transactions }: { transactions: StoredTransaction[] }) => {
  const transactionsByDate = transactions.map((transaction) => ({
    ...transaction,
    daySent: format(new Date(transaction.decision), 'yyyy-MM-dd')
  }))
  const groupedTransactions = groupBy(transactionsByDate, 'daySent')
  const hasTransactions = Object.keys(groupedTransactions).length > 0
  if (!hasTransactions) return <TransactionListEmpty />
  return (
    <section>
      {Object.keys(groupedTransactions).map((date) => (
        <VegaSection key={date}>
          <SubHeader content={formatDate(date)} />
          <TransactionsList transactions={groupedTransactions[date]} />
        </VegaSection>
      ))}
    </section>
  )
}
