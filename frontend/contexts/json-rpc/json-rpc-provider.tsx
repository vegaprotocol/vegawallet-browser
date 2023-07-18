import { useCallback, useMemo } from 'react'
import { JsonRpcContext } from './json-rpc-context'
import { ConnectionMessage, TransactionMessage, useModalStore } from '../../stores/modal-store'
import { ServerRpcMethods } from '../../lib/server-rpc-methods'
import JSONRPCClient from '../../../lib/json-rpc-client'
import JSONRPCServer from '../../../lib/json-rpc-server'
import { PortServer } from '../../../lib/port-server'
import { Connection, useConnectionStore } from '../../stores/connections'
import { RpcMethods } from '../../lib/client-rpc-methods'
import { log } from '../../lib/logging'
import { useErrorStore } from '../../stores/error'

export type SendMessage = (method: string, params?: any, propagate?: boolean) => Promise<any>

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

// TODO move into own file with own tests
const useCreateClient = () => {
  const { setError } = useErrorStore((store) => ({
    setError: store.setError
  }))
  const { addConnection } = useConnectionStore((store) => ({
    addConnection: store.addConnection
  }))

  // TODO better pattern for this
  const notificationHandler = useCallback(
    (message: JsonRpcNotification) => {
      if (message.method === RpcMethods.ConnectionsChange) {
        message.params.add.forEach((m: Connection) => addConnection(m))
      }
    },
    [addConnection]
  )
  const client = useMemo(() => createClient(notificationHandler), [notificationHandler])
  const request = useCallback(
    async (method: string, params: any = null, propagate: boolean = false) => {
      try {
        const result = await client.request(method, params)
        return result
      } catch (e) {
        if (!propagate) {
          setError(e as unknown as Error)
        } else {
          throw e
        }
      }
    },
    [client, setError]
  )
  window.request = request

  return {
    client,
    request
  }
}

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const { client, request } = useCreateClient()
  const { handleConnection, handleTransaction } = useModalStore((store) => ({
    handleConnection: store.handleConnection,
    handleTransaction: store.handleTransaction
  }))
  const server = useMemo(() => createServer(handleConnection, handleTransaction), [handleConnection, handleTransaction])
  const value = useMemo(
    () => ({
      client,
      server,
      request
    }),
    [client, request, server]
  )
  return <JsonRpcContext.Provider value={value}>{children}</JsonRpcContext.Provider>
}
