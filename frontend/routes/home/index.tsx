import { Navigate } from 'react-router-dom'
import { useGetRedirectPath } from '../../hooks/redirect-path'
import { useSentry } from '../../hooks/sentry'

export const Home = () => {
  const { loading, error, path } = useGetRedirectPath()
  useSentry()
  // If loading then we do not know where to redirect to yet
  if (error) {
    // TODO handle error state better!
    return <p>{error}</p>
    // If the user has no passphrase set redirect to the get started page
  } else if (loading || !path) {
    return null
    // If there is an error handle this case
  } else {
    return <Navigate to={path} />
  }
}
