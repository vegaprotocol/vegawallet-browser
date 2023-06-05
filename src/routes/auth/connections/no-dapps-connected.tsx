import { connectionsNoConnections } from '../../../locator-ids'

export const NoAppsConnected = () => {
  return (
    <div data-testid={connectionsNoConnections}>
      <p>These dapps have access to your public keys and permission to send transaction requests.</p>
    </div>
  )
}
