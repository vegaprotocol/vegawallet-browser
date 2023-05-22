import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import packageJson from '../../../../package.json'
import {
  settingsFeedbackDescription,
  settingsFeedbackLink,
  settingsLockButton,
  settingsPage,
  settingsVersionNumber,
  settingsVersionTitle
} from '../../../locator-ids'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../../routes/route-names'

export const Settings = () => {
  const { client } = useJsonRpcClient()
  const { handleSubmit } = useForm()
  const navigate = useNavigate()
  const submit = useCallback(async () => {
    await client.request('admin.lock', null)
    navigate(FULL_ROUTES.login)
  }, [client, navigate])
  return (
    <section data-testid={settingsPage}>
      <h1 className="flex justify-center flex-col text-2xl text-white">Settings</h1>
      <div className="mt-6">
        <div className="text-dark-300 text-sm uppercase" data-testid={settingsVersionTitle}>
          Vega wallet version
        </div>
        <div className="text-white text-lg mt-1" data-testid={settingsVersionNumber}>
          {packageJson.version}
        </div>
      </div>
      <form className="mt-6" onSubmit={handleSubmit(submit)}>
        <Button data-testid={settingsLockButton} fill={true} className="mt-2" variant="secondary" type="submit">
          Lock
        </Button>
      </form>
      <div className="mt-8">
        <div data-testid={settingsFeedbackDescription}>Spotted any issues or bugs?</div>
        <ExternalLink
          data-testid={settingsFeedbackLink}
          className="text-white mt-1 underline"
          href={process.env['REACT_APP_FEEDBACK_LINK']}
        >
          Provide feedback
        </ExternalLink>
      </div>
    </section>
  )
}
