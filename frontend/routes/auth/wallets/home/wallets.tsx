import { useWalletStore } from '../../../../stores/wallets'
import { WalletsPageKeyList } from './wallets-page-key-list'
import { DepositAssetsCallout } from './deposit-assets-callout'
import { SignMessageDialog } from '../../../../components/sign-message-dialog'
import { useState } from 'react'
import { BasePage } from '../../../../components/pages/page'

export const locators = {
  walletsPage: 'wallets-page'
}

export const Wallets = () => {
  // Wallet loading is handled in auth, when the user is redirected to the auth page
  const { wallets, loading } = useWalletStore((store) => ({
    wallets: store.wallets,
    loading: store.loading
  }))
  const [selectedPubkey, setSelectedPubkey] = useState<string | null>(null)
  const [wallet] = wallets

  if (loading) return null

  return (
    <BasePage dataTestId={locators.walletsPage} title={wallet.name}>
      <WalletsPageKeyList onSignMessage={setSelectedPubkey} wallet={wallet} />
      <DepositAssetsCallout />
      <SignMessageDialog open={!!selectedPubkey} onClose={() => setSelectedPubkey(null)} publicKey={selectedPubkey} />
    </BasePage>
  )
}
