import { randomBytes } from 'crypto'
import { WebDriver } from 'selenium-webdriver'
import { switchWindowHandles, openNewWindowAndSwitchToIt } from '../selenium-util'
import { testDAppUrl } from './common-wallet-values'

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

  constructor(driver: WebDriver, dappUrl = testDAppUrl, vegaExtensionWindowHandle = '') {
    this.driver = driver
    this.vegaExtensionWindowHandle = vegaExtensionWindowHandle
    this.dappUrl = dappUrl
  }

  async waitForVegaDefined() {
    await this.driver.wait(async () => {
      const result = await this.driver.executeScript('return typeof window.vega !== "undefined";')
      return result === true
    })
  }

  async getVegaExtensionWindowHandle() {
    return this.vegaExtensionWindowHandle
  }

  async getVegaDappWindowHandle() {
    return this.vegaDappWindowHandle
  }

  async openNewWindow() {
    this.vegaDappWindowHandle = await openNewWindowAndSwitchToIt(this.driver)
    await this.driver.get(this.dappUrl)
    await this.waitForVegaDefined()
  }

  async connectWallet(withNewTab = true, closeTab = false) {
    if (!this.vegaExtensionWindowHandle) {
      this.vegaExtensionWindowHandle = await this.driver.getWindowHandle()
    }
    return await this.controlTabs(withNewTab, closeTab, () => this.executeConnectWallet())
  }

  async disconnectWallet(withNewTab = true, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeDisconnectWallet())
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
    expect(
      this.vegaExtensionWindowHandle,
      'there was no window handle defined for the browser extension, this should be explicitly declared in the constructor or automatically assigned when calling connectWallet()'
    ).toBeTruthy()
    if (withNewTab) {
      await this.openNewWindow()
    } else {
      expect(
        this.vegaDappWindowHandle,
        'there was no window handle defined for the dapp. Try executing the api method with the withNewTab param set to true'
      ).toBeTruthy()
      await this.driver.switchTo().window(this.vegaDappWindowHandle)
    }

    const result = await func()
    if (closeTab) {
      await switchWindowHandles(this.driver, true, this.vegaDappWindowHandle)
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

  private async executeDisconnectWallet() {
    return await this.driver.executeScript<string>(async () => {
      if (!window.vega) {
        throw new Error('content script not found')
      }
      try {
        return await window.vega.disconnectWallet()
      } catch (error: any) {
        return `Error: ${error.message}`
      }
    })
  }

  private async executeGetConnectedNetwork() {
    return await this.driver.executeScript<string>(async () => {
      const { chainID } = await window.vega.getChainId()
      return chainID
    })
  }

  private async executeListKeys() {
    let keysArray: Key[] = []
    const keysString = await this.driver.executeScript<string>(async () => {
      try {
        const keys = await window.vega.listKeys()
        return JSON.stringify(keys)
      } catch (error: any) {
        return `Error: ${error.message}`
      }
    })
    if (keysString.includes('Error:')) {
      console.log(keysString)
      return keysArray
    }

    console.log('keys string is ', keysString)
    keysArray = JSON.parse(keysString).keys as Key[]
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

  async connectWalletAndCheckSuccess(withNewTab = true, closeTab = false) {
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
