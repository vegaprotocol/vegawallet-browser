import { List } from '../../../components/list'
import { HostImage } from '../../../components/host-image'
import { Connection } from './store'
import { connectionsConnection } from '../../../locator-ids'

export const ConnectionsList = ({ connections }: { connections: Connection[] }) => {
  return (
    <>
      <p className="mb-6">Your wallet is connected to these dApps.</p>
      <List<Connection>
        idProp="origin"
        items={connections}
        renderItem={(i) => (
          <div className="flex justify-between">
            <div className="flex flex-col justify-center">
              <HostImage size={10} hostname={i.origin} />
            </div>
            <div
              data-testid={connectionsConnection}
              className="ml-4 flex-1 flex flex-col justify-center overflow-hidden break-all"
            >
              {i.origin}
            </div>
          </div>
        )}
      />
    </>
  )
}
