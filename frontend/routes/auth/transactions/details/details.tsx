import { useParams } from 'react-router-dom'

export const TransactionDetails = () => {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      <p className="text-sm">Transaction details</p>
    </div>
  )
}
