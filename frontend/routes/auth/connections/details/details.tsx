import { Button } from '@vegaprotocol/ui-toolkit'
import { NavLink, useNavigate, useParams } from 'react-router-dom'

import { BasePage } from '@/components/pages/page'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { SendMessage } from '@/contexts/json-rpc/json-rpc-provider'
import { useAsyncAction } from '@/hooks/async-action'
import { formatDate } from '@/lib/utils'
import { FULL_ROUTES } from '@/routes/route-names'
import { useConnectionStore } from '@/stores/connections'
import { Connection } from '@/types/backend'

export const locators = {
  connectionDetails: 'connection-details',
  accessedAt: 'accessed-at',
  origin: 'origin',
  chainId: 'chain-id',
  networkId: 'network-id',
  removeConnection: 'remove-connection'
}

const getTitle = (origin: string) => {
  try {
    const url = new URL(origin)
    return url.hostname
  } catch {
    return origin
  }
}

export const ConnectionDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { request } = useJsonRpcClient()
  if (!id) throw new Error('Id param not provided to connection details')
  const connectionOrigin = decodeURI(id)
  const { connections, removeConnection, loading } = useConnectionStore((state) => ({
    connections: state.connections,
    removeConnection: state.removeConnection,
    loading: state.loading
  }))
  const navigate = useNavigate()
  const {
    loading: removingConnection,
    loaderFunction,
    error
  } = useAsyncAction<
    void,
    {
      request: SendMessage
      connection: Connection
    }
  >(async ({ request, connection }) => {
    await navigate(FULL_ROUTES.connections)
    await removeConnection(request, connection)
  })
  if (error) throw error
  if (loading || removingConnection) return null
  const connection = connections.find((c) => c.origin === connectionOrigin)
  if (!connection) throw new Error(`Could not find connection with origin ${connectionOrigin}`)

  return (
    <BasePage
      backLocation={FULL_ROUTES.connections}
      dataTestId={locators.connectionDetails}
      title={getTitle(connection.origin)}
    >
      <VegaSection>
        <SubHeader content="Origin" />
        <div className="text-white mt-1" data-testid={locators.origin}>
          {connection.origin}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Last accessed" />
        <div className="text-white mt-1" data-testid={locators.accessedAt}>
          {formatDate(connection.accessedAt)}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Chain Id" />
        <div className="text-white mt-1" data-testid={locators.chainId}>
          {connection.chainId}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Network Id" />
        <div className="mt-1">
          <NavLink
            data-testid={locators.networkId}
            className="text-white underline"
            to={`${FULL_ROUTES.networksSettings}/${connection.networkId}`}
          >
            {connection.networkId}
          </NavLink>
        </div>
      </VegaSection>
      <Button
        data-testid={locators.removeConnection}
        onClick={() => loaderFunction({ request, connection })}
        className="w-full mb-6"
        variant="secondary"
      >
        Remove connection
      </Button>
    </BasePage>
  )
}
