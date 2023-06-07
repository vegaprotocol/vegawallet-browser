import { randomBytes } from 'crypto'
import { TouchSequence, WebDriver } from 'selenium-webdriver'
import { Page } from '../../../src/components/page/page'
import { closeCurrentWindowAndSwitchToPrevious, openNewWindowAndSwitchToIt } from '../selenium-util'

interface Key {
  index: number
  name: string
  publicKey: string
}

export class VegaAPI {
  private driver: WebDriver
  private vegaDappWindowHandle = ''
  private vegaExtensionWindowHandle: string
  private dappUrl: string

  constructor(driver: WebDriver, vegaExtensionWindowHandle: string, dappUrl: 'https://google.co.uk') {
    this.driver = driver
    this.vegaExtensionWindowHandle = vegaExtensionWindowHandle
    this.dappUrl = dappUrl
  }

  async openNewWindow() {
    this.vegaDappWindowHandle = await openNewWindowAndSwitchToIt(this.driver)
    this.driver.get(this.dappUrl)
  }

  async connectWallet(withNewTab = true, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeConnectWallet())
  }

  async getConnectedNetwork(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeGetConnectedNetwork())
  }

  async listKeys(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeListKeys())
  }

  async sendTransaction(publicKey: string, transaction: any, withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeSendTransaction(publicKey, transaction))
  }

  async getTransactionResult(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeGetTransactionResult())
  }

  async getConnectionResult(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeGetConnectionResult())
  }

  private async controlTabs<T>(withNewTab: boolean, closeTab: boolean, func: () => Promise<T>): Promise<T> {
    if (withNewTab) {
      await this.openNewWindow()
    } else {
      expect(
        this.vegaDappWindowHandle,
        'there was no window handle defined for the dapp. Try executing the api method with the withNewTab param set to create one'
      ).toBeTruthy()
      await this.driver.switchTo().window(this.vegaDappWindowHandle)
    }

    const result = await func()
    if (closeTab) {
      await closeCurrentWindowAndSwitchToPrevious(this.driver, this.vegaDappWindowHandle)
    } else {
      this.driver.switchTo().window(this.vegaExtensionWindowHandle)
    }
    return result
  }

  private async executeConnectWallet() {
    return await this.driver.executeScript(async () => {
      if (!window.vega) {
        throw new Error('content script not found')
      }
      window.connectWalletResult = window.vega.connectWallet()
    })
  }

  private async executeGetConnectedNetwork() {
    return await this.driver.executeScript<string>(async () => {
      const { chainID } = await window.vega.getChainId()
      return chainID
    })
  }

  private async executeListKeys() {
    const keysString = await this.driver.executeScript<string>(async () => {
      const keys = await window.vega.listKeys()
      return JSON.stringify(keys)
    })

    const keysArray = JSON.parse(keysString).keys as Key[]

    return keysArray
  }

  private async executeSendTransaction(publicKey: string, transaction: any) {
    await this.driver.executeScript<string>(
      async (publicKey: string, transaction: any) => {
        window.sendTransactionResult = window.vega.sendTransaction({
          sendingMode: 'TYPE_SYNC',
          publicKey: publicKey,
          transaction: transaction
        })
      },
      publicKey,
      transaction
    )
  }

  private async executeGetTransactionResult() {
    return await this.driver.executeScript<string>(async () => {
      try {
        return await window.sendTransactionResult
      } catch (error: any) {
        return error.message
      }
    })
  }

  private async executeGetConnectionResult() {
    return await this.driver.executeScript<string>(async () => {
      try {
        return await window.connectWalletResult
      } catch (error: any) {
        return error.message
      }
    })
  }

  async connectWalletAndCheckSuccess(withNewTab = false, closeTab = false) {
    const resp = await this.connectWallet(withNewTab, closeTab)
    expect(resp, `expected null response to indicate a successful connection but instead it was ${resp}`).toBe(null)
  }

  //TODO- move to be in a more generic helper - maybe use dev code? This must exist somewhere
  async generateEncodedHexPublicKey() {
    const publicKeyBytes = randomBytes(32)
    const hexPublicKey = publicKeyBytes.toString('hex')
    return hexPublicKey
  }
}
