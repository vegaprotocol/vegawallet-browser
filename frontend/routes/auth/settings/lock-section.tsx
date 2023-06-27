import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../../routes/route-names'
import config from '../../../lib/config'
import { SettingsSection } from './settings-section'
import { RpcMethods } from '../../../lib/client-rpc-methods'

export const locators = {
  settingsLockButton: 'settings-lock-button',
  settingsFeedbackDescription: 'settings-feedback-description',
  settingsFeedbackLink: 'settings-feedback-link'
}

export const LockSection = () => {
  const { client } = useJsonRpcClient()
  const navigate = useNavigate()
  const { handleSubmit: handleLock } = useForm()
  const lock = useCallback(async () => {
    await client.request(RpcMethods.Lock, null)
    navigate(FULL_ROUTES.login)
  }, [client, navigate])
  return (
    <SettingsSection>
      <form className="pb-6" onSubmit={handleLock(lock)}>
        <Button data-testid={locators.settingsLockButton} fill={true} variant="secondary" type="submit">
          Lock
        </Button>
      </form>
      <div data-testid={locators.settingsFeedbackDescription}>Spotted any issues or bugs?</div>
      <ExternalLink
        data-testid={locators.settingsFeedbackLink}
        className="text-white mt-1 underline"
        href={config.feedbackLink}
      >
        Provide feedback
      </ExternalLink>
    </SettingsSection>
  )
}
