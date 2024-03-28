import { useParams } from 'react-router-dom'

import { getTitle } from '@/components/modals/transaction-modal/get-title'
import { BasePage } from '@/components/pages/page'
import { TransactionSwitch } from '@/components/receipts'
import { FULL_ROUTES } from '@/routes/route-names'
import { useTransactionsStore } from '@/stores/transactions-store'

export const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { transactions } = useTransactionsStore((state) => ({
    transactions: state.transactions
  }))
  const transaction = transactions.find((tx) => tx.id === id)
  if (!transaction) {
    throw new Error(`Could not find transaction with id ${id}`)
  }

  return (
    <BasePage
      backLocation={FULL_ROUTES.transactions}
      dataTestId={'transaction'}
      title={getTitle(transaction.transaction)}
    >
      <TransactionSwitch transaction={transaction.transaction} />
    </BasePage>
  )
}
