import { init, close, setTag } from '@sentry/react'
import { useEffect } from 'react'
import { useHomeStore } from '../../routes/home/store'
import config from '@config'

export const useSentry = () => {
  const { globals } = useHomeStore((state) => ({
    globals: state.globals
  }))
  useEffect(() => {
    if (globals?.settings.telemetry && config.sentryDsn) {
      init({
        dsn: config.sentryDsn,
        integrations: [],
        tracesSampleRate: 1.0
      })
      setTag('version', globals.version)
      setTag('network', config.network.name)
    } else {
      close()
    }
  }, [globals?.settings.telemetry, globals?.version])
}
