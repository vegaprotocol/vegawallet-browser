import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { NavPanel } from './page-objects/navpanel'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'

describe('Connect wallet', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    vegaAPI = new VegaAPI(driver)
    connectWallet = new ConnectWallet(driver)
    apiHelper = new APIHelper(driver)
    await navigateToLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    //await driver.quit()
  })

  it('can approve a connection to the wallet and return to previously active view', async () => {
    // 1101-BWAL-040 There is a visual way to understand that a connection has been successful
    // 1101-BWAL-042 If the had the browser wallet open when I instigated the connection request, the browser wallet returns your view to where you were before the request came in
    await setUpWalletAndKey()
    const navPanel = new NavPanel(driver)
    const settings = await navPanel.goToSettings()
    const responsePromise = vegaAPI.connectWallet()
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess() // Perform the necessary user interaction
    const response = await responsePromise
    console.log(response)
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

  it('queues a connection request for when I have finished onboarding', async () => {
    // 1101-BWAL-043 When I try to connect to the wallet I've made during onboarding but have not "completed" onboarding, I cannot see the connection request until I've completed onboarding (it is queued in the background)
    await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
    const getStarted = new GetStarted(driver)
    const passwordPage = await getStarted.getStarted()
    await passwordPage.createPassword(testPassword)
    const creatWallet = new CreateAWallet(driver)
    await creatWallet.createNewWallet()
    const secureYouWallet = new SecureYourWallet(driver)
    await secureYouWallet.revealRecoveryPhrase(true)
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
  })

  const wait = (milliseconds: number) => new Promise<void>((resolve) => setTimeout(resolve, milliseconds))

  it('does not need to reconnect to the wallet if I navigate away from my current page, api still shows connection and dapp can still see public key', async () => {
    // 1101-BWAL-039 When I go away from the extension and come back to the connected site, the browser extension remembers the connection and does not ask me to reconnect
    await setUpWalletAndKey()
    await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
    await connectWallet.checkOnConnectWallet()
    await connectWallet.approveConnectionAndCheckSuccess()
    await viewWallet.checkOnViewWalletPage()
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
    await assertNumberOfKeysVisibleToDApp(1)
    await viewWallet.checkOnViewWalletPage()
  })

  it('dapp can see any wallet keys I add after connecting', async () => {
    // 1101-BWAL-037 All new connections are for all keys in a wallet and all future keys added to the wallet
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
