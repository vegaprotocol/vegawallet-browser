import { WebDriver } from 'selenium-webdriver'
import { CreateWallet } from './wallet-helpers/wallet-creation'
import { initDriver } from './selenium-auto-wait-wrapper'

describe.skip('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let createWallet: CreateWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    createWallet = new CreateWallet(driver)
    await createWallet.navigateToLandingPage()
  })

  afterAll(async () => {
    await driver.quit()
  })

  it('shows the Create a Wallet page after creating password and closing the app', async () => {
    await createWallet.configureAppCredentials(testPassword)
    await driver.close()
    await createWallet.navigateToLandingPage()
    expect(await createWallet.isAddWalletPage()).toBe(true)
  })

  it('shows the Get Started page if I unsuccessfully create a password and close the app', async () => {
    await createWallet.configureAppCredentials(testPassword, 'diffPassword')
    await driver.close()
    await createWallet.navigateToLandingPage()
    expect(await createWallet.isGetStartedPage()).toBe(true)
  })

  it('shows the View Wallet page if I successfully create a wallet and close the app', async () => {
    await createWallet.configureAppCredentials(testPassword, 'diffPassword')
    await createWallet.addNewWallet()
    expect(await createWallet.isWalletCreated()).toBe(true)
    await driver.close()
    await createWallet.navigateToLandingPage()
    expect(await createWallet.isViewWalletsPage()).toBe(true)
  })
})
