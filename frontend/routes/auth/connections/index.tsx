import { Frame } from '../../../components/frame'
import { ConnectionsList } from './connection-list'
import { NoAppsConnected } from './no-dapps-connected'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { useEffect } from 'react'
import { ExternalLink } from '@vegaprotocol/ui-toolkit'
import { connectionsHeader } from '../../../locator-ids'
import { useConnectionStore } from '../../../stores/connections'

export const locators = {
  connectionInstructions: 'connection-instructions',
  connectionInstructionsLink: 'connection-instructions-link'
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

  if (loading) return null

  return (
    <AuthPage dataTestId={connectionsHeader} title="Connections">
      {connections.length === 0 ? (
        <NoAppsConnected />
      ) : (
        <ConnectionsList
          connections={connections}
          removeConnection={(connection) => removeConnection(request, connection)}
        />
      )}
      <div className="mt-6">
        <Frame>
          <p data-testid={locators.connectionInstructions}>
            Trying to connect to a{' '}
            <ExternalLink
              data-testid={locators.connectionInstructionsLink}
              className="underline"
              href="https://vega.xyz/use"
            >
              <span>Vega dapp?</span>
            </ExternalLink>{' '}
            Look for the "Connect Wallet" button and press it to create a connection.
          </p>
        </Frame>
      </div>
    </AuthPage>
  )
}
