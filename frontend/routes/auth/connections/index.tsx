import { Frame } from '../../../components/frame'
import { ConnectionsList } from './connection-list'
import { NoAppsConnected } from './no-dapps-connected'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { useEffect } from 'react'
import { ExternalLink } from '@vegaprotocol/ui-toolkit'
import { useConnectionStore } from '../../../stores/connections'
import { BasePage } from '../../../components/pages/page'
import config from '!/config'
import { AsyncRenderer } from '../../../components/async-renderer/async-renderer'

export const locators = {
  connectionInstructions: 'connection-instructions',
  connectionInstructionsLink: 'connection-instructions-link',
  connectionsHeader: 'connections-header'
}

export const Connections = () => {
  const { request } = useJsonRpcClient()
  const { connections, loading, loadConnections, removeConnection } = useConnectionStore((state) => ({
    connections: state.connections,
    loading: state.loading,
    loadConnections: state.loadConnections,
    removeConnection: state.removeConnection
  }))
  useEffect(() => {
    loadConnections(request)
  }, [request, loadConnections])

  return (
    <AuthPage dataTestId={locators.connectionsHeader} title="Connections">
      <AsyncRenderer
        loading={loading}
        noData={connections.length === 0}
        renderNoData={() => <NoAppsConnected />}
        render={() => (
          <ConnectionsList
            connections={connections}
            removeConnection={(connection) => removeConnection(request, connection)}
          />
        )}
      />

      <div className="mt-6">
        <Frame>
          <p data-testid={locators.connectionInstructions}>
            Trying to connect to a{' '}
            <ExternalLink
              data-testid={locators.connectionInstructionsLink}
              className="underline"
              href={config.network.vegaDapps}
            >
              <span>Vega dapp?</span>
            </ExternalLink>{' '}
            Look for the "Connect Wallet" button and press it to create a connection.
          </p>
        </Frame>
      </div>
    </BasePage>
  )
}
