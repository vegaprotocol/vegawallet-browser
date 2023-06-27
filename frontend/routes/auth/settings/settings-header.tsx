export const locators = {
  settingsHeader: 'settings-header'
}

export const SettingsHeader = ({ text }: { text: string }) => (
  <div className="text-vega-dark-300 text-sm uppercase" data-testid={locators.settingsHeader}>
    {text}
  </div>
)
