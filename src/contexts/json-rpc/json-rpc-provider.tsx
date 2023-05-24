import { useMemo } from 'react'
import JSONRPCClient from '../../lib/json-rpc-client'
import { JsonRpcContext } from './json-rpc-context'
import { useLogger } from '@vegaprotocol/react-helpers'
import { PortServer } from '../../lib/port-server'
import JSONRPCServer from '../../lib/json-rpc-server'
import { useModalStore } from '../../lib/modal-store'

const createClient = (logger: ReturnType<typeof useLogger>) => {
  // @ts-ignore
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

  const backgroundPort = runtime.connect({ name: 'popup' })

  const background = new JSONRPCClient({
    idPrefix: 'vega-popup-',
    send(msg: any) {
      logger.info('Sending message to background', msg)
      backgroundPort.postMessage(msg)
    }
  })
  window.client = background
  backgroundPort.onMessage.addListener((res: any) => {
    logger.info('Received message from background', res)
    background.onmessage(res)
  })
  return background
}

const createServer = (
  logger: ReturnType<typeof useLogger>,
  handleConnection: (params: any) => Promise<boolean>,
  handleTransaction: (params: any) => Promise<boolean>
) => {
  // @ts-ignore
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
  const backgroundPort = runtime.connect({ name: 'popup' })
  const server = new JSONRPCServer({
    methods: {
      async 'popup.review_connection'(params: any, context: any) {
        logger.info('Message pushed from background', params, context)
        const res = await handleConnection(params)
        return res
      },
      async 'popup.review_transaction'(params: any, context: any) {
        logger.info('Message pushed from background', params, context)
        const res = await handleTransaction(params)
        return res
      }
    }
  })
  window.server = server
  const portServer = new PortServer({
    onerror: () => {},
    onbeforerequest: () => {},
    onafterrequest: () => {},
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
  const clientLogger = useLogger({
    application: 'Vega Wallet',
    tags: ['global', 'json-rpc-client']
  })
  const serverLogger = useLogger({
    application: 'Vega Wallet',
    tags: ['global', 'json-rpc-server']
  })
  const client = useMemo(() => createClient(clientLogger), [clientLogger])
  const server = useMemo(
    () => createServer(serverLogger, handleConnection, handleTransaction),
    [handleConnection, handleTransaction, serverLogger]
  )
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
