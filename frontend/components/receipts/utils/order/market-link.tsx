import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import config from '!/config'

export const locators = {
  marketLink: 'market-link'
}

export const MarketLink = ({ marketId, name }: { marketId: string; name?: string }) => (
  <ExternalLink data-testid={locators.marketLink} href={`${config.network.explorer}/markets/${marketId}`}>
    {name ?? truncateMiddle(marketId)}
  </ExternalLink>
)
