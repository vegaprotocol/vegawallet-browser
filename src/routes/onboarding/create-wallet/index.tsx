import { Button } from '@vegaprotocol/ui-toolkit'
import { Wallet } from '../../../components/icons/wallet'
import { useNavigate } from 'react-router'
import { FULL_ROUTES } from '../..'

export const CreateWallet = () => {
  const navigate = useNavigate()
  return (
    <div className="text-center flex flex-col justify-center h-full px-5">
      <div className="mx-auto pb-4 text-white">
        <Wallet size={48} squareFill="black" />
      </div>
      <h1 className="text-2xl text-white pb-6">Create a wallet</h1>
      <Button
        onClick={() => {
          navigate(FULL_ROUTES.saveMnemonic)
        }}
        className="mb-4"
        variant="primary"
      >
        Create a wallet
      </Button>
      <Button disabled={true}>Import - Coming Soon</Button>
    </div>
  )
}
