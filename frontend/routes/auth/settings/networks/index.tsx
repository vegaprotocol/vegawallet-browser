import { NetworksList } from '@/components/networks-list'
import { BasePage } from '@/components/pages/page'
import { VegaSection } from '@/components/vega-section'
import { FULL_ROUTES } from '@/routes/route-names'
import { useNetworksStore } from '@/stores/networks-store'

export const locators = {
  networkSettingsPage: 'network-settings-page'
}

export const NetworkSettings = () => {
  const { networks } = useNetworksStore((state) => ({
    networks: state.networks
  }))
  return (
    <BasePage dataTestId={locators.networkSettingsPage} title="Network settings" backLocation={FULL_ROUTES.settings}>
      <VegaSection>
        <NetworksList networks={networks} />
      </VegaSection>
    </BasePage>
  )
}
