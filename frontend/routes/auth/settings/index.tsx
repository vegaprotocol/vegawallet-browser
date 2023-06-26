import { VersionSection } from './version-section'
import { TelemetrySection } from './telemetry-section'
import { LockSection } from './lock-section'
import { FooterSection } from './footer-section'

export const locators = {
  settingsPage: 'settings-page'
}

export const Settings = () => {
  return (
    <section data-testid={locators.settingsPage}>
      <h1 className="flex justify-center flex-col text-2xl text-white">Settings</h1>

      <VersionSection />

      <TelemetrySection />

      <LockSection />

      <FooterSection />
    </section>
  )
}
