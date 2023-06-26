export const locators = {
  settingsVersionTitle: 'settings-version-title'
}

export const SettingsHeader = ({ text }: { text: string }) => (
  <div className="text-vega-dark-300 text-sm uppercase" data-testid={locators.settingsVersionTitle}>
    {text}
  </div>
)
