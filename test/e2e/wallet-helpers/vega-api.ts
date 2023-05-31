import { randomBytes } from 'crypto'
import { WebDriver } from 'selenium-webdriver'

interface Key {
  index: number
  name: string
  publicKey: string
}

export class VegaAPI {
  private driver: WebDriver

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  async connectWallet() {
    return this.driver.executeScript(async () => {
      if (!window.vega) {
        throw new Error('content script not found')
      }
      window.connectWalletResult = window.vega.connectWallet()
    })
  }

  async connectWalletAndCheckSuccess() {
    const resp = await this.connectWallet()
    expect(resp, `expected null response to indicate a successful connection but instead it was ${resp}`).toBe(null)
  }

  async getConnectedNetwork() {
    return await this.driver.executeScript<string>(async () => {
      const { chainID } = await window.vega.getChainId()
      return chainID
    })
  }

  async listKeys() {
    const keysString = await this.driver.executeScript<string>(async () => {
      const keys = await window.vega.listKeys()
      return JSON.stringify(keys)
    })

    const keysArray = JSON.parse(keysString).keys as Key[]

    return keysArray
  }

  //TODO- move to be in a more generic helper - maybe use dev code? This must exist somewhere
  async generateEncodedHexPublicKey() {
    const publicKeyBytes = randomBytes(32)
    const hexPublicKey = publicKeyBytes.toString('hex')
    return hexPublicKey
  }

  async sendTransaction(publicKey: string, transaction: any) {
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

  async getTransactionResult() {
    return await this.driver.executeScript<string>(async () => {
      try {
        return await window.sendTransactionResult
      } catch (error: any) {
        return error.message
      }
    })
  }

  async getConnectionResult() {
    return await this.driver.executeScript<string>(async () => {
      try {
        return await window.connectWalletResult
      } catch (error: any) {
        return error.message
      }
    })
  }
}
