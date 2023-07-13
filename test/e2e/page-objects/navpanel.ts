import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, getElementText } from '../selenium-util'
import locators from '../../../frontend/components/locators'

import { Settings } from './settings'
import { ListConnections } from './list-connections'

export class NavPanel {
  private readonly activeNavPanelButton: By = By.css('[data-testid="nav-button"].text-center.active')
  private readonly wallet: By = getByDataTestID(locators.walletIcon)
  private readonly settings: By = getByDataTestID(locators.settingsIcon)
  private readonly connections: By = getByDataTestID(locators.connectionsIcon)

  constructor(private readonly driver: WebDriver) {}

  async checkOnExpectedNavigationTab(expectedNavTab: string) {
    const currentTab = await getElementText(this.driver, this.activeNavPanelButton)
    expect(currentTab, `expected to be on ${expectedNavTab}, instead ${currentTab} was the active panel button`, {
      showPrefix: false
    }).toBe(expectedNavTab)
  }

  async goToSettings() {
    await clickElement(this.driver, this.settings)
    const settings = new Settings(this.driver)
    expect(
      await settings.isSettingsPage(),
      'expected to be able to navigate to settings via the nav panel but could not locate the settings page content',
      { showPrefix: false }
    ).toBe(true)
    return settings
  }

  async goToListConnections() {
    await clickElement(this.driver, this.connections)
    const connections = new ListConnections(this.driver)
    expect(
      await connections.isListConnectionsPage(),
      'expected to be able to navigate to connections via the nav panel but was not on the connections page',
      { showPrefix: false }
    ).toBe(true)
    return connections
  }
}
