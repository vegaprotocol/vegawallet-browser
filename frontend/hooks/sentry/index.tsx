import { init, close, setTag } from '@sentry/react'
import { useEffect } from 'react'
import config from '@config'
import { useWalletStore } from '../../stores/wallets'
import { useGlobalsStore } from '../../stores/globals'

export const useSentry = () => {
  const { globals } = useGlobalsStore((state) => ({
    globals: state.globals
  }))
  const { wallets } = useWalletStore((state) => ({
    wallets: state.wallets
  }))

  useEffect(() => {
    if (globals?.settings.telemetry && config.sentryDsn) {
      init({
        dsn: config.sentryDsn,
        integrations: [],
        tracesSampleRate: 1.0,
        environment: config.network.name,
        beforeSend(event) {
          const eventString = JSON.stringify(event)
          wallets.forEach((wallet) => {
            wallet.keys.forEach((key) => {
              eventString.replace(key.publicKey, '[VEGA_KEY]')
            })
          })
          const sanitizedEvent = JSON.parse(eventString)
          return sanitizedEvent
        }
      })
      setTag('version', globals.version)
    } else {
      close()
    }
  }, [globals?.settings.telemetry, globals?.version, wallets])
}
