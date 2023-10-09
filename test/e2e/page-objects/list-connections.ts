import { By, WebDriver } from 'selenium-webdriver'
import {
  clickDescendantOfWebElement,
  getByDataTestID,
  getElements,
  getWebElementContainingText,
  hasTotalNumElements,
  isElementDisplayed
} from '../helpers/selenium-util'
import { locators as noConnectionsLocators } from '../../../frontend/routes/auth/connections/no-dapps-connected'
import { locators as connectionsLocators } from '../../../frontend/routes/auth/connections'
import { locators as connectionsListLocators } from '../../../frontend/routes/auth/connections/connection-list'

export class ListConnections {
  private readonly noConnections: By = getByDataTestID(noConnectionsLocators.connectionsNoConnections)
  private readonly connectionsHeader: By = getByDataTestID(connectionsLocators.connectionsHeader)
  private readonly connections: By = getByDataTestID('list-item')
  private readonly connectionsRemoveConnection: By = getByDataTestID(connectionsListLocators.connectionRemoveConnection)

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
      `expected no connections to exist but could not find the ${noConnectionsLocators.connectionsNoConnections} element, suggesting connections may be present`,
      { showPrefix: false }
    ).toBe(false)
  }

  async isListConnectionsPage() {
    return await isElementDisplayed(this.driver, this.connectionsHeader)
  }

  async disconnectConnection(connectionName: string) {
    const connection = await getWebElementContainingText(connectionName, this.driver, this.connections)
    await clickDescendantOfWebElement(this.driver, connection, this.connectionsRemoveConnection)
  }
}
