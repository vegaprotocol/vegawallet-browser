import { ButtonLink, ExternalLink, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { CopyWithCheckmark } from '../../../components/copy-with-check'
import { List } from '../../../components/list'
import { KeyIcon } from '../../../components/key-icon'
import { Key, Wallet, useWalletStore } from '../../../stores/wallets'
import config from '!/config'
import { MessageIcon } from '../../../components/icons/message'
import { useState } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'

export const locators = {
  walletsKeyName: 'wallets-key-name',
  walletsExplorerLink: 'wallets-explorer-link',
  walletsCreateKey: 'wallets-create-key',
  walletsSignMessageButton: 'sign-message-button'
}

export interface KeyListProps {
  wallet: Wallet
  onIconClick: (key: string) => void
}

export const KeyList = ({ wallet, onIconClick }: KeyListProps) => {
  const { request } = useJsonRpcClient()
  // Wallet loading is handled in auth, when the user is redirected to the auth page
  const { createNewKey } = useWalletStore((store) => ({
    createNewKey: store.createKey
  }))
  const [creatingKey, setCreatingKey] = useState(false)
  const createKey = async () => {
    setCreatingKey(true)
    await createNewKey(request, wallet.name)
    setCreatingKey(false)
  }
  return (
    <section>
      <h1 className="uppercase text-sm mt-6 mb-2 text-vega-dark-300">Keys</h1>
      <List<Key>
        idProp="publicKey"
        items={wallet.keys}
        renderItem={(k) => (
          <div className="flex items-center">
            <KeyIcon publicKey={k.publicKey} />
            <div className="ml-4">
              <div data-testid={locators.walletsKeyName} className="text-lg text-white">
                {k.name}
              </div>
              <div className="flex items-center">
                <ExternalLink
                  data-testid={locators.walletsExplorerLink}
                  href={`${config.network.explorer}/parties/${k.publicKey}`}
                >
                  {truncateMiddle(k.publicKey)}
                </ExternalLink>
                <CopyWithCheckmark text={k.publicKey} />
                &nbsp;
                <button
                  data-testid={locators.walletsSignMessageButton}
                  onClick={() => onIconClick(k.publicKey)}
                  className="cursor-pointer"
                >
                  <MessageIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      />
      <div className="mt-3 text-white">
        <ButtonLink disabled={creatingKey} onClick={createKey} data-testid={locators.walletsCreateKey}>
          Create new key/pair
        </ButtonLink>
      </div>
    </section>
  )
}
