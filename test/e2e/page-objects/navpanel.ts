import { By, WebDriver } from 'selenium-webdriver'
import { getElementText } from '../selenium-util'
import 'jest-expect-message'

export class NavPanel {
  private readonly activeNavPanelButton: By = By.css('[data-testid="nav-button"].text-center.active')

  constructor(private readonly driver: WebDriver) {}

  async checkOnExpectedNavigationTab(expectedNavTab: string) {
    const currentTab = await getElementText(this.driver, this.activeNavPanelButton)
    expect(currentTab, `expected to be on ${expectedNavTab}, instead ${currentTab} was the active panel button`, {
      showPrefix: false
    }).toBe(expectedNavTab)
  }
}
