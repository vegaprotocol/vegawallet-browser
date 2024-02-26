import { Button } from '@vegaprotocol/ui-toolkit'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Checkbox } from '@/components/checkbox'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { useAsyncAction } from '@/hooks/async-action'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { FULL_ROUTES } from '@/routes/route-names'
import { useWalletStore } from '@/stores/wallets'

export const DeleteWalletWarning = ({ onClose }: { onClose: () => void }) => {
  const { control } = useForm<{
    accept: boolean
  }>()
  const accepted = useWatch({
    control,
    name: 'accept'
  })
  const { request } = useJsonRpcClient()
  const navigate = useNavigate()
  const { wallets } = useWalletStore((store) => ({
    wallets: store.wallets
  }))

  const [wallet] = wallets

  const deleteWallet = async () => {
    await request(RpcMethods.DeleteWallet, {
      name: wallet.name
    })
    navigate(FULL_ROUTES.createWallet)
  }

  const { loading, loaderFunction } = useAsyncAction(deleteWallet)

  return (
    <div>
      <form>
        <Checkbox
          name="accept"
          label="I have backed up my recovery phrase. I understand that I need the phrase to recover my wallet, and that if I delete it, my wallet may be lost."
          control={control}
        />
        <Button
          disabled={!accepted || loading}
          variant="secondary"
          className="mt-4"
          fill={true}
          onClick={() => loaderFunction()}
        >
          Continue
        </Button>
        <Button className="mt-4" fill={true} onClick={onClose}>
          Close
        </Button>
      </form>
    </div>
  )
}
