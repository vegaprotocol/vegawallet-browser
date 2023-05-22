import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, getElementText } from '../selenium-util'
import 'jest-expect-message'

import { Settings } from './settings'

export class NavPanel {
  private readonly activeNavPanelButton: By = By.css('[data-testid="nav-button"].text-center.active')
  private readonly wallet: By = getByDataTestID('wallet-icon')
  private readonly settings: By = getByDataTestID('settings-icon')

  constructor(private readonly driver: WebDriver) {}

  async checkOnExpectedNavigationTab(expectedNavTab: string) {
    const currentTab = await getElementText(this.driver, this.activeNavPanelButton)
    expect(currentTab, `expected to be on ${expectedNavTab}, instead ${currentTab} was the active panel button`, {
      showPrefix: false
    }).toBe(expectedNavTab)
  }

  async goToSettings() {
    clickElement(this.driver, this.settings)
    const settings = new Settings(this.driver)
    expect(
      await settings.isSettingsPage(),
      'expected to be able to navigate to settings via the nav panel but could not locate the settings page content',
      { showPrefix: false }
    ).toBe(true)
    return new Settings(this.driver)
  }
}
