import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage, testDAppUrl } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { NavPanel } from './page-objects/navpanel'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { Telemetry } from './page-objects/telemetry-opt-in'

describe('Connect wallet', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let telemetry: Telemetry

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    telemetry = new Telemetry(driver)
    apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can approve a connection to the wallet and return to previously active view', async () => {
    // 1103-CONN-008 There is a visual way to understand that a connection has been successful
    // 1103-CONN-009 If the had the browser wallet open when I instigated the connection request, the browser wallet returns your view to where you were before the request came in
    await setUpWalletAndKey()
    console.log('dummy change')
    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    const responsePromise = await vegaAPI.connectWallet()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess() // Perform the necessary user interaction
    const response = await responsePromise
    expect(response).toBe(null)
    await settings.checkOnSettingsPage()
  })

  it('can reject a connection to the wallet and return to previously active view', async () => {
    await setUpWalletAndKey()
    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
    await connectWallet.checkOnConnectWallet()
    await connectWallet.denyConnection()
    await settings.checkOnSettingsPage()
  })

  it('I can call client.disconnect_wallet with no prior connection and get a null response', async () => {
    // 1104-DCON-002 can call client.disconnect_wallet with no prior connection and get a null response
    const vega = new VegaAPI(driver, testDAppUrl, await driver.getWindowHandle())
    const disconnectWalletResponse = await vega.disconnectWallet()
    expect(disconnectWalletResponse).toBe(null)
  })

  it('can disconnect wallet via dapp and reconnect without needing approval', async () => {
    // 1104-DCON-001 I can call client.disconnect_wallet after successfully calling client.connect_wallet
    // 1104-DCON-003 A dapp can disconnect the current active connection (not it's pre-approved status i.e. the dapp can re-instate the connection without further approval)
    await setUpWalletAndKey()
    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    const connectionResult = await vegaAPI.getConnectionResult()
    expect(connectionResult).toBe(null)
    let originalKeys = await vegaAPI.listKeys()
    expect(originalKeys.length).toBe(1)
    const disconnectResponse = await vegaAPI.disconnectWallet()
    expect(disconnectResponse).toBe(null)
    const keysAfterDisconnect = await vegaAPI.listKeys()
    expect(keysAfterDisconnect.length).toBe(0)
    await vegaAPI.connectWallet()
    const keysAfterReconnect = await vegaAPI.listKeys()
    expect(keysAfterReconnect).toEqual(originalKeys)
    await settings.checkOnSettingsPage()
  })

  it('queues a connection request for when I have finished onboarding', async () => {
    // 1103-CONN-010 When I try to connect to the wallet I've made during onboarding but have not "completed" onboarding, I cannot see the connection request until I've completed onboarding (it is queued in the background)
    await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
    const getStarted = new GetStarted(driver)
    const passwordPage = await getStarted.getStarted()
    await passwordPage.createPassword()
    const creatWallet = new CreateAWallet(driver)
    await creatWallet.createNewWallet()
    const secureYouWallet = new SecureYourWallet(driver)
    await secureYouWallet.revealRecoveryPhrase(true)
    await telemetry.optOut()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
  })

  it('does not need to reconnect to the wallet if I navigate away from my current page, api still shows connection and dapp can still see public key', async () => {
    // 1103-CONN-007 When I go away from the extension and come back to the connected site, the browser extension remembers the connection and does not ask me to reconnect
    await setUpWalletAndKey()
    await vegaAPI.connectWallet()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    await viewWallet.checkOnViewWalletPage()
    expect(await vegaAPI.getConnectionResult()).toBe(null)
    let connections = await apiHelper.listConnections()
    expect(
      connections.length,
      `expected to have 1 active connection to the wallet, but found ${connections.length}`
    ).toBe(1)
    await driver.get('https://google.co.uk')
    await navigateToLandingPage(driver)
    connections = await apiHelper.listConnections()
    expect(
      connections.length,
      `expected to still have 1 active connection to the wallet, but found ${connections.length}`
    ).toBe(1)
    await vegaAPI.connectWallet()
    await viewWallet.checkOnViewWalletPage()
    expect(await vegaAPI.getConnectionResult()).toBe(null)
    await assertNumberOfKeysVisibleToDApp(1)
    await viewWallet.checkOnViewWalletPage()
  })

  it('dapp can see any wallet keys I add after connecting', async () => {
    // 1103-CONN-005 All new connections are for all keys in a wallet and all future keys added to the wallet
    await setUpWalletAndKey()
    await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
    await connectWallet.approveConnectionAndCheckSuccess()
    await assertNumberOfKeysVisibleToDApp(1)
    await viewWallet.createNewKeyPair()
    await assertNumberOfKeysVisibleToDApp(2)
    await viewWallet.checkOnViewWalletPage()
  })

  async function setUpWalletAndKey() {
    await apiHelper.setUpWalletAndKey()
    await navigateToLandingPage(driver)
  }

  async function assertNumberOfKeysVisibleToDApp(expectedNumber: number) {
    const keys = await vegaAPI.listKeys()
    expect(keys.length, `expected to be able to view 2 wallet keys, instead found ${keys.length}`).toBe(expectedNumber)
  }
})
