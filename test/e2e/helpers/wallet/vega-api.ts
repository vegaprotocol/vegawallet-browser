import { randomBytes } from 'crypto'
import { WebDriver } from 'selenium-webdriver'
import { testDAppUrl } from './common-wallet-values'
import { openNewWindowAndSwitchToIt, switchWindowHandles } from '../selenium-util'

interface Key {
  index: number
  name: string
  publicKey: string
}

export class VegaAPI {
  public driver: WebDriver
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

  async openNewWindow(closeOld = false) {
    this.vegaDappWindowHandle = await openNewWindowAndSwitchToIt(this.driver, closeOld)
    await this.driver.get(this.dappUrl)
    await this.waitForVegaDefined()
    return await this.driver.getWindowHandle()
  }

  async connectWallet(withNewTab = true, closeTab = false, switchBackToOriginalTab = true) {
    if (!this.vegaExtensionWindowHandle) {
      this.vegaExtensionWindowHandle = await this.driver.getWindowHandle()
    }
    return await this.controlTabs(withNewTab, closeTab, () => this.executeConnectWallet(), switchBackToOriginalTab)
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

  async listNetworks(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeListNetworks())
  }

  async addEventListener(event: string, withNewTab = false, closeTab = false) {
    if (!this.vegaExtensionWindowHandle) {
      this.vegaExtensionWindowHandle = await this.driver.getWindowHandle()
    }
    return await this.controlTabs(withNewTab, closeTab, () => this.executeAddEventListeners(event))
  }

  async removeEventListener(event: string, withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeRemoveEventListeners(event))
  }

  async sendTransaction(
    publicKey: string,
    transaction: any,
    withNewTab = false,
    closeTab = false,
    switchBackToOriginalTab = true
  ) {
    return await this.controlTabs(
      withNewTab,
      closeTab,
      () => this.executeSendTransaction(publicKey, transaction),
      switchBackToOriginalTab
    )
  }

  async getTransactionResult(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeGetTransactionResult())
  }

  async getConnectionResult(withNewTab = false, closeTab = false) {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeGetConnectionResult())
  }

  async getEventResult(
    event: string,
    withNewTab = false,
    closeTab = false
  ): Promise<{ events: any[]; callCounter: number }> {
    return await this.controlTabs(withNewTab, closeTab, () => this.executeGetEventResult(event))
  }

  private async controlTabs<T>(
    withNewTab: boolean,
    closeTab: boolean,
    func: () => Promise<T>,
    switchBackToOriginalTab = true
  ): Promise<T> {
    expect(
      this.vegaExtensionWindowHandle,
      'there was no window handle defined for the browser extension, this should be explicitly declared in the constructor or automatically assigned when calling connectWallet()'
    ).toBeTruthy()
    if (withNewTab) {
      this.vegaDappWindowHandle = await this.openNewWindow()
    } else {
      expect(
        this.vegaDappWindowHandle,
        'there was no window handle defined for the dapp. Try executing the api method with the withNewTab param set to true'
      ).toBeTruthy()
      await this.driver.switchTo().window(this.vegaDappWindowHandle)
    }

    const result = await func()
    if (closeTab) {
      await switchWindowHandles(this.driver, true, this.vegaExtensionWindowHandle, this.vegaDappWindowHandle)
    } else if (switchBackToOriginalTab) {
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
      return keysArray
    }
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

  private async executeAddEventListeners(event: string) {
    return await this.driver.executeScript<string>(async (event: string) => {
      try {
        window.__events__ = window.__events__ || {}
        if (window.__events__[event]) {
          throw new Error(`There is already a listener for ${event}`)
        }
        window.__events__[event] = {
          callCounter: 0,
          result: [],
          listener: (result: any) => {
            window.__events__[event].result.push(result ?? null) // undefined is not serialisable but null is
            window.__events__[event].callCounter++
          }
        }
        return window.vega.addEventListener(event, window.__events__[event].listener)
      } catch (error: any) {
        return error.message
      }
    }, event)
  }

  private async executeRemoveEventListeners(event: string) {
    return await this.driver.executeScript<string>(async (event: string) => {
      try {
        const res = window.vega.removeEventListener(event, window.__events__[event].listener)
        delete window.__events__[event]
        return res
      } catch (error: any) {
        return error.message
      }
    }, event)
  }

  private async executeGetEventResult(event: string): Promise<{ events: any[]; callCounter: number }> {
    const events = await this.driver.executeScript<string>(async (event: string) => {
      try {
        return JSON.stringify([
          window.__events__[event].result.splice(0, window.__events__[event].result.length),
          window.__events__[event].callCounter
        ])
      } catch (error: any) {
        return error.message
      }
    }, event)

    const res = JSON.parse(events)

    return { events: res[0], callCounter: res[1] }
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
