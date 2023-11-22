import { List } from '../../../components/list'
import { HostImage } from '../../../components/host-image'
import { Connection } from '../../../stores/connections'
import { Cross } from '../../../components/icons/cross'
import { getTimeFormat, getDateFormat } from '@vegaprotocol/utils'

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
        renderItem={(index) => (
          <div>
            <div className="flex justify-between">
              <div className="flex flex-col justify-center">
                <HostImage size={42} hostname={index.origin} />
              </div>
              <div
                data-testid={locators.connectionOrigin}
                className="ml-4 flex-1 flex flex-col justify-center overflow-hidden break-all"
              >
                {index.origin}
              </div>
              <button data-testid={locators.connectionRemoveConnection} onClick={() => removeConnection(index)}>
                <Cross className="w-4 h-4" />
              </button>
            </div>
            <div data-testid={locators.connectionLastConnected} className="text-vega-dark-400">
              Last connected: {getDateFormat().format(index.accessedAt)} · {getTimeFormat().format(index.accessedAt)}
            </div>
          </div>
        )}
      />
    </>
  )
}
