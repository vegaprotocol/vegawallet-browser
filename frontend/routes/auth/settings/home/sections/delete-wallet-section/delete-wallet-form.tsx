import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { Validation } from '@/lib/form-validation'
import { FULL_ROUTES } from '@/routes/route-names'
import { useWalletStore } from '@/stores/wallets'

import { FormFields, locators } from './delete-wallet'

export const DeleteWalletForm = () => {
  const { request } = useJsonRpcClient()
  const navigate = useNavigate()
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<FormFields>()
  const { wallets } = useWalletStore((store) => ({
    wallets: store.wallets
  }))

  const [wallet] = wallets

  const deleteWallet = async () => {
    await request(RpcMethods.DeleteWallet, {
      name: wallet.name
    })
    navigate(FULL_ROUTES.home)
  }

  return (
    <form onSubmit={handleSubmit(deleteWallet)}>
      <FormGroup label="Wallet name" labelFor="walletName">
        <Input
          autoFocus
          hasError={!!errors.walletName?.message}
          data-testid={locators.deleteWalletName}
          type="text"
          {...register('walletName', {
            required: Validation.REQUIRED
          })}
        />
        {errors.walletName?.message && <InputError forInput="walletName">{errors.walletName.message}</InputError>}
      </FormGroup>
      <Button className="mt-2" data-testid={locators.deleteWalletButton} fill={true} variant="secondary" type="submit">
        Delete wallet
      </Button>
    </form>
  )
}
