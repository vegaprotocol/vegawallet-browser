import { VegaKey } from '../../../../components/keys/vega-key'
import { useAssetsStore } from '../../../../stores/assets-store'
import { useWalletStore } from '../../../../stores/wallets'
import { FULL_ROUTES } from '../../../route-names'
import { KeySelector } from './key-selector'
import { ExportPrivateKeysDialog } from './export-private-key-dialog'
import { AssetsList } from './assets-list'
import { RenameKeyDialog } from './rename-key-dialog'
import { BasePage } from '../../../../components/pages/page'
import { AsyncRenderer } from '../../../../components/async-renderer/async-renderer'
import { useMarketsStore } from '../../../../stores/markets-store'

export const locators = {
  keyDetailsPage: 'key-details-page',
  keyDetailsDescription: 'key-details-description',
  keyDetailsBack: 'key-details-back'
}

export const KeyDetailsPage = ({ id }: { id: string }) => {
  const { getKeyById } = useWalletStore((state) => ({
    getKeyById: state.getKeyById
  }))
  const key = getKeyById(id)
  const { loading: assetsLoading } = useAssetsStore((state) => ({
    loading: state.loading
  }))
  const { loading: marketsLoading } = useMarketsStore((state) => ({
    loading: state.loading
  }))
  const { loading: walletsLoading } = useWalletStore((state) => ({
    loading: state.loading
  }))
  if (!key) {
    if (!walletsLoading) {
      throw new Error(`Key with id ${id} not found`)
    }
    return null
  }

  return (
    <AsyncRenderer
      loading={assetsLoading || walletsLoading || marketsLoading}
      render={() => (
        <BasePage
          dataTestId={locators.keyDetailsPage}
          backLocation={FULL_ROUTES.wallets}
          title={<KeySelector currentKey={key} />}
        >
          <div className="mt-6">
            <VegaKey publicKey={key.publicKey} />
            <AssetsList publicKey={id} />
            <ExportPrivateKeysDialog publicKey={key.publicKey} />
          </div>
        </BasePage>
      )}
    />
  )
}
