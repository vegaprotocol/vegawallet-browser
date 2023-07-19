import { ExternalLink, Radio, RadioGroup } from '@vegaprotocol/ui-toolkit'
import { SettingsHeader } from './settings-header'
import config from '!/config'
import { useGlobalsStore } from '../../../stores/globals'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { VegaSection } from '../../../components/vega-section'

export const locators = {
  settingsDescription: 'settings-description',
  settingsDataPolicy: 'settings-data-policy',
  settingsTelemetryYes: 'settings-telemetry-yes',
  settingsTelemetryNo: 'settings-telemetry-no'
}

export const TelemetrySection = () => {
  const { globals, saveSettings, loading } = useGlobalsStore((state) => ({
    globals: state.globals,
    saveSettings: state.saveSettings,
    loading: state.settingsLoading
  }))
  const { request } = useJsonRpcClient()
  const handleChange = async (value: string) => {
    const newVal = value === 'true'
    await saveSettings(request, {
      telemetry: newVal
    })
  }

  if (!globals) {
    throw new Error('Tried to render settings page without globals defined')
  }

  return (
    <VegaSection>
      <SettingsHeader text="Report bugs and crashes" />
      <p data-testid={locators.settingsDescription} className="my-4">
        Improve Vega Wallet by automatically reporting bugs and crashes.
      </p>
      <form>
        <RadioGroup onChange={handleChange} value={globals.settings.telemetry?.toString()}>
          <Radio disabled={loading} id={locators.settingsTelemetryYes} label="Yes" value="true" />
          <Radio disabled={loading} id={locators.settingsTelemetryNo} label="No" value="false" />
        </RadioGroup>
      </form>
      <ExternalLink data-testid={locators.settingsDataPolicy} className="text-white mt-4" href={config.userDataPolicy}>
        Read Vega Wallet's user data policy
      </ExternalLink>
    </VegaSection>
  )
}
