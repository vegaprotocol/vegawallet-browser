import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import packageJson from '../../../../package.json'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../../routes/route-names'
import config from '../../../lib/config'
import { RpcMethods } from '../../../lib/client-rpc-methods'

export const locators = {
  settingsLockButton: 'settings-lock-button',
  settingsPage: 'settings-page',
  settingsVersionTitle: 'settings-version-title',
  settingsVersionNumber: 'settings-version-number',
  settingsFeedbackDescription: 'settings-feedback-description',
  settingsFeedbackLink: 'settings-feedback-link',
  settingsOpenPopoutButton: 'settings-open-popout-button'
}

export const Settings = () => {
  const { client } = useJsonRpcClient()
  const navigate = useNavigate()
  const { handleSubmit: handleLock } = useForm()
  const lock = useCallback(async () => {
    await client.request('admin.lock', null)
    navigate(FULL_ROUTES.login)
  }, [client, navigate])

  const { handleSubmit: handlePopout } = useForm()
  const popout = useCallback(async () => {
    await client.request(RpcMethods.OpenPopout, null)
    if (config.closeWindowOnPopupOpen) {
      window.close()
    }
  }, [client])
  return (
    <section data-testid={locators.settingsPage}>
      <h1 className="flex justify-center flex-col text-2xl text-white">Settings</h1>
      <div className="pt-6 border-b border-1 border-vega-dark-150 pb-6">
        <div className="text-dark-300 text-sm uppercase" data-testid={locators.settingsVersionTitle}>
          Vega wallet version
        </div>
        <div className="text-white text-lg mt-1" data-testid={locators.settingsVersionNumber}>
          {packageJson.version}
        </div>
      </div>
      <form className="pt-6" onSubmit={handleLock(lock)}>
        <Button data-testid={locators.settingsLockButton} fill={true} variant="secondary" type="submit">
          Lock
        </Button>
      </form>

      <div className="pt-6 border-b border-1 border-vega-dark-150 pb-6">
        <div data-testid={locators.settingsFeedbackDescription}>Spotted any issues or bugs?</div>
        <ExternalLink
          data-testid={locators.settingsFeedbackLink}
          className="text-white mt-1 underline"
          href={config.feedbackLink}
        >
          Provide feedback
        </ExternalLink>
      </div>
      <ExternalLink
        onClick={handlePopout(popout)}
        data-testid={locators.settingsOpenPopoutButton}
        className="text-white mt-6"
        type="submit"
      >
        Open wallet in a new window
      </ExternalLink>
    </section>
  )
}
