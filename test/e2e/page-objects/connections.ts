import { By, WebDriver } from 'selenium-webdriver'
import { getByDataTestID, getElements, isElementDisplayed } from '../selenium-util'
import * as locators from '../../../src/locator-ids'
import 'jest-expect-message'
import { get } from 'http'
import { elementsLocated } from 'selenium-webdriver/lib/until'

export class Connections {
  private readonly noConnections: By = getByDataTestID(locators.connectionsNoConnections)
  private readonly connectionsEl: By = getByDataTestID(locators.connectionsConnection)
  private readonly connectionsHeader: By = getByDataTestID(locators.connectionsHeader)
  private readonly connections: By = getByDataTestID('list-item')

  constructor(private readonly driver: WebDriver) {}

  async checkOnConnectionsPage() {
    expect(
      await this.isConnectionsPage(),
      "expected to be on the 'connections' page but could not locate the connections header",
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

  async isConnectionsPage() {
    return await isElementDisplayed(this.driver, this.connectionsHeader)
  }
}
