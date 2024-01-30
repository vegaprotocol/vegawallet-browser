import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  getElementText,
  isElementDisplayed,
  openLatestWindowHandle
} from '../helpers/selenium-util'
import * as networkSwitcher from '../../../frontend/components/page-header/network-switcher'
import * as popoutButton from '../../../frontend/components/page-header/popout-button'

export class ExtensionHeader {
  private readonly openPopoutButton: By = getByDataTestID(popoutButton.locators.openPopoutButton)
  private readonly networkIndicator: By = getByDataTestID(networkSwitcher.locators.networkSwitcher)

  constructor(private readonly driver: WebDriver) {}

  async checkPageHeaderDisplayed() {
    expect(
      await isElementDisplayed(this.driver, this.openPopoutButton),
      'expected vega wallet header to be visible but could not located the open popout button on it',
      {
        showPrefix: false
      }
    ).toBe(true)
  }

  async openAppInNewWindowAndSwitchToIt() {
    const windowHandles = await this.driver.getAllWindowHandles()
    await clickElement(this.driver, this.openPopoutButton)
    await this.driver.wait(async () => {
      return (await this.driver.getAllWindowHandles()).length === windowHandles.length + 1
    }, 10000)
    await openLatestWindowHandle(this.driver)
    return await this.driver.getWindowHandle()
  }

  async getNetworkConnectedTo() {
    return await getElementText(this.driver, this.networkIndicator)
  }
}
