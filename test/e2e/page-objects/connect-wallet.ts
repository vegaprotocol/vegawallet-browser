import { By, WebDriver } from 'selenium-webdriver'
import { clickElement, getByDataTestID, isElementDisplayed, waitForElementToDisappear } from '../helpers/selenium-util'
import locators from '../../../frontend/components/locators'

export class ConnectWallet {
  private readonly approve: By = getByDataTestID(locators.connectionModalApproveButton)
  private readonly deny: By = getByDataTestID(locators.connectionModalDenyButton)
  private readonly successModal: By = getByDataTestID(locators.connectionModalSuccess)

  constructor(private readonly driver: WebDriver) {}

  async approveConnectionAndCheckSuccess() {
    await clickElement(this.driver, this.approve)
    console.log('clicked approve')
    expect(
      await isElementDisplayed(this.driver, this.successModal),
      'expected to see the success modal after approving a connection',
      { showPrefix: false }
    ).toBe(true)
    console.log('success was shown')

    await waitForElementToDisappear(this.driver, this.successModal)
    console.log('success modal dissapeared')
  }

  async denyConnection() {
    await clickElement(this.driver, this.deny)
  }

  async checkOnConnectWallet() {
    expect(
      await isElementDisplayed(this.driver, this.approve),
      "expected to be on the connect wallet page but couldn't find the approve button",
      { showPrefix: false }
    ).toBe(true)
  }
}

//test
