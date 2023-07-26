import { useWalletStore } from '../../../stores/wallets'
import { KeyList } from './keys-list'
import { DepositAssetsCallout } from './deposit-assets-callout'
import { SignMessageDialog } from '../../../components/sign-message-dialog'
import { useState } from 'react'

export const locators = {
  walletsPage: 'wallets-page',
  walletsWalletName: 'wallets-wallet-name'
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
    <section data-testid={locators.walletsPage}>
      <h1 data-testid={locators.walletsWalletName} className="flex justify-center flex-col text-2xl text-white">
        {wallet.name}
      </h1>
      <KeyList onIconClick={setSelectedPubkey} wallet={wallet} />
      <DepositAssetsCallout />
      <SignMessageDialog open={!!selectedPubkey} onClose={() => setSelectedPubkey(null)} publicKey={selectedPubkey} />
    </section>
  )
}
