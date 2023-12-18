import { close, init, setTag } from '@sentry/react'
import { useEffect } from 'react'

import config from '!/config'
import { useGlobalsStore } from '@/stores/globals'
import { useWalletStore } from '@/stores/wallets'

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
        // TODO this needs to be removed when multi-network becomes a thing
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
