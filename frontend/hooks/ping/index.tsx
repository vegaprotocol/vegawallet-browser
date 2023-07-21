import initKeepAlive from '../../../lib/mv3-keep-alive'
import { useEffect, useMemo } from 'react'
import { getExtensionApi } from '../../lib/extension-apis'

export const usePing = () => {
  const { runtime } = getExtensionApi()
  const backgroundPort = useMemo(() => runtime.connect({ name: 'popup' }), [])
  const keepAlive = useMemo(() => initKeepAlive(), [])
  useEffect(() => {
    const { keepAliveTimeout, keepAliveInterval } = keepAlive(backgroundPort)
    return () => {
      clearInterval(keepAliveInterval)
      clearTimeout(keepAliveTimeout)
    }
  }, [backgroundPort, keepAlive])
}
