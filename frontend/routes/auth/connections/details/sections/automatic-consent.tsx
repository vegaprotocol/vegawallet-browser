import { Checkbox } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'

import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useAsyncAction } from '@/hooks/async-action'
import { Connection } from '@/types/backend'

export const AutomaticConsentSection = ({ connection }: { connection: Connection }) => {
  const [autoConsent, setAutoConsent] = useState(connection.autoConsent)
  const { request } = useJsonRpcClient()
  const { loaderFunction, loading, error } = useAsyncAction(async () => {
    console.log('Setting automatic consent to', autoConsent)
    setAutoConsent(!autoConsent)
  })

  return (
    <form>
      <VegaSection>
        <SubHeader content="Automatic consent" />
        <div className="mt-2">
          <Checkbox
            label={
              'Allow order and vote transactions to be automatically signed from this site. Can be turned off at any time.'
            }
            checked={autoConsent}
            disabled={!!(loading || error)}
            onCheckedChange={() => loaderFunction()}
            name={'autoConsent'}
          />
        </div>
      </VegaSection>
    </form>
  )
}
