import { NavLink } from 'react-router-dom'

import { HostImage } from '@/components/host-image'
import { Cross } from '@/components/icons/cross'
import { List } from '@/components/list'
import { FULL_ROUTES } from '@/routes/route-names'
import { Connection } from '@/types/backend'

export const locators = {
  connectionDetails: 'connection-details',
  connectionOrigin: 'connections-connection',
  connectionRemoveConnection: 'connections-remove-connection',
  connectionLastConnected: 'connections-last-connected'
}

export const ConnectionsList = ({
  connections,
  removeConnection
}: {
  connections: Connection[]
  removeConnection: (connection: Connection) => void
}) => {
  return (
    <>
      <p className="mb-6" data-testid={locators.connectionDetails}>
        These dapps have access to your public keys and permission to send transaction requests.
      </p>
      <List<Connection>
        idProp="origin"
        items={connections}
        renderItem={(connection) => (
          <div>
            <div className="flex justify-between">
              <div className="flex flex-col justify-center">
                <HostImage size={42} hostname={connection.origin} />
              </div>
              <div
                data-testid={locators.connectionOrigin}
                className="ml-4 flex-1 flex flex-col justify-center overflow-hidden break-all"
              >
                {connection.origin}
              </div>
              <button data-testid={locators.connectionRemoveConnection} onClick={() => removeConnection(connection)}>
                <Cross className="w-4 h-4" />
              </button>
              <NavLink to={`${FULL_ROUTES.connections}/${connection.id}`}>Click</NavLink>
            </div>
          </div>
        )}
      />
    </>
  )
}
