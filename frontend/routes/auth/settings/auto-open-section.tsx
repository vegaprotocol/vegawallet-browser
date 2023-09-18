import { Radio, RadioGroup } from '@vegaprotocol/ui-toolkit'
import { SettingsHeader } from './settings-header'
import { useGlobalsStore } from '../../../stores/globals'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { VegaSection } from '../../../components/vega-section'

export const locators = {
  autoOpenDescription: 'auto-open-description',
  autoOpenDataPolicy: 'auto-open-data-policy',
  autoOpenYes: 'auto-open-telemetry-yes',
  autoOpenNo: 'auto-open-telemetry-no'
}

export const AutoOpen = () => {
  const { globals, saveSettings, loading } = useGlobalsStore((state) => ({
    globals: state.globals,
    saveSettings: state.saveSettings,
    loading: state.settingsLoading
  }))
  const { request } = useJsonRpcClient()
  const handleChange = async (value: string) => {
    const newVal = value === 'true'
    await saveSettings(request, {
      autoOpen: newVal
    })
  }

  if (!globals) {
    throw new Error('Tried to render settings page without globals defined')
  }

  return (
    <VegaSection>
      <SettingsHeader text="Auto Open" />
      <p data-testid={locators.autoOpenDescription} className="my-4">
        Automatically open the wallet when a dApp requests to connect or sends a transaction.
      </p>
      <form>
        <RadioGroup onChange={handleChange} value={globals.settings.autoOpen?.toString()}>
          <Radio disabled={loading} id={locators.autoOpenYes} label="Yes" value="true" />
          <Radio disabled={loading} id={locators.autoOpenNo} label="No" value="false" />
        </RadioGroup>
      </form>
    </VegaSection>
  )
}
