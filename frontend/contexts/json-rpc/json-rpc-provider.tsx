import { useCallback, useMemo } from 'react'
import { JsonRpcContext } from './json-rpc-context'
import { ConnectionMessage, TransactionMessage, useModalStore } from '../../lib/modal-store'
import { ServerRpcMethods } from '../../lib/server-rpc-methods'
import JSONRPCClient from '../../../lib/json-rpc-client'
import JSONRPCServer from '../../../lib/json-rpc-server'
import { PortServer } from '../../../lib/port-server'
import { Connection, useConnectionStore } from '../../stores/connections'
import { RpcMethods } from '../../lib/client-rpc-methods'
import { log } from '../../lib/logging'

export interface JsonRpcNotification {
  method: string
  params: any
  jsonrpc: '2.0'
}

const getRuntime = () => {
  // @ts-ignore
  return globalThis.browser?.runtime ?? globalThis.chrome?.runtime
}

const createClient = (notificationHandler: Function) => {
  const runtime = getRuntime()
  const backgroundPort = runtime.connect({ name: 'popup' })

  const client = new JSONRPCClient({
    onnotification: (...args) => {
      notificationHandler(...args)
    },
    idPrefix: 'vega-popup-',
    send(msg: any) {
      log('info', 'Sending message to background', msg)
      backgroundPort.postMessage(msg)
    }
  })
  window.client = client
  backgroundPort.onMessage.addListener((res: any) => {
    log('info', 'Received message from background', res)
    client.onmessage(res)
  })
  return client
}

const createServer = (
  handleConnection: (params: ConnectionMessage) => Promise<boolean>,
  handleTransaction: (params: TransactionMessage) => Promise<boolean>
) => {
  const runtime = getRuntime()
  const backgroundPort = runtime.connect({ name: 'popup' })
  const server = new JSONRPCServer({
    methods: {
      async [ServerRpcMethods.Connection](params: any, context: any) {
        log('info', 'Message pushed from background', params, context)
        const res = await handleConnection(params)
        return res
      },
      async [ServerRpcMethods.Transaction](params: any, context: any) {
        log('info', 'Message pushed from background', params, context)
        const res = await handleTransaction(params)
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

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const { addConnection } = useConnectionStore((store) => ({
    addConnection: store.addConnection
  }))
  const notificationHandler = useCallback(
    (message: JsonRpcNotification) => {
      if (message.method === RpcMethods.ConnectionsChange) {
        message.params.add.forEach((m: Connection) => addConnection(m))
      }
    },
    [addConnection]
  )
  const { handleConnection, handleTransaction } = useModalStore((store) => ({
    handleConnection: store.handleConnection,
    handleTransaction: store.handleTransaction
  }))
  const client = useMemo(() => createClient(notificationHandler), [notificationHandler])
  const server = useMemo(() => createServer(handleConnection, handleTransaction), [handleConnection, handleTransaction])
  return (
    <JsonRpcContext.Provider
      value={{
        client,
        server
      }}
    >
      {children}
    </JsonRpcContext.Provider>
  )
}
