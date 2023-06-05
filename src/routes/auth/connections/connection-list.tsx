// import { Cross } from '../../../components/icons/cross'
import { List } from '../../../components/list'
import { HostImage } from '../../../components/host-image'
import { Connection } from './store'

export const ConnectionsList = ({
  connections,
  removeConnection
}: {
  connections: Connection[]
  removeConnection: (connection: Connection) => void
}) => {
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
            {/* <button onClick={() => removeConnection(i)}>
              <Cross className="w-8 h-8" />
            </button> */}
          </div>
        )}
      />
    </>
  )
}
