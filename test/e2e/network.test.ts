import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { VegaAPI } from './wallet-helpers/vega-api'
import { VoteSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/VoteSubmission'
import { Value } from '@vegaprotocol/protos/dist/vega/Vote/Value'
import { DelegateSubmission } from '@vegaprotocol/protos/dist/vega/commands/v1/DelegateSubmission'

describe('Network tests', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  const testPassword = 'password1'

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    const apiHelper = new APIHelper(driver)
    await apiHelper.setUpWalletAndKey(testPassword, 'Wallet 1', 'Key 1')
    await navigateToLandingPage(driver)
    const vega = new VegaAPI(driver)
    const connection = await vega.connectWallet()
    console.log('connection', connection)
    const network = await vega.getConnectedNetwork()
    console.log(network)
    const keys = await vega.listKeys()
    console.log('keys', keys)
    let delegate: DelegateSubmission = {
      nodeId: '14435',
      amount: '4444'
    }
    const transaction = await vega.sendDelegateStakeTransaction(keys[0].publicKey, delegate)
    console.log(transaction)
  })

  async function openNewWindowAndSwitchToIt(driver: WebDriver) {
    await driver.executeScript('window.open();')
    const handles = await driver.getAllWindowHandles()
    await driver.switchTo().window(handles[1])
  }

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    //await driver.quit()
  })

  it('defaults to the fairground network', async () => {
    // 1101-BWAL-027 The browser wallet defaults to use the Fairground network
    // 1101-BWAL-028 I can see which vega network the browser wallet is connected to from the view wallet page
    const connectedNetwork = await viewWallet.getNetworkConnectedTo()
    expect(connectedNetwork.toLowerCase()).toBe('fairground')
  })
})
