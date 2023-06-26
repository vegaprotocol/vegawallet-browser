import { ExternalLink, Radio, RadioGroup } from '@vegaprotocol/ui-toolkit'
import { useHomeStore } from '../../home/store'
import { SettingsHeader } from './settings-header'
import { SettingsSection } from './settings-section'
import { useState } from 'react'
import config from '@config'

export const TelemetrySection = () => {
  const { globals } = useHomeStore((state) => ({
    globals: state.globals
  }))
  if (!globals) {
    throw new Error('Tried to render settings page without globals defined')
  }

  // TODO remove!!
  const [telemetryEnabled, setTelemetryEnabled] = useState(globals.settings.telemetry)
  return (
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
      <ExternalLink className="text-white mt-4" href={config.userDataPolicy}>
        Read Vega Wallet's user data policy
      </ExternalLink>
    </SettingsSection>
  )
}
