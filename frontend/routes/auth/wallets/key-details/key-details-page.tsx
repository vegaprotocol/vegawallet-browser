import { NavLink } from 'react-router-dom'
import { ArrowLeft } from '../../../../components/icons/arrow-left'
import { VegaKey } from '../../../../components/keys/vega-key'
import { useAssetsStore } from '../../../../stores/assets-store'
import { useWalletStore } from '../../../../stores/wallets'
import { FULL_ROUTES } from '../../../route-names'
import { KeySelector } from './key-selector'
import { ExportPrivateKeysDialog } from './export-private-key-dialog'
import { AssetsList } from './assets-list'
import { AuthPage } from '../../../../components/auth-page'

export const locators = {
  keyDetailsPage: 'key-details-page',
  keyDetailsDescription: 'key-details-description',
  keyDetailsBack: 'key-details-back',
  keyDetailsPage: 'key-details-page'
}

export const KeyDetailsPage = ({ id }: { id: string }) => {
  const { getKeyById } = useWalletStore((state) => ({
    getKeyById: state.getKeyById
  }))
  const key = getKeyById(id)
  const { loading } = useAssetsStore((state) => ({
    loading: state.loading
  }))
  const { loading: walletsLoading } = useWalletStore((state) => ({
    loading: state.loading
  }))
  if (loading || walletsLoading) return null
  if (!key) throw new Error(`Key with id ${id} not found`)

  return (
    <AuthPage
      dataTestId={locators.keyDetailsPage}
      title={
        <div className="mb-6 flex items-center text-white">
          <NavLink
            data-testid={locators.keyDetailsBack}
            to={{ pathname: FULL_ROUTES.wallets }}
            className="mr-4 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </NavLink>
          <KeySelector currentKey={key} />
        </div>
      }
    >
      <VegaKey publicKey={key.publicKey} />
      <AssetsList id={id} />
      <ExportPrivateKeysDialog publicKey={key.publicKey} />
    </AuthPage>
  )
}
