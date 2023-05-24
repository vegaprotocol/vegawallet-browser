import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, copyProfile, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { Login } from './page-objects/login'
import { CreateAWallet } from './page-objects/create-a-wallet'

describe('Login', () => {
  let driver: WebDriver
  let apiHelper: APIHelper
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver(true)
    apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
    await apiHelper.createPassphrase(testPassword)
    await copyProfile(driver)
    await driver.quit()
    driver = await initDriver(true, false)
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('Check can log in via the login page', async () => {
    //1101-BWAL-058 When I have quit my browser, and then reopened, I am asked to enter my browser extension password'
    const login = new Login(driver)
    await login.checkOnLoginPage()
    await login.login(testPassword)
    const createWallet = new CreateAWallet(driver)
    await createWallet.checkOnCreateWalletPage()
  })

  it('1101-BWAL-059 I am informed if I enter my password incorrectly', async () => {
    const login = new Login(driver)
    await login.checkOnLoginPage()
    await login.login(testPassword + '1')
    // Need to  assert an error here.
  })
})
