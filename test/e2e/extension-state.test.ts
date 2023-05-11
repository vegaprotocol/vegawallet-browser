import { WebDriver } from 'selenium-webdriver'
import { initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { Password } from './page-objects/password'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'

describe('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  const testPassword = 'password1'

  beforeAll(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    driver = await initDriver()
  })

  beforeEach(async () => {
    await navigateToLandingPage(driver)
    await getStarted.getStarted()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('shows the Create a Wallet page after creating password and closing the app', async () => {
    await password.createPassword(testPassword)
    await driver.close()
    await navigateToLandingPage(driver)
    expect(await createAWallet.isCreateWalletPage()).toBe(true)
  })

  it('shows the Get Started page if I unsuccessfully create a password and close the app', async () => {
    await password.createPassword(testPassword, 'diffPassword')
    await driver.close()
    await navigateToLandingPage(driver)
    expect(await getStarted.isGetStartedPage()).toBe(true)
  })

  it('shows the View Wallet page if I successfully create a wallet and close the app', async () => {
    await password.createPassword(testPassword, 'diffPassword')
    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)
    expect(await viewWallet.isViewWalletsPage()).toBe(true)
    await driver.close()
    await navigateToLandingPage(driver)
    expect(await viewWallet.isViewWalletsPage()).toBe(true)
  })
})
