import { ButtonLink } from '@vegaprotocol/ui-toolkit'
import { Wallet, useWalletStore } from '../../../../stores/wallets'
import { MessageIcon } from '../../../../components/icons/message'
import { useState } from 'react'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { KeyList } from '../../../../components/key-list'

export const locators = {
  walletsCreateKey: 'wallets-create-key',
  walletsSignMessageButton: 'sign-message-button'
}

export interface WalletPageKeyListProps {
  wallet: Wallet
  onSignMessage: (key: string) => void
}

export const WalletsPageKeyList = ({ wallet, onSignMessage }: WalletPageKeyListProps) => {
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
    <>
      <KeyList
        keys={wallet.keys}
        renderActions={(k) => (
          <button
            data-testid={locators.walletsSignMessageButton}
            onClick={() => onSignMessage(k.publicKey)}
            className="cursor-pointer mt-2 ml-1"
          >
            <MessageIcon />
          </button>
        )}
      />
      <div className="mt-3 text-white">
        <ButtonLink disabled={creatingKey} onClick={createKey} data-testid={locators.walletsCreateKey}>
          Create new key/pair
        </ButtonLink>
      </div>
    </>
  )
}
