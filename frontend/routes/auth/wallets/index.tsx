import { ButtonLink, ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { CopyWithCheckmark } from '../../../components/copy-with-check'
import { useCallback, useState } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { Frame } from '../../../components/frame'
import { List } from '../../../components/list'
import { KeyIcon } from '../../../components/key-icon'
import { useWalletStore, Key } from '../../../stores/wallets'
import config from '@/config'

export const locators = {
  walletsAssetHeader: 'wallets-asset-header',
  walletsCreateKey: 'wallets-create-key',
  walletsDepositLink: 'wallets-deposit-link',
  walletsKeyName: 'wallets-key-name',
  walletsPage: 'wallets-page',
  walletsWalletName: 'wallets-wallet-name',
  walletsExplorerLink: 'wallets-explorer-link'
}

export const Wallets = () => {
  const { request } = useJsonRpcClient()
  // Wallet loading is handled in auth, when the user is redirected to the auth page
  const { wallets, loading, createNewKey } = useWalletStore((store) => ({
    wallets: store.wallets,
    loading: store.loading,
    createNewKey: store.createKey
  }))
  const [creatingKey, setCreatingKey] = useState(false)
  const createKey = useCallback(async () => {
    setCreatingKey(true)
    await createNewKey(request, wallets[0].name)
    setCreatingKey(false)
  }, [request, createNewKey, wallets])
  const [wallet] = wallets

  if (loading) return null

  return (
    <section data-testid={locators.walletsPage}>
      <h1 data-testid={locators.walletsWalletName} className="flex justify-center flex-col text-2xl text-white">
        {wallet.name}
      </h1>
      <h2 className="uppercase text-sm mt-6 mb-2 text-vega-dark-300">Keys</h2>
      <List<Key>
        idProp="publicKey"
        items={wallets[0].keys}
        renderItem={(k) => (
          <div className="flex items-center">
            <KeyIcon publicKey={k.publicKey} />
            <div className="ml-4">
              <div data-testid={locators.walletsKeyName} className="text-lg text-white">
                {k.name}
              </div>
              <ExternalLink
                data-testid={locators.walletsExplorerLink}
                href={`${config.network.explorer}/parties/${k.publicKey}`}
              >
                {truncateMiddle(k.publicKey)}
              </ExternalLink>
              <CopyWithCheckmark text={k.publicKey} />
            </div>
          </div>
        )}
      />
      <div className="mt-3 text-white">
        <ButtonLink disabled={creatingKey} onClick={createKey} data-testid={locators.walletsCreateKey}>
          Create new key/pair
        </ButtonLink>
      </div>
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
    </section>
  )
}
