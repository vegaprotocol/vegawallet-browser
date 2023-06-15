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
  const { client } = useJsonRpcClient()
  const { connections, loading, error, loadConnections } = useConnectionStore((state) => ({
    connections: state.connections,
    loading: state.loading,
    error: state.error,
    loadConnections: state.loadConnections
  }))
  useEffect(() => {
    loadConnections(client)
  }, [client, loadConnections])

  if (error || loading) return null

  return (
    <section>
      <h1 data-testid={connectionsHeader} className="flex justify-center flex-col text-2xl text-white mb-6">
        Connections
      </h1>
      {connections.length === 0 ? <NoAppsConnected /> : <ConnectionsList connections={connections} />}
      <div className="mt-6">
        <Frame>
          <p data-testid={locators.connectionInstructions}>
            Trying to connect to a{' '}
            <ExternalLink
              data-testid={locators.connectionInstructionsLink}
              className="underline"
              href="https://vega.xyz/use"
            >
              <span>Vega dApp?</span>
            </ExternalLink>{' '}
            Look for the "Connect Wallet" button and press it to create a connection.
          </p>
        </Frame>
      </div>
    </section>
  )
}
