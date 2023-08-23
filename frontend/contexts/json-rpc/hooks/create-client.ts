import { useCallback, useMemo } from 'react'
import { Connection, useConnectionStore } from '../../../stores/connections'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import { useErrorStore } from '../../../stores/error'
import { JsonRpcNotification } from '../json-rpc-provider'
import { getExtensionApi } from '../../../lib/extension-apis'
import JSONRPCClient from '../../../../lib/json-rpc-client'
import { log } from '../../../lib/logging'

const createClient = (notificationHandler: Function) => {
  const { runtime } = getExtensionApi()
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

// TODO Add own tests
export const useCreateClient = () => {
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
          setError(e as Error)
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
