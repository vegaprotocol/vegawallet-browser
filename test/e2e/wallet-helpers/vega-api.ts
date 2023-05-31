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
    return await this.driver.executeScript(async () => {
      console.log('I have been called')
      if (!window.vega) {
        throw new Error('content script not found')
      }
      window.vega.connectWallet()

      console.log('connected!')
      // return connectWallet
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

  async sendTransaction(publicKey: string, transaction: any) {
    return await this.driver.executeScript<string>(
      async (publicKey: string, transaction: any) => {
        const { chainID } = await window.vega.sendTransaction({
          sendingMode: 'TYPE_SYNC',
          publicKey: publicKey,
          transaction: transaction
        })
        return chainID
      },
      publicKey,
      transaction
    )
  }
}
