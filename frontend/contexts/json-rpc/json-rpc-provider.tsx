import { useMemo } from 'react'
import { JsonRpcContext } from './json-rpc-context'
import { useModalStore } from '../../lib/modal-store'
import { ServerRpcMethods } from '../../lib/server-rpc-methods'
import JSONRPCClient from '../../../lib/json-rpc-client'
import JSONRPCServer from '../../../lib/json-rpc-server'
import { PortServer } from '../../../lib/port-server'

const createClient = () => {
  // @ts-ignore
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

  const backgroundPort = runtime.connect({ name: 'popup' })

  const background = new JSONRPCClient({
    idPrefix: 'vega-popup-',
    send(msg: any) {
      console.info('Sending message to background', msg)
      backgroundPort.postMessage(msg)
    }
  })
  window.client = background
  backgroundPort.onMessage.addListener((res: any) => {
    console.info('Received message from background', res)
    background.onmessage(res)
  })
  return background
}

const createServer = (
  handleConnection: (params: any) => Promise<boolean>,
  handleTransaction: (params: any) => Promise<boolean>
) => {
  // @ts-ignore
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
  const backgroundPort = runtime.connect({ name: 'popup' })
  const server = new JSONRPCServer({
    methods: {
      async [ServerRpcMethods.Connection](params: any, context: any) {
        console.info('Message pushed from background', params, context)
        const res = await handleConnection(params)
        return res
      },
      async [ServerRpcMethods.Transaction](params: any, context: any) {
        console.info('Message pushed from background', params, context)
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
  const { handleConnection, handleTransaction } = useModalStore((store) => ({
    handleConnection: store.handleConnection,
    handleTransaction: store.handleTransaction
  }))
  const client = useMemo(() => createClient(), [])
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
