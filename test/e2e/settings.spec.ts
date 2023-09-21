import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './helpers/driver'
import { NavPanel } from './page-objects/navpanel'
import { goToNewWindowHandle, staticWait, switchWindowHandles, windowHandleHasCount } from './helpers/selenium-util'
import { VegaAPI } from './helpers/wallet/vega-api'
import { Transaction } from './page-objects/transaction'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Settings } from './page-objects/settings'
import { ExtensionHeader } from './page-objects/extension-header'
import { WalletOpenInOtherWindow } from './page-objects/wallet-open-in-other-window'
import { createWalletAndDriver, navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import { APIHelper } from './helpers/wallet/wallet-api'

describe('Settings test', () => {
  let driver: WebDriver
  let connectWalletModal: ConnectWallet
  let navPanel: NavPanel
  let settingsPage: Settings
  let transaction: Transaction
  let header: ExtensionHeader
  let vegaAPI: VegaAPI
  const expectedTelemetryDisabledMessage = 'expected telemetry to be disabled but it was not'
  const expectedTelemetryEnabledMessage = 'expected telemetry to be enabled but it was not'
  const expectedAutoOpenDisabledMessage = 'expected auto open to be disabled but it was not'
  const expectedAutoOpenEnabledMessage = 'expected auto open to be enabled but it was not'

  const transferReq = {
    fromAccountType: 4,
    toAccountType: 4,
    amount: '1',
    asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    to: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
    kind: {
      oneOff: {}
    }
  }

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    connectWalletModal = new ConnectWallet(driver)
    navPanel = new NavPanel(driver)
    transaction = new Transaction(driver)
    header = new ExtensionHeader(driver)
    settingsPage = await navPanel.goToSettings()
    vegaAPI = new VegaAPI(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can navigate to settings and lock the wallet, wallent version is visible', async () => {
    // 1107-SETT-009 I can see a lock button and when I press it I am logged out and redirect to the login page
    const navPanel = new NavPanel(driver)
    const settingsPage = await navPanel.goToSettings()
    await settingsPage.lockWalletAndCheckLoginPageAppears()
  })

  it('can navigate to settings and update telemetry opt in/out preference', async () => {
    // 1111-TELE-008 There is a way to change whether I want to opt in / out of error reporting later (e.g. in settings)
    const navPanel = new NavPanel(driver)
    const settingsPage = await navPanel.goToSettings()
    expect(await settingsPage.isTelemetrySelected(), expectedTelemetryDisabledMessage).toBe(false)
    await settingsPage.selectTelemetryYes()
    expect(await settingsPage.isTelemetrySelected(), expectedTelemetryEnabledMessage).toBe(true)
    await navigateToExtensionLandingPage(driver)
    expect(await settingsPage.isTelemetrySelected(), expectedTelemetryEnabledMessage).toBe(true)
  })

  it('can navigate to settings and update auto open settings, behaviour will be correctly modified after update', async () => {
    // 1113-POPT-010 The browser wallet does not open in a pop-up window if the autoOpen setting is set to false
    // 1113-POPT-011 There is a way to change the auto open setting
    const navPanel = new NavPanel(driver)
    const settingsPage = await navPanel.goToSettings()
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenEnabledMessage).toBe(true)
    await settingsPage.selectAutoOpenNo()
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenDisabledMessage).toBe(false)

    await navigateToExtensionLandingPage(driver)
    await connectWalletAndCheckNumberOfHandles(driver, vegaAPI, false)
    await sendTransactionAndCheckNumberOfHandles(driver, vegaAPI, false)

    await navPanel.goToSettings()
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenDisabledMessage).toBe(false)
    await settingsPage.selectAutoOpenYes()
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenEnabledMessage).toBe(true)
    await sendTransactionAndCheckNumberOfHandles(driver, vegaAPI, true)
  })

  // TODO this test shouldn't be hidden in settings tests as is available across all of the app
  it('can open the wallet extension in a pop out window and approve or reject a transaction', async () => {
    // 1107-SETT-006 There is a way for me to open the browser wallet in a new window
    // 1107-SETT-002 If I have a new window open, if there is a transaction for me to approve or reject this is shown in the new window
    // 1107-SETT-003 If I approve the transaction the new window stays open (on the last view I was on)
    // 1107-SETT-004 If I reject the transaction the pop-up window stays open (on the last view I was on)
    // 1107-SETT-005 If I have the new window open but then open the extension pop up I see the same thing on both views
    const originalExtensionInstance = await driver.getWindowHandle()
    const vegaAPI = new VegaAPI(driver)

    await vegaAPI.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    const popoutWindowHandle = await header.openAppInNewWindowAndSwitchToIt()
    await settingsPage.checkOnSettingsPage()

    const keys = await vegaAPI.listKeys()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })

    await switchWindowHandles(driver, false, popoutWindowHandle)
    await transaction.checkOnTransactionPage()
    await transaction.confirmTransaction()
    await settingsPage.checkOnSettingsPage()

    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq })
    await switchWindowHandles(driver, false, originalExtensionInstance)
    await transaction.checkOnTransactionPage()
    await switchWindowHandles(driver, false, popoutWindowHandle)
    await transaction.rejectTransaction()
    await settingsPage.checkOnSettingsPage()
    await switchWindowHandles(driver, false, originalExtensionInstance)

    await navigateToExtensionLandingPage(driver)
    await settingsPage.checkOnSettingsPage()
    await switchWindowHandles(driver, false, originalExtensionInstance)
  })

  // TODO this test shouldn't be hidden in settings tests as is available across all of the app
  it('prompts the user to continue in the extension window when a popout is open', async () => {
    const originalExtensionWindowHandle = await driver.getWindowHandle()
    let popoutWindowHandle = await header.openAppInNewWindowAndSwitchToIt()
    await settingsPage.checkOnSettingsPage()
    await switchWindowHandles(driver, false, originalExtensionWindowHandle)
    const popOutOpenInOtherWindow = new WalletOpenInOtherWindow(driver)
    await popOutOpenInOtherWindow.checkOnWalletOpenInOtherWindowPage()
    await popOutOpenInOtherWindow.continueHere()
    await settingsPage.checkOnSettingsPage()
    let windowHandles = await driver.getAllWindowHandles()
    expect(
      windowHandles,
      "expected the popout window handle to be closed after clicking the 'continue here button' but it was still found in the window handles"
    ).not.toContain(popoutWindowHandle)
  })

  async function switchToExtensionTab(
    popoutEnabled: boolean,
    originalActiveTab: string,
    tabsBeforeVegaAPIRequest: string[],
    tabsAfterVegaAPIRequest: string[]
  ) {
    if (popoutEnabled) {
      await goToNewWindowHandle(driver, tabsBeforeVegaAPIRequest, tabsAfterVegaAPIRequest)
    } else {
      await switchWindowHandles(driver, false, originalActiveTab)
      await navigateToExtensionLandingPage(driver)
    }
  }

  async function sendTransactionAndCheckNumberOfHandles(driver: WebDriver, vegaAPI: VegaAPI, popoutEnabled: boolean) {
    const originalActiveTab = await driver.getWindowHandle()

    await driver.get('https://google.co.uk')
    await vegaAPI.connectWalletAndCheckSuccess()
    const keys = await vegaAPI.listKeys(false, false)
    const tabsBeforeVegaAPITransaction = await driver.getAllWindowHandles()
    await vegaAPI.sendTransaction(keys[0].publicKey, { transfer: transferReq }, false, true)
    await staticWait(5000)
    const numExpectedTabs = popoutEnabled
      ? tabsBeforeVegaAPITransaction.length + 1
      : tabsBeforeVegaAPITransaction.length
    expect(await windowHandleHasCount(driver, numExpectedTabs)).toBe(true)

    const tabsAfterVegaAPITransaction = await driver.getAllWindowHandles()
    await switchToExtensionTab(
      popoutEnabled,
      originalActiveTab,
      tabsBeforeVegaAPITransaction,
      tabsAfterVegaAPITransaction
    )
    await transaction.rejectTransaction()
    await switchWindowHandles(driver, false)
  }

  async function connectWalletAndCheckNumberOfHandles(driver: WebDriver, vegaAPI: VegaAPI, popoutEnabled: boolean) {
    const tabsBeforeVegaAPIRequest = await driver.getAllWindowHandles()
    const originalActiveTab = await driver.getWindowHandle()

    await driver.get('https://google.co.uk')
    await vegaAPI.connectWallet(true, true)

    const numExpectedTabs = popoutEnabled ? tabsBeforeVegaAPIRequest.length + 1 : tabsBeforeVegaAPIRequest.length
    expect(await windowHandleHasCount(driver, numExpectedTabs)).toBe(true)

    const tabsAfterVegaAPIRequest = await driver.getAllWindowHandles()
    await switchToExtensionTab(popoutEnabled, originalActiveTab, tabsBeforeVegaAPIRequest, tabsAfterVegaAPIRequest)

    await connectWalletModal.checkOnConnectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    await switchWindowHandles(driver, false, originalActiveTab)
    expect(await windowHandleHasCount(driver, tabsBeforeVegaAPIRequest.length)).toBe(true)
  }
})
