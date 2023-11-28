import { close, init, setTag } from '@sentry/react'
import { useEffect } from 'react'

import config from '!/config'

import { sanitizeEvent } from '../../../lib/sanitize-event.js'
import { useGlobalsStore } from '../../stores/globals'
import { useWalletStore } from '../../stores/wallets'

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
