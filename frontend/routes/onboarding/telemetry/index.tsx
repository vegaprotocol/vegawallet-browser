import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { Page } from '../../../components/page'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Frame } from '../../../components/frame'
import { Tick } from '../../../components/icons/tick'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import config from '@config'

// TODO this should be dynamic based on the button pressed
const VALUE = true

export const Telemetry = () => {
  const { handleSubmit } = useForm<{}>()
  const { client } = useJsonRpcClient()
  const navigate = useNavigate()
  // TODO why are we using a dodgy form that does not conform to html?
  const submit = useCallback(async () => {
    navigate(FULL_ROUTES.wallets)
    await client.request(RpcMethods.UpdateSettings, {
      params: { telemetry: VALUE }
    })
  }, [client, navigate])

  return (
    <Page name="Help improve Vega Wallet">
      <>
        <p className="mb-6">Improve Vega Wallet by automatically reporting bugs and crashes.</p>
        <Frame>
          <ul className="list-none">
            <li className="flex">
              <div>
                <Tick className="w-3 mr-2 text-vega-green-550" />
              </div>
              <p className="text-white">Your identity and keys will remain anonymous</p>
            </li>
            <li className="flex">
              <div>
                <Tick className="w-3 mr-2 text-vega-green-550" />
              </div>
              <p className="text-white">You can change this anytime via settings</p>
            </li>
          </ul>
        </Frame>
        <ExternalLink className="text-white" href={config.userDataPolicy}>
          Read Vega Wallet's user data policy
        </ExternalLink>
        <form onSubmit={handleSubmit(submit)} className="mt-8">
          <Button fill={true} type="submit" variant="primary">
            Report Bugs & Crashes
          </Button>
          <Button fill={true} type="submit" className="mt-4">
            No thanks
          </Button>
        </form>
      </>
    </Page>
  )
}
