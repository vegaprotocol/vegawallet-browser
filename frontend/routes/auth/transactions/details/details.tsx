import { useParams } from 'react-router-dom'

import { TransactionSwitch } from '@/components/receipts'
import { useTransactionsStore } from '@/stores/transactions-store'

export const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { transactions } = useTransactionsStore((state) => ({
    transactions: state.transactions
  }))
  const transaction = transactions.find((tx) => tx.id === id)
  return (
    <div>
      <p className="text-sm">Transaction details</p>
      <TransactionSwitch transaction={transaction} />
    </div>
  )
}
