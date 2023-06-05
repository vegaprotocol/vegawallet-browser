import { List } from '../../../components/list'
import { HostImage } from '../../../components/host-image'
import { Connection } from './store'

export const ConnectionsList = ({ connections }: { connections: Connection[] }) => {
  return (
    <>
      <p className="mb-6">Your wallet is connected to these dApps.</p>
      <List<Connection>
        idProp="origin"
        items={connections}
        renderItem={(i) => (
          <div className="flex justify-between">
            <div className="flex">
              <div className="flex flex-col justify-center">
                <HostImage size={10} hostname={i.origin} />
              </div>
              <div className="ml-4 flex flex-col justify-center">{i.origin}</div>
            </div>
          </div>
        )}
      />
    </>
  )
}
