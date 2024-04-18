import { Checkbox } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'

import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useAsyncAction } from '@/hooks/async-action'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { Connection } from '@/types/backend'

export const AutomaticConsentSection = ({ connection }: { connection: Connection }) => {
  const [autoConsent, setAutoConsent] = useState(connection.autoConsent)
  const { request } = useJsonRpcClient()
  const { loaderFunction, loading, error } = useAsyncAction(async () => {
    await request(RpcMethods.UpdateConnection, {
      origin: connection.origin,
      autoConsent: !autoConsent
    })
    setAutoConsent(!autoConsent)
  })
  if (error) throw error

  return (
    <form>
      <VegaSection>
        <SubHeader content="Automatic consent" />
        <div className="mt-2">
          <Checkbox
            label={
              'Allow this site to automatically approve order and vote transactions. This can be turned off in "Connections".'
            }
            checked={autoConsent}
            disabled={loading}
            onCheckedChange={() => loaderFunction()}
            name={'autoConsent'}
          />
        </div>
      </VegaSection>
    </form>
  )
}