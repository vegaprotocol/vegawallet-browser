import { ExternalLink } from '@vegaprotocol/ui-toolkit'
import { Frame } from '../../../components/frame'
import config from '!/config'

export const locators = {
  walletsAssetHeader: 'wallets-asset-header',
  walletAssetDescription: 'wallets-asset-description',
  walletsDepositLink: 'wallets-deposit-link'
}

export const DepositAssetsCallout = () => {
  return (
    <section className="mt-10">
      <Frame>
        <h1 data-testid={locators.walletsAssetHeader} className="mb-3 text-vega-dark-300 uppercase text-sm">
          Connect to console to deposit funds
        </h1>
        <p className="mb-3" data-testid={locators.walletAssetDescription}>
          Choose a market on Vega Console, connect your wallet and follow the prompts to deposit the funds needed to
          trade
        </p>
        <ExternalLink
          data-testid={locators.walletsDepositLink}
          className="break-word text-white"
          href={config.network.console}
        >
          Vega Console dapp
        </ExternalLink>
      </Frame>
    </section>
  )
}
