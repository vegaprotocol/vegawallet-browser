import { ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import config from '!/config'

export const MarketLink = ({ marketId, name }: { marketId: string; name?: string }) => (
  <ExternalLink href={`${config.network.explorer}/markets/${marketId}`}>
    {name ?? truncateMiddle(marketId)}
  </ExternalLink>
)
