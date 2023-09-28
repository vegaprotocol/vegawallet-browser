import { ButtonLink } from '@vegaprotocol/ui-toolkit'
import { List } from '../../../../components/list'
import { Key, Wallet, useWalletStore } from '../../../../stores/wallets'
import { MessageIcon } from '../../../../components/icons/message'
import { useState } from 'react'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { VegaKey } from '../../../../components/keys/vega-key'
import { NavLink } from 'react-router-dom'
import { FULL_ROUTES } from '../../../route-names'

export const locators = {
  walletsCreateKey: 'wallets-create-key',
  walletsSignMessageButton: 'sign-message-button',
  viewDetails: function (keyName: string) {
    return `${keyName}-view-details`
  }
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
          // TODO this is a massive hack for the tests. Bigger issues that need to be solved from a UX perspective here.
          <VegaKey
            publicKey={k.publicKey}
            name={k.name}
            actions={
              <button
                data-testid={locators.walletsSignMessageButton}
                onClick={() => onIconClick(k.publicKey)}
                className="cursor-pointer mt-2 ml-1"
              >
                <MessageIcon />
              </button>
            }
          >
            <NavLink
              to={{ pathname: `${FULL_ROUTES.wallets}/${k.publicKey}` }}
              data-testid={locators.viewDetails(k.name)}
              className="hover:bg-vega-dark-200 w-12 h-full border-l border-1 border-vega-dark-150 flex items-center justify-center"
            >
              <svg width={24} height={24} viewBox="0 0 16 16">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.75 14.38L4 13.62L9.63 8.00001L4 2.38001L4.75 1.62001L11.13 8.00001L4.75 14.38Z"
                    fill="currentColor"
                  />
                </svg>
              </svg>
            </NavLink>
          </VegaKey>
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
