import { ExternalLink } from '@vegaprotocol/ui-toolkit'
import { Frame } from '../../../components/frame'
import config from '!/config'

export const locators = {
  walletsAssetHeader: 'wallets-asset-header',
  walletsDepositLink: 'wallets-deposit-link'
}

export const DepositAssetsCallout = () => {
  return (
    <section className="mt-10">
      <h1 data-testid={locators.walletsAssetHeader} className="mb-3 text-vega-dark-300 uppercase text-sm">
        Assets
      </h1>
      <Frame>
        Deposit and manage your assets directly in the&nbsp;
        <ExternalLink
          data-testid={locators.walletsDepositLink}
          className="break-word text-white"
          href={config.network.console}
        >
          Vega Console dapp.
        </ExternalLink>
      </Frame>
    </section>
  )
}
