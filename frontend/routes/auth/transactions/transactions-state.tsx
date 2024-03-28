import { TransactionState } from '@/types/backend'

const TRANSACTION_STATE_COLOR = {
  Confirmed: 'text-vega-blue-500',
  Rejected: 'text-vega-dark-300',
  Error: 'text-vega-pink-500'
}

export const VegaTransactionState = ({ state }: { state: TransactionState }) => {
  const color = TRANSACTION_STATE_COLOR[state]
  return <span className={color}>{state}</span>
}
