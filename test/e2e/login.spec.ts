import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, copyProfile, deleteAutomationFirefoxProfile, initDriver, initFirefoxDriver } from './driver'
import { navigateToExtensionLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { Login } from './page-objects/login'
import { openNewWindowAndSwitchToIt } from './selenium-util'
import { ViewWallet } from './page-objects/view-wallet'

describe('Login', () => {
  let driver: WebDriver
  let apiHelper: APIHelper
  let viewWallet: ViewWallet
  let login: Login
  const testPassword = 'password1'
  const isFirefox = process.env.BROWSER?.toLowerCase() === 'firefox'

  beforeEach(async () => {
    driver = isFirefox ? await initFirefoxDriver(true) : await initDriver()
    apiHelper = new APIHelper(driver)
    viewWallet = new ViewWallet(driver)
    login = new Login(driver)
    await navigateToExtensionLandingPage(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToExtensionLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    if (isFirefox) {
      deleteAutomationFirefoxProfile()
    }
    await driver.quit()
  })

  it('Check can log in via the login page after quitting the browser(firefox) or loading in a new tab(chrome)', async () => {
    // 1102-LGIN-001 When I have quit my browser, and then reopened, I am asked to enter my browser extension password'
    // 1102-LGIN-003 When entering a correct password decrypts my wallets
    await openNewInstanceOfVegaWallet()
    login = new Login(driver)
    await login.checkOnLoginPage()
    await login.login(testPassword)
    viewWallet = new ViewWallet(driver)
    await viewWallet.checkOnViewWalletPage()
    const keys = await viewWallet.getWalletKeys()
    expect(keys.length, `expected to be able to view 1 wallet key, instead found ${keys.length}`).toBe(1)
    const name = await viewWallet.getWalletName()
    expect(name).toBe('Wallet 1')
  })

  it('shows error if password entered incorrectly, I can log in after fixing the error', async () => {
    // 1102-LGIN-002 I am informed if I enter my password incorrectly
    await apiHelper.lockWallet()
    await navigateToExtensionLandingPage(driver)
    await login.checkOnLoginPage()
    await login.login(testPassword + '1')
    const errorText = await login.getErrorText()
    expect(errorText).toBe('Incorrect passphrase')
    await login.login(testPassword)
    await viewWallet.checkOnViewWalletPage()
  })

  async function openNewInstanceOfVegaWallet() {
    if (isFirefox) {
      await copyProfile(driver)
      await driver.quit()
      driver = await initFirefoxDriver(true, false)
    } else {
      await apiHelper.lockWallet()
      await openNewWindowAndSwitchToIt(driver)
    }
    await navigateToExtensionLandingPage(driver)
  }
})
