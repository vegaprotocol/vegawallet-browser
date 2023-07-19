import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { Page } from '../../../components/page'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Frame } from '../../../components/frame'
import { Tick } from '../../../components/icons/tick'
import config from '!/config'
import { useGlobalsStore } from '../../../stores/globals'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'

export const locators = {
  description: 'description',
  scopeContainer: 'scope-container',
  scope: 'scope',
  userDataPolicy: 'user-data-policy',
  reportBugsAndCrashes: 'report-bugs-and-crashes',
  noThanks: 'no-thanks'
}

export const Telemetry = () => {
  const { saveSettings, loading } = useGlobalsStore((state) => ({
    saveSettings: state.saveSettings,
    loading: state.settingsLoading
  }))
  const { request } = useJsonRpcClient()
  const { handleSubmit } = useForm()
  const navigate = useNavigate()
  const submit = async (value: boolean) => {
    await saveSettings(request, {
      telemetry: value
    })
    navigate(FULL_ROUTES.wallets)
  }

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
            autoFocus
            data-testid={locators.reportBugsAndCrashes}
            disabled={loading}
            fill={true}
            type="submit"
            variant="primary"
          >
            Opt into error reporting
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
