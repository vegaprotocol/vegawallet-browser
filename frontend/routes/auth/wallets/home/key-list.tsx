import { ButtonLink } from '@vegaprotocol/ui-toolkit'
import { List } from '../../../../components/list'
import { Key, Wallet, useWalletStore } from '../../../../stores/wallets'
import { MessageIcon } from '../../../../components/icons/message'
import { useState } from 'react'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { VegaKey } from '../../../../components/keys/vega-key'
import { NavLink, useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../../route-names'

export const locators = {
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
  const navigate = useNavigate()

  return (
    <section>
      <h1 className="uppercase text-sm mt-6 mb-2 text-vega-dark-300">Keys</h1>
      <List<Key>
        idProp="publicKey"
        items={wallet.keys}
        clickable={true}
        renderItem={(k) => (
          <button className="w-full" onClick={() => navigate({ pathname: `${FULL_ROUTES.wallets}/${k.publicKey}` })}>
            <VegaKey publicKey={k.publicKey} name={k.name}>
              &nbsp;
              <button
                data-testid={locators.walletsSignMessageButton}
                onClick={() => onIconClick(k.publicKey)}
                className="cursor-pointer mt-2"
              >
                <MessageIcon />
              </button>
            </VegaKey>
          </button>
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
