import { useParams } from 'react-router-dom'

import { CollapsiblePanel } from '@/components/collapsible-panel'
import { DataTable } from '@/components/data-table'
import { ExternalLink } from '@/components/external-link/external-link'
import { BasePage } from '@/components/pages/page'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { FULL_ROUTES } from '@/routes/route-names'
import { useNetworksStore } from '@/stores/networks-store'

export const locators = {
  networkDetails: 'network-details',
  networkId: 'network-id',
  chainId: 'chain-id',
  ethereumExplorer: 'ethereum-explorer',
  networkDetailsNode: 'network-details-node'
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
        <SubHeader content="Chain id" />
        <div className="text-white mt-1" data-testid={locators.chainId}>
          {network.chainId}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Vega URLs" />
        <DataTable
          items={[
            ['Console', <ExternalLink className="text-white mt-1" href={network.console} />],
            ['Governance', <ExternalLink className="text-white mt-1" href={network.governance} />],
            ['Explorer', <ExternalLink className="text-white mt-1" href={network.explorer} />],
            ['Docs', <ExternalLink className="text-white mt-1" href={network.docs} />]
          ]}
        />
      </VegaSection>
      <VegaSection>
        <SubHeader content="Ethereum Explorer" />
        <ExternalLink
          data-testid={locators.ethereumExplorer}
          className="text-white mt-1"
          href={network.ethereumExplorerLink}
        />
      </VegaSection>
      <VegaSection>
        <CollapsiblePanel
          initiallyOpen
          title="Nodes"
          panelContent={
            <ul>
              {network.rest.map((r) => (
                <ExternalLink data-testid={locators.networkDetailsNode} key={r} className="text-white" href={r} />
              ))}
            </ul>
          }
        />
      </VegaSection>
    </BasePage>
  )
}
