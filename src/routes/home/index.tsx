import { Navigate } from 'react-router-dom'
import { FULL_ROUTES } from '../routes'
import { LOCATION_KEY } from '../../hooks/persist-location'

export const Home = () => {
  // TODO

  // 1. Attempt to query an authenticated route on the backend

  // 2. If the backend returns an error indicating that the user has no password set, redirect to the onboarding flow

  // 3. If the backend returns unauthenticated, redirect to the login flow

  // 4. If the backend returns successfully with no wallets then:

  // 4.1 If the user has no mnemonic saved in session then redirect to the create wallet page

  // 4.2 If the user has a mnemonic saved in session that is not acknowledged then redirect to the secure a wallet page

  // 5. If the backend returns wallets then:

  // 5.1 If the user has no set telemetry then redirect to the telemetry page

  // 5.2 If the user was previously on a page then redirect to that page

  // 5.3 If the user was not previously on a page then redirect to the wallets page

  const path = localStorage.getItem(LOCATION_KEY)
  return <Navigate to={path || FULL_ROUTES.onboarding} />
}
