import { useParams } from 'react-router-dom'
import { KeyDetailsPage } from './key-details-page'

export const KeyDetails = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) throw new Error('Id param not provided')
  return <KeyDetailsPage id={id} />
}
