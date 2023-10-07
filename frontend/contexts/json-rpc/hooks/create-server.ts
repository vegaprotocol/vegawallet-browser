import { ConnectionMessage } from '../../../stores/interaction-store'
import { ServerRpcMethods } from '../../../lib/server-rpc-methods'
import JSONRPCServer from '../../../../lib/json-rpc-server'
import { PortServer } from '../../../../lib/port-server'
import { log } from '../../../lib/logging'
import { getExtensionApi } from '../../../lib/extension-apis'
import { TransactionMessage } from '../../../lib/transactions'

const maybeCloseWindow = () => {
  const url = new URL(window.location.href)
  const shouldClose = url.search.includes('once')
  if (shouldClose) {
    window.close()
  }
}

// TODO add own tests
export const createServer = (
  handleConnection: (params: ConnectionMessage) => Promise<boolean>,
  handleTransaction: (params: TransactionMessage) => Promise<boolean>
) => {
  const { runtime } = getExtensionApi()
  const backgroundPort = runtime.connect({ name: 'popup' })
  const server = new JSONRPCServer({
    methods: {
      async [ServerRpcMethods.Connection](params: any, context: any) {
        log('info', 'Message pushed from background', params, context)
        const res = await handleConnection(params)
        maybeCloseWindow()
        return res
      },
      async [ServerRpcMethods.Transaction](params: any, context: any) {
        log('info', 'Message pushed from background', params, context)
        const res = await handleTransaction(params)
        maybeCloseWindow()
        return res
      }
    }
  })
  window.server = server
  const portServer = new PortServer({
    onerror: () => {},
    server
  })
  portServer.listen(backgroundPort)
  return server
}
