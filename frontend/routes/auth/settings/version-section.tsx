import packageJson from '../../../../package.json'
import { VegaSection } from '../../../components/vega-section'
import { SubHeader } from '../../../components/sub-header'

export const locators = {
  settingsVersionTitle: 'settings-version-title',
  settingsVersionNumber: 'settings-version-number'
}

export const VersionSection = () => {
  return (
    <VegaSection>
      <SubHeader content="Vega wallet version" />
      <div className="text-white text-lg mt-1" data-testid={locators.settingsVersionNumber}>
        {packageJson.version}
      </div>
    </VegaSection>
  )
}
