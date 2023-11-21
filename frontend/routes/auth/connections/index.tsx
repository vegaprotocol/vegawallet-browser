import { Frame } from '../../../components/frame'
import { ConnectionsList } from './connection-list'
import { NoAppsConnected } from './no-dapps-connected'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { useEffect } from 'react'
import { useConnectionStore } from '../../../stores/connections'
import { BasePage } from '../../../components/pages/page'
import config from '!/config'
import { AsyncRenderer } from '../../../components/async-renderer/async-renderer'
import { ExternalLink } from '../../../components/external-link'

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
    <BasePage dataTestId={locators.connectionsHeader} title="Connections">
      <AsyncRenderer
        loading={loading}
        noData={connections.length === 0}
        renderNoData={() => (
          <div className="mt-6">
            <NoAppsConnected />
          </div>
        )}
        render={() => (
          <div className="mt-6">
            <ConnectionsList
              connections={connections}
              removeConnection={(connection) => removeConnection(request, connection)}
            />
          </div>
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
