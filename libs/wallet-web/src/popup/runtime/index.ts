import { Runtime } from '@vegaprotocol/wallet-ui'

export const getRuntime = (): Runtime => ({
  WindowReload: () => window.location.reload(),
})
