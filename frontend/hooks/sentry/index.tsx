import { init, close, setTag } from '@sentry/react'
import { useEffect } from 'react'
import config from '@config'
import { Wallet, useWalletStore } from '../../stores/wallets'
import { useGlobalsStore } from '../../stores/globals'
import { ErrorEvent } from '@sentry/types'

export const sanitizeEvent = (event: ErrorEvent, wallets: Wallet[]) => {
  const eventString = JSON.stringify(event)
  wallets.forEach((wallet) => {
    eventString.replace(wallet.name, '[WALLET_NAME]')
    wallet.keys.forEach((key) => {
      eventString.replace(key.publicKey, '[VEGA_KEY]')
    })
  })
  const sanitizedEvent = JSON.parse(eventString)
  return sanitizedEvent
}

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
        /* istanbul ignore next */

        beforeSend(event) {
          /* istanbul ignore next */
          return sanitizeEvent(event, wallets)
        }
      })
      setTag('version', globals.version)
    } else {
      close()
    }
  }, [globals?.settings.telemetry, globals?.version, wallets])
}
