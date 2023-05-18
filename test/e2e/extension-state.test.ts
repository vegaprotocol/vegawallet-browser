import { WebDriver } from 'selenium-webdriver'
import { initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { Password } from './page-objects/password'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import fs from 'fs'
import { get } from 'http'

describe('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)

    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await driver.quit()
  })

  it('shows the Create a Wallet page after creating password and closing the app', async () => {
    await getStarted.getStarted()
    await password.createPassword(testPassword, 'incorrectPassword')

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    expect(await getStarted.isGetStartedPage()).toBe(true)
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await navigateToLandingPage(driver)
    await getStarted.getStarted()
    await password.createPassword(testPassword)

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    expect(await createAWallet.isCreateWalletPage()).toBe(true)
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await viewWallet.checkOnViewWalletsPage()
  })
})

async function openNewWindowAndSwitchToIt(driver: WebDriver) {
  await driver.executeScript('window.open();')
  const handles = await driver.getAllWindowHandles()
  await driver.switchTo().window(handles[1])
}

async function closeCurrentWindowAndSwitchToPrevious(driver: WebDriver) {
  const handles = await driver.getAllWindowHandles()
  await driver.close()
  await driver.switchTo().window(handles[0])
}
