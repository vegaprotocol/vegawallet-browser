import { SettingsHeader } from './settings-header'
import { SettingsSection } from './settings-section'
import packageJson from '../../../../package.json'

export const locators = {
  settingsVersionTitle: 'settings-version-title',
  settingsVersionNumber: 'settings-version-number'
}

export const VersionSection = () => {
  return (
    <SettingsSection>
      <SettingsHeader text="Vega wallet version" />
      <div className="text-white text-lg mt-1" data-testid={locators.settingsVersionNumber}>
        {packageJson.version}
      </div>
    </SettingsSection>
  )
}
