import config from '@/config'
import { init, setTag } from '@sentry/browser'
import { sanitizeEvent } from '../../lib/sanitize-event.js'
import packageJson from '../../package.json'

export const setupSentry = async (settingsStore, walletsStore) => {
  if (config.sentryDsn) {
    init({
      dsn: config.sentryDsn,
      release: `@vegaprotocol/vegawallet-browser@${packageJson.version}`,
      integrations: [],
      tracesSampleRate: 1.0,
      /* istanbul ignore next */
      async beforeSend(event) {
        const telemetry = await settingsStore.get('telemetry')
        // returning null prevents the event from being sent
        if (!telemetry) return null
        const wallets = await walletsStore.list()

        const walletsWithKeys = await Promise.all(
          wallets.map((wallet) => {
            const keys = walletsStore.listKeys({ wallet })
            return {
              name: wallet,
              keys
            }
          })
        )
        /* istanbul ignore next */
        return sanitizeEvent(event, walletsWithKeys)
      }
    })
    setTag('version', packageJson.version)
  }
}
