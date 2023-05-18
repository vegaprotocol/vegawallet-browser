import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { GetStarted } from './page-objects/get-started'
import { Password } from './page-objects/password'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'

describe('View wallet page', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  const testPassword = 'password1'

  beforeAll(async () => {
    //TODO- replace this set up with an api method to create a password and an api method importing a wallet. We should then be taken straight to the view wallet page
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    await getStarted.getStarted()
    await password.createPassword(testPassword)
    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)
  })

  afterAll(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('defaults to the fairground network', async () => {
    // 1101-BWAL-026 The browser wallet defaults to use the Fairground network
    // 1101-BWAL-027 I can see which vega network the browser wallet is connected to from the view wallet page
    const connectedNetwork = await viewWallet.getNetworkConnectedTo()
    expect(connectedNetwork.toLowerCase()).toBe('fairground')
  })
})
