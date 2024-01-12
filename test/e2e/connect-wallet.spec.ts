import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './helpers/driver'
import { ViewWallet } from './page-objects/view-wallet'
import { APIHelper } from './helpers/wallet/wallet-api'
import { VegaAPI } from './helpers/wallet/vega-api'
import { ConnectWallet } from './page-objects/connect-wallet'
import { NavPanel } from './page-objects/navpanel'
import { GetStarted } from './page-objects/get-started'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { Telemetry } from './page-objects/telemetry-opt-in'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { testDAppUrl } from './helpers/wallet/common-wallet-values'
import { fairground, testingNetwork } from '../../config/well-known-networks'
import { ListConnections } from './page-objects/list-connections'

describe('Connect wallet', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let vegaAPI: VegaAPI
  let connectWallet: ConnectWallet
  let apiHelper: APIHelper
  let telemetry: Telemetry
  let connections: ListConnections

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    const vegaHandle = await driver.getWindowHandle()
    vegaAPI = new VegaAPI(driver, undefined, vegaHandle)
    connectWallet = new ConnectWallet(driver)
    telemetry = new Telemetry(driver)
    apiHelper = new APIHelper(driver)
    connections = new ListConnections(driver)
    await navigateToExtensionLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })
  describe('Default chainId', () => {
    it('can approve a connection to the wallet and return to previously active view', async () => {
      // 1103-CONN-008 There is a visual way to understand that a connection has been successful
      // 1103-CONN-009 If the had the browser wallet open when I instigated the connection request, the browser wallet returns your view to where you were before the request came in
      // 1137-CLNT-002 If I connect and it is approved then I do not get an error
      // 1137-CLNT-009 If I connect and it is approved then isConnected is true
      await setUpWalletAndKey(driver)
      const navPanel = new NavPanel(driver)
      const settings = await navPanel.goToSettings()
      const responsePromise = await vegaAPI.connectWallet()
      await connectWallet.checkOnConnectWallet()
      await connectWallet.approveConnectionAndCheckSuccess() // Perform the necessary user interaction
      const response = await responsePromise
      expect(response).toBe(null)
      await vegaAPI.getIsConnected()
      const isConnectedResult = await vegaAPI.getIsConnectedResult()
      expect(isConnectedResult).toBe(true)
      await settings.checkOnSettingsPage()
    })

    it('approving and removing a connection asks me to connect again', async () => {
      // 1137-CLNT-014 If I connect and it is approved and use the UI to disconnect then I am required to approve the connection again
      await setUpWalletAndKey(driver)
      const navPanel = new NavPanel(driver)
      const settings = await navPanel.goToSettings()
      const responsePromise = await vegaAPI.connectWallet()
      await connectWallet.checkOnConnectWallet()
      await connectWallet.approveConnectionAndCheckSuccess() // Perform the necessary user interaction
      const response = await responsePromise
      expect(response).toBe(null)
      {
        await vegaAPI.getIsConnected()
        const isConnectedResult = await vegaAPI.getIsConnectedResult()
        expect(isConnectedResult).toBe(true)
      }
      await navPanel.goToListConnections()
      await connections.disconnectConnection('https://vegaprotocol.github.io')
      expect(await connections.connectionsExist()).toBe(false)

      {
        await vegaAPI.getIsConnected()
        const isConnectedResult = await vegaAPI.getIsConnectedResult()
        expect(isConnectedResult).toBe(false)
      }
      await vegaAPI.connectWallet()
      await connectWallet.checkOnConnectWallet()
      await connectWallet.approveConnectionAndCheckSuccess()
      {
        await vegaAPI.getIsConnected()
        const isConnectedResult = await vegaAPI.getIsConnectedResult()
        expect(isConnectedResult).toBe(true)
      }
    })

    it('connects to the default chainId for the wallet if not chainId is specified', async () => {
      // 1137-CLNT-005 If I connect without a chain Id I am connected to the default network for that extension
      await setUpWalletAndKey(driver)
      await vegaAPI.connectWallet()
      await connectWallet.checkOnConnectWallet()
      await connectWallet.approveConnectionAndCheckSuccess()
      const connections = await apiHelper.listConnections()
      expect(
        connections.length,
        `expected to still have 1 active connection to the wallet, but found ${connections.length}`
      ).toBe(1)
      expect(connections[0].chainId).toBe('test-chain-id')
    })

    it('can reject a connection to the wallet and return to previously active view', async () => {
      // 1137-CLNT-001 If I connect and it is not approved then I get an error telling me the user rejected the connection
      // 1137-CLNT-003 If I connect and it is rejected I am not connected
      // 1137-CLNT-010 If I connect and it is not approved then isConnected is false
      await setUpWalletAndKey(driver)
      const navPanel = new NavPanel(driver)
      const settings = await navPanel.goToSettings()
      await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
      await connectWallet.checkOnConnectWallet()
      await connectWallet.denyConnection()
      const connectionResult = await vegaAPI.getConnectionResult()
      expect(connectionResult).toBe('Connection denied')
      await vegaAPI.getIsConnected()
      const isConnectedResult = await vegaAPI.getIsConnectedResult()
      expect(isConnectedResult).toBe(false)
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
      // 1137-CLNT-004 If I connect and it is approved and I try to connect again then the connection is automatically approved
      // 1137-CLNT-012 If I call the client.disconnect_wallet method nothing happens
      // 1137-CLNT-011 If I connect and it is approved and the user disconnects then isConnected is true
      await setUpWalletAndKey(driver)
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
      expect(keysAfterDisconnect.length).toBe(1)
      await vegaAPI.connectWallet()
      const keysAfterReconnect = await vegaAPI.listKeys()
      expect(keysAfterReconnect).toEqual(originalKeys)
      await vegaAPI.getIsConnected()
      const isConnectedResult = await vegaAPI.getIsConnectedResult()
      expect(isConnectedResult).toBe(true)
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
      await setUpWalletAndKey(driver)
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
      await navigateToExtensionLandingPage(driver)
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
      await setUpWalletAndKey(driver)
      await vegaAPI.connectWallet() //change this to assert success when connectWallet is fixed
      await connectWallet.approveConnectionAndCheckSuccess()
      await assertNumberOfKeysVisibleToDApp(1)
      await viewWallet.createNewKeyPair()
      await assertNumberOfKeysVisibleToDApp(2)
      await viewWallet.checkOnViewWalletPage()
    })

    async function assertNumberOfKeysVisibleToDApp(expectedNumber: number) {
      const keys = await vegaAPI.listKeys()
      expect(keys.length, `expected to be able to view 2 wallet keys, instead found ${keys.length}`).toBe(
        expectedNumber
      )
    }
  })

  describe('Specific chainId', () => {
    it('throws error if I attempt to connect to a non-existent chainId', async () => {
      // 1137-CLNT-006 If I connect with a non-existent chain Id I get an error telling me the network was not found
      await setUpWalletAndKey(driver)
      const api = new VegaAPI(driver, 'https://google.co.uk', await driver.getWindowHandle())
      await api.connectWallet(true, false, true, { chainId: 'some-non-existent-chain-id' })
      const result = await api.getConnectionResult()
      expect(result).toBe('Unknown chain ID')
    })

    it('connects to the requested chainId', async () => {
      // 1137-CLNT-007 If I connect with a chainId I am connected to that chain
      await setUpWalletAndKey(driver)
      const api = new VegaAPI(driver, 'https://google.co.uk', await driver.getWindowHandle())
      await api.connectWallet(true, false, true, { chainId: testingNetwork.chainId })

      await connectWallet.checkOnConnectWallet()
      await connectWallet.approveConnectionAndCheckSuccess()
      const connections = await apiHelper.listConnections()
      expect(
        connections.length,
        `expected to still have 1 active connection to the wallet, but found ${connections.length}`
      ).toBe(1)
      expect(connections[0].chainId).toBe('test-chain-id')
    })

    it('prevents connection to a new chainId from a dApp that is already connected', async () => {
      // 1137-CLNT-007 If I connect with a chainId and then connect again with a different chainId then I get an error indicating that I am already connected to a different chain
      await setUpWalletAndKey(driver)
      const api = new VegaAPI(driver, 'https://google.co.uk', await driver.getWindowHandle())
      await api.connectWallet(true, false, true, { chainId: testingNetwork.chainId })
      await connectWallet.checkOnConnectWallet()
      await connectWallet.approveConnectionAndCheckSuccess()
      await driver.switchTo().window(await api.getVegaDappWindowHandle())
      await api.connectWallet(true, false, true, { chainId: fairground.chainId })
      const result = await api.getConnectionResult()
      expect(result).toBe('Mismatching chain ID')
    })
  })
})
