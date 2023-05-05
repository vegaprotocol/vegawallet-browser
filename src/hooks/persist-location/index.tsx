import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes'

export const LOCATION_KEY = 'location'

export const usePersistLocation = () => {
  let location = useLocation()

  useEffect(() => {
    // Ignore the home route as we do not want to persist this
    // users will never be on the home route, it's only a passthrough
    // to get them to the place they need to be. So if on home this is
    // an initial load we do not wish to persist
    if (location.pathname !== FULL_ROUTES.home) {
      localStorage.setItem(LOCATION_KEY, location.pathname)
    }
  }, [location])
}
