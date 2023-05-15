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
    // 1101-BWAL-031 I can close the extension and when I reopen it it opens on the same page / view
    // 1101-BWAL-032 When I reopen the extension after last viewing the recovery phrase and hadn't yet acknowledged and moved to the next step, it opens on the recover phrase step with the recovery phrase hidden
    await getStarted.getStarted()
    await password.createPassword(testPassword, 'incorrectPassword')

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await getStarted.checkOnGetStartedPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await navigateToLandingPage(driver)
    await getStarted.getStarted()
    await password.createPassword(testPassword)

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await createAWallet.checkOnCreateWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase()

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)

    //This next step fails, AC indicates it should be on secure wallet page but it is showing the 'create wallet' page instead
    await secureYourWallet.checkOnSecureYourWalletPage()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await viewWallet.checkOnViewWalletPage()
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
