import config from '!/config'
import { ExternalLink, Tooltip, truncateMiddle } from '@vegaprotocol/ui-toolkit'

export const locators = {
  amount: 'amount',
  description1: 'description1',
  description2: 'description2',
  description3: 'description3',
  assetExplorerLink: 'asset-explorer-link',
  tooltipAssetExplorerLink: 'tooltip-asset-explorer-link',
  docsLink: 'docs-link',
  amountWithTooltip: 'amount-with-tooltip'
}

const AmountDescription = ({ assetId }: { assetId: string }) => {
  const assetHref = `${config.network.explorer}/assets/${assetId}`
  const docsHref = `${config.network.docs}/api/using-the-apis#decimal-precision`
  return (
    <div>
      <p data-testid={locators.description1}>This number does not include a decimal point.</p>

      <p data-testid={locators.description2} className="mt-1">
        To get the value including decimals, find the{' '}
        <ExternalLink data-testid={locators.tooltipAssetExplorerLink} href={assetHref}>
          asset on the block explorer
        </ExternalLink>{' '}
        and divide the amount by{' '}
        <code>
          10<sup>decimals</sup>
        </code>{' '}
        e.g. <code>1000</code> with a decimal value of <code>2</code> would become{' '}
        <code>
          1000 ÷ 10<sup>2</sup> = 10
        </code>
        .{' '}
      </p>
      <p data-testid={locators.description3} className="mt-1">
        <ExternalLink data-testid={locators.docsLink} href={docsHref}>
          Read more
        </ExternalLink>
      </p>
    </div>
  )
}

export const AmountWithTooltip = ({ assetId, amount }: { assetId: string; amount: string }) => {
  return (
    <span data-testid={locators.amountWithTooltip}>
      <Tooltip description={<AmountDescription assetId={assetId} />}>
        <span data-testid={locators.amount}>{amount}</span>
      </Tooltip>
      &nbsp;
      <ExternalLink
        data-testid={locators.assetExplorerLink}
        className="text-vega-dark-300"
        href={`${config.network.explorer}/assets/${assetId}`}
      >
        {truncateMiddle(assetId)}
      </ExternalLink>
    </span>
  )
}
