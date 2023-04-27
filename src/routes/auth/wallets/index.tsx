import {
  ButtonLink,
  ExternalLink,
  truncateMiddle
} from '@vegaprotocol/ui-toolkit'
import { CopyWithCheckmark } from '../../../components/copy-with-check'
import { useEffect } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { Key, useWalletStore } from './store'
import { Frame } from '../../../components/frame'
import { VegaIcon } from '../../../components/icons/vega-icon'
import { List } from '../../../components/list'
import {
  networkIndicator,
  walletsAssetHeader,
  walletsCreateKey,
  walletsDepositLink,
  walletsError,
  walletsKeyName,
  walletsWalletName
} from '../../../locator-ids'

const KeyIcon = ({ publicKey }: { publicKey: string }) => {
  return (
    <div className="inline-grid grid-cols-3 gap-0 w-9 h-9 mr-4">
      {publicKey
        .match(/.{6}/g)
        ?.slice(0, 9)
        .map((c, i) => (
          <div
            key={i}
            className="w-3 h-3"
            style={{ backgroundColor: `#${c}` }}
          />
        ))}
    </div>
  )
}

export const Wallets = () => {
  const { client } = useJsonRpcClient()
  const { wallets, loadWallets, loading, error } = useWalletStore((store) => ({
    wallets: store.wallets,
    loadWallets: store.loadWallets,
    loading: store.loading,
    error: store.error
  }))
  useEffect(() => {
    loadWallets(client)
  }, [client, loadWallets])
  const [wallet] = wallets

  if (loading) return null
  // TODO make this better
  if (error) return <span data-testid={walletsError}>{error.toString()}</span>

  return (
    <section className="pt-3 px-5">
      <div className="flex justify-between items-center">
        <VegaIcon size={48} backgroundColor="none" />
        <div
          data-testid={networkIndicator}
          className="flex flex-col justify-center border rounded-md border-vega-dark-300 text-sm px-2 h-6"
        >
          {process.env['REACT_APP_ENV_NAME']}
        </div>
      </div>
      <h1
        data-testid={walletsWalletName}
        className="flex justify-center flex-col text-2xl mt-10 text-white"
      >
        {wallet.name}
      </h1>
      <h2 className="uppercase text-sm mt-6 mb-2 text-vega-dark-300">Keys</h2>
      <List<Key>
        idProp="publicKey"
        items={wallets[0].keys}
        renderItem={(k) => (
          <div className="flex items-center">
            <KeyIcon publicKey={k.publicKey} />
            <div>
              <div data-testid={walletsKeyName} className="text-lg text-white">
                {k.name}
              </div>
              <CopyWithCheckmark text={k.publicKey}>
                <span className="underline">{truncateMiddle(k.publicKey)}</span>
              </CopyWithCheckmark>
            </div>
          </div>
        )}
      />
      <div className="mt-3 text-white">
        <ButtonLink data-testid={walletsCreateKey}>
          Create new key/pair
        </ButtonLink>
      </div>
      <section className="mt-10">
        <h1
          data-testid={walletsAssetHeader}
          className="mb-3 text-vega-dark-300 uppercase text-sm"
        >
          Assets
        </h1>
        <Frame>
          Deposit and manage your assets directly in &nbsp;
          <ExternalLink
            data-testid={walletsDepositLink}
            className="break-word"
            href={process.env['REACT_APP_DEPOSIT_LINK']}
          >
            a Vega dapp.
          </ExternalLink>
        </Frame>
      </section>
    </section>
  )
}
