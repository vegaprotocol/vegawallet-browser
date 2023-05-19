import { WebDriver } from 'selenium-webdriver'
import { initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { Password } from './page-objects/password'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './wallet-helpers/api-helpers'

describe('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    apiHelper = new APIHelper(driver)

    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await driver.quit()
  })

  const hackLoginFunction = async () => {
    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await apiHelper.login(testPassword)
    await navigateToLandingPage(driver)
  }

  it('shows the previous completed step when opening the app in a new tab', async () => {
    // 1101-BWAL-031 I can close the extension and when I reopen it it opens on the same page / view
    // 1101-BWAL-066 There is a way to determine if user has onboarded
    // 1101-BWAL-010 When I have submitted my new password, I can NOT go back to the previous step
    await getStarted.getStarted()
    await password.createPassword(testPassword, 'incorrectPassword')

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await getStarted.checkOnGetStartedPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await navigateToLandingPage(driver)
    await getStarted.getStarted()
    await password.createPassword(testPassword)
    await createAWallet.checkOnCreateWalletPage()

    await hackLoginFunction()
    await createAWallet.checkOnCreateWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await createAWallet.createNewWallet()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    await secureYourWallet.revealRecoveryPhrase()

    await hackLoginFunction()
    // TODO this is the wrong behavior, we should be on the secure wallet page.
    await createAWallet.checkOnCreateWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await secureYourWallet.acceptRecoveryPhraseWarning()
    await viewWallet.checkOnViewWalletPage()

    await hackLoginFunction()
    await viewWallet.checkOnViewWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)
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
