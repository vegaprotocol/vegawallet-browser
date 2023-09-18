import { VersionSection } from './version-section'
import { TelemetrySection } from './telemetry-section'
import { LockSection } from './lock-section'
import { AutoOpen } from './auto-open-section'

export const locators = {
  settingsPage: 'settings-page'
}

export const Settings = () => {
  return (
    <section data-testid={locators.settingsPage}>
      <h1 className="flex justify-center flex-col text-2xl text-white">Settings</h1>

      <VersionSection />

      <TelemetrySection />

      <AutoOpen />

      <LockSection />
    </section>
  )
}
