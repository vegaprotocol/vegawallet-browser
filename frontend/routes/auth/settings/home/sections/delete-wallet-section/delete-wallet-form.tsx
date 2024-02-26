import { Button } from '@vegaprotocol/ui-toolkit'
import { useNavigate } from 'react-router-dom'

import { PasswordForm } from '@/components/password-form'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { FULL_ROUTES } from '@/routes/route-names'
import { useWalletStore } from '@/stores/wallets'

export const locators = {
  deleteWalletFormModalClose: 'delete-wallet-form-modal-close'
}

export const DeleteWalletForm = () => {
  const { request } = useJsonRpcClient()
  const navigate = useNavigate()
  const { wallets } = useWalletStore((store) => ({
    wallets: store.wallets
  }))

  const [wallet] = wallets

  const deleteWallet = async (passphrase: string) => {
    await request(RpcMethods.DeleteWallet, {
      name: wallet.name,
      passphrase
    })
    navigate(FULL_ROUTES.createWallet)
  }

  return (
    <>
      <PasswordForm onSubmit={deleteWallet} text={'Delete wallet'} loadingText={'Deleting wallet'} />
      <Button
        data-testid={locators.deleteWalletFormModalClose}
        fill={true}
        // TODO
        onClick={() => console.log('FILL ME IN ')}
        className="mt-2"
        variant="default"
        type="submit"
      >
        Close
      </Button>
    </>
  )
}
