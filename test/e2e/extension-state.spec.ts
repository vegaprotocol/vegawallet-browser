import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { Password } from './page-objects/password'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { NavPanel } from './page-objects/navpanel'
import { Login } from './page-objects/login'
import { switchWindowHandles, openNewWindowAndSwitchToIt } from './helpers/selenium-util'
import { Telemetry } from './page-objects/telemetry-opt-in'
import { navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import test from '../../config/test'

describe('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  let loginPage: Login
  let telemetry: Telemetry

  beforeEach(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    apiHelper = new APIHelper(driver)
    loginPage = new Login(driver)
    telemetry = new Telemetry(driver)
    await navigateToExtensionLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  const switchToNewWindow = async () => {
    await openNewWindowAndSwitchToIt(driver)
    await navigateToExtensionLandingPage(driver)
    await apiHelper.lockWallet()
    await navigateToExtensionLandingPage(driver)
    await loginPage.login()
  }

  it('shows the previous completed step when opening the app in a new tab', async () => {
    // 1110-RMST-003 I can close the extension and when I reopen it it opens on the same page / view
    // 1110-RMST-001 There is a way to determine if user has onboarded
    // 1101-ONBD-009 When I have submitted my new password, I can NOT go back to the previous step
    // 1110-RMST-002 I want to see the previous page I was on or my wallet page by default
    // 1111-TELE-009 If I am on the telemetry page and leave the app without completing it I am taken back to the telemetry page
    await getStarted.getStarted()
    await password.createPassword('Password', 'password')

    await openNewWindowAndSwitchToIt(driver)
    await navigateToExtensionLandingPage(driver)
    await getStarted.checkOnGetStartedPage()
    await switchWindowHandles(driver)

    await navigateToExtensionLandingPage(driver)
    await getStarted.getStarted()
    await password.createPassword()
    await createAWallet.checkOnCreateWalletPage()

    await switchToNewWindow()
    await createAWallet.checkOnCreateWalletPage()
    await switchWindowHandles(driver)

    await createAWallet.createNewWallet()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    await secureYourWallet.revealRecoveryPhrase()
    const recoveryPhraseText = await secureYourWallet.getRecoveryPhraseText()

    await switchToNewWindow()
    await secureYourWallet.revealRecoveryPhrase()
    const newTabRecoveryPhraseText = await secureYourWallet.getRecoveryPhraseText()
    expect(newTabRecoveryPhraseText).toBe(recoveryPhraseText)

    await switchWindowHandles(driver)
    await navigateToExtensionLandingPage(driver)
    await secureYourWallet.revealRecoveryPhrase(true)
    await telemetry.checkOnTelemetryPage()

    await switchToNewWindow()
    await telemetry.checkOnTelemetryPage()

    await switchWindowHandles(driver)
    await telemetry.optOut()
    await viewWallet.checkOnViewWalletPage()

    await switchToNewWindow()
    await viewWallet.checkOnViewWalletPage()
    await switchWindowHandles(driver)

    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    await settings.checkOnSettingsPage()

    await switchToNewWindow()
    await settings.checkOnSettingsPage()
    await switchWindowHandles(driver)
  })
})
