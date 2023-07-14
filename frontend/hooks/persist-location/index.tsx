import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes/route-names'

export const LOCATION_KEY = 'location'

const IGNORED_PATHS = [
  FULL_ROUTES.home,
  FULL_ROUTES.login,
  FULL_ROUTES.onboarding,
  FULL_ROUTES.getStarted,
  FULL_ROUTES.createPassword,
  FULL_ROUTES.saveMnemonic,
  FULL_ROUTES.confirmMnemonic,
  FULL_ROUTES.telemetry,
  FULL_ROUTES.createWallet,
  FULL_ROUTES.importWallet
]

export const usePersistLocation = () => {
  let location = useLocation()

  useEffect(() => {
    // Ignore the home route as we do not want to persist this
    // users will never be on the home route, it's only a passthrough
    // to get them to the place they need to be. So if on home this is
    // an initial load we do not wish to persist
    if (!IGNORED_PATHS.includes(location.pathname)) {
      localStorage.setItem(LOCATION_KEY, location.pathname)
    }
  }, [location])
}
