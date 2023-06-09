import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { Password } from './page-objects/password'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './wallet-helpers/api-helpers'
import { NavPanel } from './page-objects/navpanel'
import { Login } from './page-objects/login'
import { closeCurrentWindowAndSwitchToPrevious, openNewWindowAndSwitchToIt } from './selenium-util'

describe('Check correct app state persists after closing the extension', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  let loginPage: Login

  beforeEach(async () => {
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    apiHelper = new APIHelper(driver)
    loginPage = new Login(driver)
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  const switchToNewWindow = async () => {
    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await apiHelper.lockWallet()
    await navigateToLandingPage(driver)
    await loginPage.login()
  }

  it('shows the previous completed step when opening the app in a new tab', async () => {
    // 1101-BWAL-032 I can close the extension and when I reopen it it opens on the same page / view
    // 1101-BWAL-067 There is a way to determine if user has onboarded
    // 1101-BWAL-010 When I have submitted my new password, I can NOT go back to the previous step
    // 1101-BWAL-068 I want to see the previous page I was on or my wallet page by default
    await getStarted.getStarted()
    await password.createPassword('Password', 'password')

    await openNewWindowAndSwitchToIt(driver)
    await navigateToLandingPage(driver)
    await getStarted.checkOnGetStartedPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await navigateToLandingPage(driver)
    await getStarted.getStarted()
    await password.createPassword()
    await createAWallet.checkOnCreateWalletPage()

    await switchToNewWindow()
    await createAWallet.checkOnCreateWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await createAWallet.createNewWallet()
    expect(await secureYourWallet.isRecoveryPhraseHidden()).toBe(true)
    await secureYourWallet.revealRecoveryPhrase()
    expect(await secureYourWallet.isRecoveryPhraseDisplayed()).toBe(true)

    await switchToNewWindow()
    // TODO this is the wrong behavior, we should be on the secure wallet page.
    await createAWallet.checkOnCreateWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    await navigateToLandingPage(driver)
    await createAWallet.createNewWallet()
    await secureYourWallet.revealRecoveryPhrase(true)
    await viewWallet.checkOnViewWalletPage()

    await switchToNewWindow()
    await viewWallet.checkOnViewWalletPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)

    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    await settings.checkOnSettingsPage()

    await switchToNewWindow()
    await settings.checkOnSettingsPage()
    await closeCurrentWindowAndSwitchToPrevious(driver)
  })
})
