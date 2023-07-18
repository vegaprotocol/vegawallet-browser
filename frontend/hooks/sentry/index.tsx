import { init, close, setTag } from '@sentry/react'
import { useEffect } from 'react'
import config from '!/config'
import { useWalletStore } from '../../stores/wallets'
import { useGlobalsStore } from '../../stores/globals'
import { sanitizeEvent } from '../../../lib/sanitize-event.js'

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
        release: `@vegaprotocol/vegawallet-browser@${globals.version}`,
        dsn: config.sentryDsn,
        integrations: [],
        tracesSampleRate: 1.0,
        environment: config.network.name,
        /* istanbul ignore next */

        beforeSend(event) {
          /* istanbul ignore next */
          return sanitizeEvent(
            event,
            wallets.map((wallet) => wallet.name),
            wallets.flatMap((w) => w.keys.map((k) => k.publicKey))
          )
        }
      })
      setTag('version', globals.version)
    } else {
      close()
    }
  }, [globals?.settings.telemetry, globals?.version, wallets])
}
