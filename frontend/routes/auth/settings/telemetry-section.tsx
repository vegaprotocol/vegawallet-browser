import { ExternalLink, Radio, RadioGroup } from '@vegaprotocol/ui-toolkit'
import { useHomeStore } from '../../home/store'
import { SettingsHeader } from './settings-header'
import { SettingsSection } from './settings-section'
import { useCallback } from 'react'
import config from '@config'
import { useSaveSettings } from '../../../hooks/save-settings'

export const locators = {
  settingsDescription: 'settings-description',
  settingsDataPolicy: 'settings-data-policy',
  settingsTelemetryYes: 'settings-telemetry-yes',
  settingsTelemetryNo: 'settings-telemetry-no'
}

export const TelemetrySection = () => {
  const { save, loading } = useSaveSettings()
  const { globals } = useHomeStore((state) => ({
    globals: state.globals
  }))
  const handleChange = useCallback(
    async (value: string) => {
      const newVal = value === 'true'
      await save({
        telemetry: newVal
      })
    },
    [save]
  )

  if (!globals) {
    throw new Error('Tried to render settings page without globals defined')
  }

  return (
    <SettingsSection>
      <SettingsHeader text="Vega wallet version" />
      <p data-testid={locators.settingsDescription} className="my-4">
        Improve Vega Wallet by automatically reporting bugs and crashes.
      </p>
      <form>
        <RadioGroup onChange={handleChange} value={globals.settings.telemetry.toString()}>
          <Radio
            data-testid={locators.settingsTelemetryYes}
            disabled={loading}
            id="associate-radio-contract"
            label="Yes"
            value="true"
          />
          <Radio
            data-testid={locators.settingsTelemetryNo}
            disabled={loading}
            id="associate-radio-wallet"
            label="No"
            value="false"
          />
        </RadioGroup>
      </form>
      <ExternalLink data-testid={locators.settingsDataPolicy} className="text-white mt-4" href={config.userDataPolicy}>
        Read Vega Wallet's user data policy
      </ExternalLink>
    </SettingsSection>
  )
}
