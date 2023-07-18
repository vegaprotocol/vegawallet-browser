import { Button, ExternalLink } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
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
  const { request } = useJsonRpcClient()
  const navigate = useNavigate()
  const { handleSubmit: handleLock } = useForm()
  const lock = async () => {
    await request(RpcMethods.Lock, null)
    navigate(FULL_ROUTES.login)
  }
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
