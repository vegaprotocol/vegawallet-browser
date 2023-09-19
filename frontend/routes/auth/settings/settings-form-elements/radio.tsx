import { Radio, RadioGroup } from '@vegaprotocol/ui-toolkit'
import { SettingsHeader } from '../settings-header'
import { useGlobalsStore } from '../../../../stores/globals'
import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { VegaSection } from '../../../../components/vega-section'
import { ReactNode } from 'react'

export const locators = {
  settingsRadioDescription: 'settings-radio-description',
  settingsRadioYes: 'settings-radio-yes',
  settingsRadioNo: 'settings-radio-no'
}

export const SettingsRadio = ({
  children,
  setting,
  description,
  sectionHeader
}: {
  setting: string
  description: string
  sectionHeader: string
  children?: ReactNode
}) => {
  const { globals, saveSettings, loading } = useGlobalsStore((state) => ({
    globals: state.globals,
    saveSettings: state.saveSettings,
    loading: state.settingsLoading
  }))
  const { request } = useJsonRpcClient()
  const handleChange = async (value: string) => {
    const newVal = value === 'true'
    await saveSettings(request, {
      [setting]: newVal
    })
  }

  if (!globals) {
    throw new Error('Tried to render settings page without globals defined')
  }

  return (
    <VegaSection>
      <SettingsHeader text={sectionHeader} />
      <p data-testid={`${setting}-${locators.settingsRadioDescription}`} className="my-4">
        {description}
      </p>
      <form>
        <RadioGroup onChange={handleChange} value={globals.settings[setting]?.toString()}>
          <Radio disabled={loading} id={`${setting}-${locators.settingsRadioYes}`} label="Yes" value="true" />
          <Radio disabled={loading} id={`${setting}-${locators.settingsRadioNo}`} label="No" value="false" />
        </RadioGroup>
      </form>
      {children}
    </VegaSection>
  )
}
