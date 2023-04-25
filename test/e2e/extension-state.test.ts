import { WebDriver } from 'selenium-webdriver'
import { CreateWallet } from './wallet-helpers/wallet-creation'
import { browser } from 'webextension-polyfill-ts'
import { initDriver } from './selenium-auto-wait-wrapper'

describe('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let createWallet: CreateWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = initDriver()
    createWallet = new CreateWallet(driver)
    await createWallet.navigateToLandingPage()
  })

  afterEach(async () => {
    localStorage.clear()
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
    expect(await createWallet.isGettingStartedPage()).toBe(true)
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
