import { WebDriver } from 'selenium-webdriver'
import { initDriver } from './driver'
import { navigateToLandingPage } from './wallet-helpers/common'
import { NavPanel } from './page-objects/navpanel'
import { APIHelper } from './wallet-helpers/api-helpers'

describe('Settings page', () => {
  let driver: WebDriver
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    const apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
    await apiHelper.setUpPasswordWalletAndKey(testPassword, 'Wallet 1', 'Key 1')
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await driver.quit()
  })

  it('can navigate to settings and lock the wallet, wallent version is visible', async () => {
    // 1101-BWAL-064 I can see a lock button and when I press it I am logged out and redirect to the login page
    const navPanel = new NavPanel(driver)
    const settingsPage = await navPanel.goToSettings()
    await settingsPage.lockWalletAndCheckLoginPageAppears()
  })
})
