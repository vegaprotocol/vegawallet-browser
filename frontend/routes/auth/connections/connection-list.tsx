import { List } from '../../../components/list'
import { HostImage } from '../../../components/host-image'
import { connectionsConnection } from '../../../locator-ids'
import { Connection } from '../../../stores/connections'
import { Cross } from '../../../components/icons/cross'

export const locators = {
  connectionDetails: 'connection-details',
  connectionOrigin: connectionsConnection
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
        renderItem={(i) => (
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <HostImage size={42} hostname={i.origin} />
            </div>
            <div
              data-testid={connectionsConnection}
              className="ml-4 flex-1 flex flex-col justify-center overflow-hidden break-all"
            >
              {i.origin}
            </div>
            <button onClick={() => removeConnection(i)}>
              <Cross className="w-8 h-8" />
            </button>
          </div>
        )}
      />
    </>
  )
}
