import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { NavPanel } from './page-objects/navpanel'
import { APIHelper } from './wallet-helpers/api-helpers'
import { switchWindowHandles } from './selenium-util'
import { VegaAPI } from './wallet-helpers/vega-api'
import { Transaction } from './page-objects/transaction'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Settings } from './page-objects/settings'
import { ExtensionHeader } from './page-objects/extension-header'

describe('Settings test', () => {
  let driver: WebDriver
  let connectWalletModal: ConnectWallet
  let navPanel: NavPanel
  let settingsPage: Settings
  let transaction: Transaction
  const expectedTelemetryDisabledMessage = "expected telemetry to be disabled initially but it was not"
  const expectedTelemetryEnabledMessage = "expected telemetry to be enabled initially but it was not"

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
    driver = await initDriver()
    await navigateToLandingPage(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
    connectWalletModal = new ConnectWallet(driver)
    navPanel = new NavPanel(driver)
    transaction = new Transaction(driver)
    settingsPage = await navPanel.goToSettings()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can navigate to settings and lock the wallet, wallent version is visible', async () => {
    // 1107-SETT-010 I can see a lock button and when I press it I am logged out and redirect to the login page
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
    await navigateToLandingPage(driver)
    expect (await settingsPage.isTelemetrySelected(), expectedTelemetryEnabledMessage).toBe(true)
  })

  it('can open the wallet extension in a pop out window and approve or reject a transaction', async () => {
    // 1107-SETT-007 There is a way for me to open the browser wallet in a new window
    // 1107-SETT-002 If I have a new window open, if there is a transaction for me to approve or reject this is shown in the new window
    // 1107-SETT-003 If I approve the transaction the new window stays open (on the last view I was on)
    // 1107-SETT-004 If I reject the transaction the pop-up window stays open (on the last view I was on)
    // 1107-SETT-006 If I have the new window open but then open the extension pop up I see the same thing on both views
    const originalExtensionInstance = await driver.getWindowHandle()
    const vegaAPI = new VegaAPI(driver, originalExtensionInstance)

    await vegaAPI.connectWallet()
    await connectWalletModal.approveConnectionAndCheckSuccess()
    const header = new ExtensionHeader(driver)
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

    await navigateToLandingPage(driver)
    await settingsPage.checkOnSettingsPage()
    await switchWindowHandles(driver, false, originalExtensionInstance)
  })
})
