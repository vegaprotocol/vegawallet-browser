import { WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, getElementText, isElementDisplayed } from '../helpers/selenium-util'
import * as config from '../../../config/test'
import * as networkLocators from '../../../frontend/routes/auth/settings/networks/network-details'
import { locators as baseLocators } from '../../../frontend/components/pages/page'
import { locators as networksLocators } from '../../../frontend/components/networks-list'

export class NetworkSettings {
  constructor(private readonly driver: WebDriver) {}

  async checkExpectedNetworksExist() {
    const networkNames: string[] = []
    let networkList = config.default.networks
    networkList.forEach((network) => {
      networkNames.push(network.name)
    })
    networkNames.forEach(async (network) => {
      expect(await isElementDisplayed(this.driver, getByDataTestID(network))).toBe(true)
    })
  }
  async openNetworkDetails(network: string) {
    await clickElement(this.driver, getByDataTestID(networksLocators.networkListButton(network)))
  }

  async checkNetworkID(network: string) {
    let networkID = await getElementText(this.driver, getByDataTestID(networkLocators.locators.networkId))
    expect(networkID.toLowerCase()).toBe(network.toLowerCase())
  }

  async goBack() {
    await clickElement(this.driver, getByDataTestID(baseLocators.basePageBack))
  }
}
