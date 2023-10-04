import { useWalletStore } from '../../../../stores/wallets'
import { WalletsPageKeyList } from './wallets-page-key-list'
import { DepositAssetsCallout } from './deposit-assets-callout'
import { SignMessageDialog } from '../../../../components/sign-message-dialog'
import { useState } from 'react'
import { AuthPage } from '../../../../components/auth-page'

export const locators = {
  walletsPage: 'wallets-page'
}

const WalletsLoading = () => {
  return (
    <section>
      {/* Auth page loader */}
      <Bone width={12} height={4} baseSize={8} />
      {/* Key list loader */}
      <div className="mt-6">
        <SubHeader content="Keys" />
        <List<{ id: number }>
          className="mt-2"
          idProp="id"
          items={[{ id: 1 }, { id: 2 }]}
          renderItem={(k) => (
            // Vega key loader
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center">
                <div className="rounded-md overflow-hidden">
                  <Bone width={6} height={6} baseSize={7} />
                </div>
                <div className="ml-4 flex flex-col justify-between h-12">
                  <div>
                    <Bone width={12} height={4} baseSize={4} />
                  </div>
                  <div>
                    <Bone width={30} height={4} baseSize={4} />
                  </div>
                </div>
              </div>

              <div className="w-12 h-full border-l border-1 border-vega-dark-150 flex items-center justify-center">
                <svg width={24} height={24} viewBox="0 0 16 16">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M4.75 14.38L4 13.62L9.63 8.00001L4 2.38001L4.75 1.62001L11.13 8.00001L4.75 14.38Z"
                      fill="currentColor"
                    />
                  </svg>
                </svg>
              </div>
            </div>
          )}
        />
      </div>
      <div className="mt-3 text-white">
        <ButtonLink disabled={true}>Create new key/pair</ButtonLink>
      </div>
      <DepositAssetsCallout />
    </section>
  )
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
    <AuthPage dataTestId={locators.walletsPage} title={wallet.name}>
      <WalletsPageKeyList onSignMessage={setSelectedPubkey} wallet={wallet} />
      <DepositAssetsCallout />
      <SignMessageDialog open={!!selectedPubkey} onClose={() => setSelectedPubkey(null)} publicKey={selectedPubkey} />
    </AuthPage>
  )
}
