import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { createWalletAndDriver, navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import { KeyDetails } from './page-objects/key-details'
import { APIHelper } from './helpers/wallet/wallet-api'
import { ExportPrivateKey } from './page-objects/export-private-key'

describe('Key details', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  let keyDetails: KeyDetails
  let exportKey: ExportPrivateKey

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    apiHelper = new APIHelper(driver)
    viewWallet = new ViewWallet(driver)
    keyDetails = new KeyDetails(driver)
    exportKey = new ExportPrivateKey(driver)
    apiHelper.createKey('Wallet 1', 'Key 2')
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 1')
    await keyDetails.checkOnExpectedKeyDetails()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can navigate into the details of a specific key', async () => {
    // 1106-KEYS-015 From the main wallets screen I can click on a key to be shown the list of assets on that key
    // 1125-KEYD-003 I can see the balance of each (the sum across ALL account types)
    // 1125-KEYD-004 There is a button / icon that allows me to expand the view to show the breakdown of all non-zero accounts for that asset
    // 1125-KEYD-005 There is a way to switch between keys (or to easily navigate back to the keys page to achieve this)
    await keyDetails.selectKeyFromDropdownAndConfirmNewKeySelected('Key 2')
    const balance = await keyDetails.getAssetBalance()
    expect(balance).toBeTruthy()
  })

  it('can export private key', async () => {
    await keyDetails.openExportPrivateKeyDialog()
    await exportKey.exportPrivateKey()
    await exportKey.checkPrivateKeyExportedandHidden()
    const privateKey = await exportKey.revealPrivateKeyAndGetText()
    expect(privateKey).toBeTruthy()
  })

  it('cannot export private key when password incorrect, can be corrected after', async () => {
    await keyDetails.openExportPrivateKeyDialog()
    await exportKey.exportPrivateKey('wrong password')
    await exportKey.checkForPasswordError()
    await exportKey.exportPrivateKey()
    await exportKey.checkPrivateKeyExportedandHidden()
  })
})
