import { connectionsNoConnections } from '../../../locator-ids'

export const NoAppsConnected = () => {
  return (
    <div data-testid={connectionsNoConnections}>
      <p>Your wallet is not connected to any dapps.</p>
    </div>
  )
}
