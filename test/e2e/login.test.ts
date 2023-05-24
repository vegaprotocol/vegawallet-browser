import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, copyProfile, deleteAutomationFirefoxProfile, initDriver, initFirefoxDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { Login } from './page-objects/login'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { openNewWindowAndSwitchToIt } from './selenium-util'

describe('Login', () => {
  let driver: WebDriver
  let apiHelper: APIHelper
  const testPassword = 'password1'
  const isFirefox = process.env.BROWSER?.toLowerCase() === 'firefox'

  beforeEach(async () => {
    driver = isFirefox ? await initFirefoxDriver(true) : await initDriver()
    apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
    await apiHelper.createPassphrase(testPassword)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    if (isFirefox) {
      deleteAutomationFirefoxProfile()
    }
    await driver.quit()
  })

  it('Check can log in via the login page after quitting the browser(firefox) or loading in a new tab(chrome)', async () => {
    // 1101-BWAL-058 When I have quit my browser, and then reopened, I am asked to enter my browser extension password'
    await openNewInstanceOfVegaWallet()
    const login = new Login(driver)
    await login.checkOnLoginPage()
    await login.login(testPassword)
    const createWallet = new CreateAWallet(driver)
    await createWallet.checkOnCreateWalletPage()
  })

  it('1101-BWAL-059 I am informed if I enter my password incorrectly', async () => {
    await apiHelper.lockWallet()
    await navigateToLandingPage(driver)
    const login = new Login(driver)
    await login.checkOnLoginPage()
    await login.login(testPassword + '1')
    // Need to assert an error here.
  })

  async function openNewInstanceOfVegaWallet() {
    if (isFirefox) {
      await copyProfile(driver)
      await driver.quit()
      driver = await initFirefoxDriver(true, false)
    } else {
      await openNewWindowAndSwitchToIt(driver)
    }
    await navigateToLandingPage(driver)
  }
})
