import { By, WebDriver } from 'selenium-webdriver'
import { getByDataTestID, getElements, isElementDisplayed } from '../selenium-util'
import * as locators from '../../../frontend/locator-ids'

import 'jest-expect-message'
export class ListConnections {
  private readonly noConnections: By = getByDataTestID(locators.connectionsNoConnections)
  private readonly connectionsEl: By = getByDataTestID(locators.connectionsConnection)
  private readonly connectionsHeader: By = getByDataTestID(locators.connectionsHeader)
  private readonly connections: By = getByDataTestID('list-item')

  constructor(private readonly driver: WebDriver) {}

  async checkOnListConnectionsPage() {
    expect(
      await this.isListConnectionsPage(),
      "expected to be on the 'list connections' page but could not locate the connections header",
      { showPrefix: false }
    ).toBe(true)
  }

  async getNumberOfConnections() {
    const listOfConnectionElements = await getElements(this.driver, this.connections)
    return listOfConnectionElements.length
  }

  async connectionsExist() {
    if (await isElementDisplayed(this.driver, this.noConnections)) {
      return false
    }
    return true
  }

  async checkNoConnectionsExist() {
    expect(
      await this.connectionsExist(),
      `expected no connections to exist but could not find the ${locators.connectionsNoConnections} element, suggesting connections may be present`,
      { showPrefix: false }
    ).toBe(false)
  }

  async isListConnectionsPage() {
    return await isElementDisplayed(this.driver, this.connectionsHeader)
  }
}
