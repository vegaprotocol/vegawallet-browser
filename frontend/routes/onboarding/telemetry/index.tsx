import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { Page } from '../../../components/page'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Frame } from '../../../components/frame'
import { Tick } from '../../../components/icons/tick'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import config from '@/config'
import { useGlobalsStore } from '../../../stores/globals'

export const locators = {
  description: 'description',
  scopeContainer: 'scope-container',
  scope: 'scope',
  userDataPolicy: 'user-data-policy',
  reportBugsAndCrashes: 'report-bugs-and-crashes',
  noThanks: 'no-thanks'
}

export const Telemetry = () => {
  const [loading, setLoading] = useState(false)
  const { handleSubmit } = useForm<{}>()
  const { request } = useJsonRpcClient()
  const navigate = useNavigate()
  const { loadGlobals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals
  }))
  const submit = useCallback(
    async (value: boolean) => {
      setLoading(true)
      try {
        await request(RpcMethods.UpdateSettings, {
          telemetry: value
        })
        await loadGlobals(request)
      } finally {
        setLoading(false)
      }
      navigate(FULL_ROUTES.wallets)
    },
    [request, loadGlobals, navigate]
  )

  return (
    <Page name="Help improve Vega Wallet">
      <>
        <p className="mb-6" data-testid={locators.description}>
          Improve Vega Wallet by automatically reporting bugs and crashes.
        </p>
        <Frame>
          <ul className="list-none" data-testid={locators.scopeContainer}>
            <li className="flex">
              <div>
                <Tick className="w-3 mr-2 text-vega-green-550" />
              </div>
              <p data-testid={locators.scope} className="text-white">
                Your identity and keys will remain anonymous
              </p>
            </li>
            <li className="flex">
              <div>
                <Tick className="w-3 mr-2 text-vega-green-550" />
              </div>
              <p data-testid={locators.scope} className="text-white">
                You can change this anytime via settings
              </p>
            </li>
          </ul>
        </Frame>
        <ExternalLink data-testid={locators.userDataPolicy} className="text-white" href={config.userDataPolicy}>
          Read Vega Wallet's user data policy
        </ExternalLink>
        <form onSubmit={handleSubmit(() => submit(true))} className="mt-8">
          <Button
            data-testid={locators.reportBugsAndCrashes}
            disabled={loading}
            fill={true}
            type="submit"
            variant="primary"
          >
            Report Bugs & Crashes
          </Button>
        </form>
        <form onSubmit={handleSubmit(() => submit(false))} className="mt-4">
          <Button data-testid={locators.noThanks} disabled={loading} fill={true} type="submit">
            No thanks
          </Button>
        </form>
      </>
    </Page>
  )
}
