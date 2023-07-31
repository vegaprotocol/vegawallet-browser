import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage, createWalletAndDriver } from './wallet-helpers/common'
import { NavPanel } from './page-objects/navpanel'

describe('View wallet page', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    viewWallet = new ViewWallet(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can create new key pair in the view wallet screen', async () => {
    // 1106-KEYS-006 can create a new key pair from the wallet view
    // 1106-KEYS-007 New key pairs are assigned a name automatically "Key 1" "Key 2" etc.
    // 1106-KEYS-008 New key pairs are listed in order they were created - oldest first
    // 1106-KEYS-001 I can see a list of the keys in my wallet
    await viewWallet.createNewKeyPair()
    expect(await viewWallet.getWalletKeys()).toMatchObject(['Key 1', 'Key 2'])

    await viewWallet.createNewKeyPair()
    expect(await viewWallet.getWalletKeys()).toMatchObject(['Key 1', 'Key 2', 'Key 3'])

    await navigateToLandingPage(driver)
    expect(await viewWallet.getWalletKeys()).toMatchObject(['Key 1', 'Key 2', 'Key 3'])
  })

  it('can copy public key to clipboard and see where I am in the extension', async () => {
    // 1106-KEYS-002 I can copy the public key ID to my clipboard
    // 1106-KEYS-004 I can see where I am in the app when viewing my wallet and key pair(s)
    const navPanel = new NavPanel(driver)
    await navPanel.checkOnExpectedNavigationTab('Wallets')

    await viewWallet.copyPublicKeyToClipboard()
    // could not get checking clipboard to work in firefox besides clicking the button. Chrome we can check clipboard contents
    if (process.env.BROWSER === 'chrome') {
      const copiedKey = await viewWallet.readClipboardChrome()
      const displayedKey = (await viewWallet.getVisiblePublicKeyText()).substring(0, 6)
      expect(
        copiedKey,
        `expected the copied key to contain ${displayedKey}, but instead it was ${copiedKey}`
      ).toContain(displayedKey)
    }
  })
})
