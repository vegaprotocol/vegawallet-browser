import { NavLink } from 'react-router-dom'

import { SubHeader } from '@/components/sub-header'
import { VegaSection } from '@/components/vega-section'
import { formatDate } from '@/lib/utils'
import { FULL_ROUTES } from '@/routes/route-names'
import { Connection } from '@/types/backend'

import { locators } from '../details'

export const DetailsSection = ({ connection }: { connection: Connection }) => {
  return (
    <>
      <VegaSection>
        <SubHeader content="Origin" />
        <div className="text-white mt-1" data-testid={locators.origin}>
          {connection.origin}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Last accessed" />
        <div className="text-white mt-1" data-testid={locators.accessedAt}>
          {formatDate(connection.accessedAt)}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Chain Id" />
        <div className="text-white mt-1" data-testid={locators.chainId}>
          {connection.chainId}
        </div>
      </VegaSection>
      <VegaSection>
        <SubHeader content="Network Id" />
        <div className="mt-1">
          <NavLink
            data-testid={locators.networkId}
            className="text-white underline"
            to={`${FULL_ROUTES.networksSettings}/${connection.networkId}`}
          >
            {connection.networkId}
          </NavLink>
        </div>
      </VegaSection>
    </>
  )
}
