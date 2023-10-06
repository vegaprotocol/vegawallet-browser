import { VersionSection } from './version-section'
import { LockSection } from './lock-section'
import { SettingsRadio } from './settings-form-elements/radio'
import { ExternalLink } from '@vegaprotocol/ui-toolkit'
import config from '!/config'
import { AuthPage } from '../../../components/auth-page'

export const locators = {
  settingsPage: 'settings-page',
  settingsDataPolicy: 'settings-data-policy'
}

export const Settings = () => {
  return (
    <AuthPage dataTestId={locators.settingsPage} title="Settings">
      <VersionSection />

      <SettingsRadio
        description="Improve Vega Wallet by automatically reporting bugs and crashes."
        sectionHeader="Telemetry"
        setting="telemetry"
      >
        <ExternalLink
          data-testid={locators.settingsDataPolicy}
          className="text-white mt-4"
          href={config.userDataPolicy}
        >
          Read Vega Wallet's user data policy
        </ExternalLink>
      </SettingsRadio>

      <SettingsRadio
        description="Automatically open the wallet when a dApp requests to connect or sends a transaction."
        sectionHeader="Auto Open"
        setting="autoOpen"
      />

      <LockSection />
    </AuthPage>
  )
}
