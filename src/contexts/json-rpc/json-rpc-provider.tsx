import { useMemo } from 'react'
import JSONRPCClient from '../../lib/json-rpc-client'
import { JsonRpcContext } from './json-rpc-context'
import { useLogger } from '@vegaprotocol/react-helpers'

const createClient = (logger: ReturnType<typeof useLogger>) => {
  // @ts-ignore
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime

  const backgroundPort = runtime.connect({ name: 'popup' })
  const background = new JSONRPCClient({
    send(msg: any) {
      logger.info('Sending message to background', msg)
      backgroundPort.postMessage(msg)
    }
  })
  // @ts-ignore
  window.client = background
  backgroundPort.onMessage.addListener((res: any) => {
    logger.info('Received message from background', res)
    background.onmessage(res)
  })
  return background
}

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const clientLogger = useLogger({
    application: 'Vega Wallet',
    tags: ['global', 'json-rpc-client']
  })
  const client = useMemo(() => createClient(clientLogger), [clientLogger])
  return (
    <JsonRpcContext.Provider
      value={{
        client
      }}
    >
      {children}
    </JsonRpcContext.Provider>
  )
}
