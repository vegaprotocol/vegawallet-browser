import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './helpers/driver'
import { NavPanel } from './page-objects/navpanel'
import { ExtensionHeader } from './page-objects/extension-header'
import { createWalletAndDriver, navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import { ViewWallet } from './page-objects/view-wallet'
import { testingNetwork } from '../../config/well-known-networks'
import { KeyDetails } from './page-objects/key-details'

describe('Switch network', () => {
  let driver: WebDriver
  let navPanel: NavPanel
  let header: ExtensionHeader
  let viewWallet: ViewWallet
  let keyDetails: KeyDetails

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    navPanel = new NavPanel(driver)
    viewWallet = new ViewWallet(driver)
    header = new ExtensionHeader(driver)
    keyDetails = new KeyDetails(driver)
    await navigateToExtensionLandingPage(driver)
    await viewWallet.openKeyDetails('Key 0')
    await keyDetails.checkOnExpectedKeyDetails()
  })
  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('reloads data and adjusts links when network is switched', async () => {
    // 1142-NWSW-007 Data is reloaded when switching networks
    // 1142-NWSW-008 Links are adjusted based on config when switching networks
    const network = await header.getConnectedNetwork()
    expect(network).toBe(testingNetwork.name)
    let linkBeforeNameChange = await keyDetails.getVegaExplorerLink()
    await header.switchNetwork('Test 2')
    const newNetwork = await header.getConnectedNetwork()
    expect(newNetwork).toBe('Test 2')
    let linkAfterNameChange = await keyDetails.getVegaExplorerLink()
    expect(linkBeforeNameChange).not.toBe(linkAfterNameChange)
    expect(linkAfterNameChange).toContain('https://different-explorer.vega.xyz')
  })
})
