import { getDateFormat, getTimeFormat } from '@vegaprotocol/utils'

import { BasePage } from '@/components/pages/page'
import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { FULL_ROUTES } from '@/routes/route-names'

export const locators = {
  connectionDetails: 'connection-details'
}

export const ConnectionDetails = () => {
  const connection = {
    origin: 'foo.com',
    accessedAt: 0,
    network: 'some-network'
  }
  return (
    <BasePage
      backLocation={FULL_ROUTES.networksSettings}
      dataTestId={locators.connectionDetails}
      title={connection.origin}
    >
      <VegaSection>
        <SubHeader content="Last connected" />
        <div className="text-white mt-1">
          Last connected: {getDateFormat().format(connection.accessedAt)} ·{' '}
          {getTimeFormat().format(connection.accessedAt)}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Network" />
        {/* TODO this should be a link to the network details page */}
        <div className="text-white mt-1">{connection.network}</div>
      </VegaSection>
    </BasePage>
  )
}
