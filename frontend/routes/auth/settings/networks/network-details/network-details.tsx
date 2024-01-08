import { useParams } from 'react-router-dom'

import { CollapsiblePanel } from '@/components/collapsible-panel'
import { BasePage } from '@/components/pages/page'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { FULL_ROUTES } from '@/routes/route-names'
import { useNetworksStore } from '@/stores/networks-store'

export const locators = {
  networkDetails: 'network-details',
  networkId: 'network-id'
}

export const NetworkDetails = () => {
  const { id } = useParams<{ id: string }>()
  const { getNetworkById } = useNetworksStore((state) => ({
    getNetworkById: state.getNetworkById
  }))
  if (!id) throw new Error('Id param not provided to network details')
  const network = getNetworkById(id)
  if (!network) throw new Error(`Could not find network with id ${id}`)
  return (
    <BasePage backLocation={FULL_ROUTES.networksSettings} dataTestId={locators.networkDetails} title={network.name}>
      <VegaSection>
        <SubHeader content="Id" />
        <div className="text-white mt-1" data-testid={locators.networkId}>
          {network.id}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Explorer" />
        <div className="text-white mt-1">{network.explorer}</div>
      </VegaSection>
      <VegaSection>
        <CollapsiblePanel
          initiallyOpen
          title="Nodes"
          panelContent={
            <ul>
              {network.rest.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          }
        />
      </VegaSection>
    </BasePage>
  )
}
