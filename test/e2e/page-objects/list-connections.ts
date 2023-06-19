import { By, WebDriver } from 'selenium-webdriver'
import { getByDataTestID, getElements, hasTotalNumElements, isElementDisplayed } from '../selenium-util'
@frontend/locator-ids'

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

  async getConnectionNames() {
    const connectionsList = await getElements(this.driver, this.connections)
    let connectionNames: string[] = []

    for (const connection of connectionsList) {
      connectionNames.push(await connection.getText())
    }

    return connectionNames
  }

  async checkNumConnections(expectedConnections: number) {
    expect(
      await hasTotalNumElements(expectedConnections, this.connections, this.driver),
      `expected ${expectedConnections} connection(s), instead found ${await this.getNumberOfConnections()}`
    ).toBe(true)
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
