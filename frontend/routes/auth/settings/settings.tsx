import { VersionSection } from './version-section'
import { LockSection } from './lock-section'
import { SettingsRadio } from './settings-form-elements/radio'
import config from '!/config'
import { BasePage } from '../../../components/pages/page'
import { useGlobalsStore } from '../../../stores/globals'
import { ExternalLink } from '../../../components/external-link'

export const locators = {
  settingsPage: 'settings-page',
  settingsDataPolicy: 'settings-data-policy'
}

export const Settings = () => {
  const isDesktop = useGlobalsStore((state) => !state.isMobile)

  return (
    <BasePage dataTestId={locators.settingsPage} title="Settings">
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

      {isDesktop && (
        <SettingsRadio
          description="Automatically open the wallet when a dApp requests to connect or sends a transaction."
          sectionHeader="Auto Open"
          setting="autoOpen"
        />
      )}

      <LockSection />
    </BasePage>
  )
}
