import { Button, ExternalLink, Radio, RadioGroup } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'
import { ReactNode, useCallback, useState } from 'react'
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

const SettingsSection = ({ children }: { children: ReactNode }) => (
  <div className="pt-6 border-b border-1 border-vega-dark-150 pb-6">{children}</div>
)

const SettingsHeader = ({ text }: { text: string }) => (
  <div className="text-vega-dark-300 text-sm uppercase" data-testid={locators.settingsVersionTitle}>
    {text}
  </div>
)

export const Settings = () => {
  const [telemetryEnabled, setTelemetryEnabled] = useState(false)
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
      <SettingsSection>
        <SettingsHeader text="Vega wallet version" />
        <div className="text-white text-lg mt-1" data-testid={locators.settingsVersionNumber}>
          {packageJson.version}
        </div>
      </SettingsSection>

      <SettingsSection>
        <SettingsHeader text="Vega wallet version" />
        <p className="my-4">Improve Vega Wallet by automatically reporting bugs and crashes.</p>
        <RadioGroup
          onChange={(value) => {
            setTelemetryEnabled(value === 'true')
          }}
          value={telemetryEnabled.toString()}
        >
          <Radio id="associate-radio-contract" label="Yes" value="true" />
          <Radio id="associate-radio-wallet" label="No" value="false" />
        </RadioGroup>
        <ExternalLink className="text-white" href={config.userDataPolicy}>
          Read Vega Wallet's user data policy
        </ExternalLink>
      </SettingsSection>

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
      <ExternalLink
        onClick={handlePopout(popout)}
        data-testid={locators.settingsOpenPopoutButton}
        className="text-white my-6"
        type="submit"
      >
        Open wallet in a new window
      </ExternalLink>
    </section>
  )
}
