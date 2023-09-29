import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { createWalletAndDriver, navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import { KeyDetails } from './page-objects/key-details'
import { APIHelper } from './helpers/wallet/wallet-api'

describe('View wallet page', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  let keyDetails: KeyDetails

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    apiHelper = new APIHelper(driver)
    viewWallet = new ViewWallet(driver)
    keyDetails = new KeyDetails(driver)
    apiHelper.createKey('Wallet 1', 'Key 2')
    await navigateToExtensionLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can navigate into the details of a specific key', async () => {
    // 1125-KEYD-003 I can see the balance of each (the sum across ALL account types)
    // 1125-KEYD-004 There is a button / icon that allows me to expand the view to show the breakdown of all non-zero accounts for that asset
    // 1125-KEYD-005 There is a way to switch between keys (or to easily navigate back to the keys page to achieve this)
    // 1125-KEYD-006 When switching, I can see key name, key icon and key address (truncated)
    await viewWallet.openKeyDetails('Key 1')
    await keyDetails.checkOnExpectedKeyDetails()
    await keyDetails.selectKeyFromDropdownAndConfirmNewKeySelected('Key 2')
    const balance = await keyDetails.getAssetBalance()
    expect(balance).toBeTruthy()
  })
})
