import { Network } from '@/types/backend'

import { ChevronRight } from '../icons/chevron-right'
import { List } from '../list'
import { SubHeader } from '../sub-header'

export interface NetworkListProperties {
  networks: Network[]
  onClick?: (network: Network) => void
}

export const NetworksList = ({ networks, onClick }: NetworkListProperties) => {
  return (
    <section className="text-base mt-6">
      <SubHeader content="Networks" />
      <List<Network>
        className="mt-2"
        idProp="name"
        items={networks}
        renderItem={(n) => (
          <div className="flex justify-between h-12">
            <div className="flex items-center">{n.name}</div>
            <button
              onClick={() => onClick?.(n)}
              className="hover:bg-vega-dark-200 w-12 h-full border-l border-1 border-vega-dark-150 flex items-center justify-center"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      />
    </section>
  )
}
