import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed } from '../selenium-util'
import 'jest-expect-message'
import locators from '../../../src/components/locators'

export class ConnectWallet {
  private readonly approve: By = getByDataTestID(locators.connectionModalApproveButton)
  private readonly deny: By = getByDataTestID(locators.connectionModalDenyButton)
  private readonly successModal: By = getByDataTestID(locators.connectionModalSuccess)

  constructor(private readonly driver: WebDriver) {}

  async approveConnectionAndCheckSuccess() {
    await clickElement(this.driver, this.approve)
    expect(
      await isElementDisplayed(this.driver, this.successModal),
      'expected to see the success modal after approving a connection',
      { showPrefix: false }
    ).toBe(true)
  }

  async denyConnection() {
    await clickElement(this.driver, this.deny)
  }

  async checkOnConnectWallet() {
    console.log('about to check if we are on connect wallet yeeehaaa')
    expect(
      await isElementDisplayed(this.driver, this.approve),
      "expected to be on the connect wallet page but couldn't find the approve button",
      { showPrefix: false }
    ).toBe(true)
  }
}
