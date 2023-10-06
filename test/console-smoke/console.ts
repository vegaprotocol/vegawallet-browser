import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  clickWebElement,
  getByDataTestID,
  getElements,
  getWebElementText,
  isElementDisplayed,
  sendKeysToElement,
  waitForElementToBeReady,
  waitForElementToDisappear
} from '../e2e/helpers/selenium-util'

export class Console {
  private readonly connect: By = getByDataTestID('connect-vega-wallet')
  private readonly connectToBrowserWallet: By = getByDataTestID('connector-injected')
  private readonly orderTab: By = getByDataTestID('Order')
  private readonly networkDropdown: By = getByDataTestID('navbar-network-switcher-trigger')
  private readonly orderSize: By = getByDataTestID('order-size')
  private readonly orderPrice: By = getByDataTestID('order-price')
  private readonly placeOrder: By = getByDataTestID('place-order')
  private readonly welcomeDialog: By = getByDataTestID('dialog-close')
  private readonly connectDialog: By = getByDataTestID('wallet-dialog-title')
  private readonly successToast: By = By.css("[data-testid='toast'][class*='bg-vega-green']")
  private readonly closeAnyToast: By = By.css("[data-testid='toast-close']")
  private readonly marketsParentElement: By = By.css("[data-testid*='pathname-/markets']")
  private readonly marketSelector: By = getByDataTestID('popover-trigger')
  private readonly marketSelectorPrice: By = By.css("[data-testid='market-selector-price']")
  private readonly iAgreeButton: By = By.xpath("//button[contains(text(), 'I agree')]")

  constructor(private readonly driver: WebDriver) {}

  async checkTransactionSuccess() {
    expect(await isElementDisplayed(this.driver, this.successToast), 'expected to see a success toast', {
      showPrefix: false
    }).toBe(true)
  }

  async connectToWallet() {
    await clickElement(this.driver, this.connect)
    expect(
      await isElementDisplayed(this.driver, this.connectToBrowserWallet),
      'expected to see the connect to browser wallet button',
      { showPrefix: false }
    ).toBe(true)

    await clickElement(this.driver, this.connectToBrowserWallet)
  }

  async waitForConnectDialogToDissapear() {
    await waitForElementToDisappear(this.driver, this.connectDialog)
  }

  async goToOrderTab() {
    if (await isElementDisplayed(this.driver, this.placeOrder, 3)) {
      return
    }
    await clickElement(this.driver, this.orderTab)
  }

  async agreeToUnderstandRisk() {
    await clickElement(this.driver, this.iAgreeButton)
  }

  async selectMarketBySubstring(marketSubstring: string) {
    const marketParentElement = await waitForElementToBeReady(this.driver, this.marketsParentElement)
    await clickWebElement(this.driver, marketParentElement.findElement(this.marketSelector))
    const markets = await getElements(this.driver, this.marketSelectorPrice)
    for (const market of markets) {
      if ((await getWebElementText(this.driver, market)).includes(marketSubstring)) {
        await clickWebElement(this.driver, market)
        return
      }
    }
    throw new Error(`could not find ${marketSubstring} market`)
  }

  async clearAllToast() {
    if (await isElementDisplayed(this.driver, this.closeAnyToast, 1)) {
      const toastElements = await getElements(this.driver, this.closeAnyToast)
      for (const toastElement of toastElements) {
        await clickWebElement(this.driver, toastElement)
      }
      await waitForElementToDisappear(this.driver, this.closeAnyToast)
    }
  }

  async submitOrder(orderSize: string, orderPrice: string) {
    await this.clearAllToast()
    await sendKeysToElement(this.driver, this.orderPrice, orderPrice)
    await sendKeysToElement(this.driver, this.orderSize, orderSize)
    await clickElement(this.driver, this.placeOrder)
    console.log('clicked place order')
  }

  async clearWelcomeDialogIfShown() {
    if (await isElementDisplayed(this.driver, this.welcomeDialog)) {
      await clickElement(this.driver, this.welcomeDialog)
    }
  }

  async checkOnConsole() {
    expect(
      await isElementDisplayed(this.driver, this.networkDropdown),
      'expected to be on console but could not locate the network dropdown',
      { showPrefix: false }
    ).toBe(true)
  }
}
