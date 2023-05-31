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
    return await this.driver.executeScript(async () => {
      if (!window.vega) {
        throw new Error('content script not found')
      }
      window.vega.connectWallet()
      // return connectWallet - re-enable this before merging this PR after backend bugfix
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
    const publicKeyBytes = randomBytes(32) // Generate 32 bytes of random data
    const hexPublicKey = publicKeyBytes.toString('hex') // Convert the random bytes to hex string
    return hexPublicKey
  }

  async sendTransaction(publicKey: string, transaction: any) {
    try {
      const response = await this.driver.executeScript<string>(
        async (publicKey: string, transaction: any) => {
          return await window.vega.sendTransaction({
            sendingMode: 'TYPE_SYNC',
            publicKey: publicKey,
            transaction: transaction
          })
        },
        publicKey,
        transaction
      )
      return {
        success: true,
        response: response
      }
    } catch (error: any) {
      return {
        success: false,
        response: error.message
      }
    }
  }

  async sendTransactionAndCheckOutcome(
    publicKey: string,
    transaction: any,
    expectSuccess = true,
    expectedError?: string
  ) {
    const outcome = await this.sendTransaction(publicKey, transaction)
    expect(
      outcome.success,
      `the sendTransaction request was not successful, here is the response: \n"${outcome.response}`
    ).toBe(expectSuccess)

    if (expectedError) {
      expect(
        outcome.response,
        `the sendTransaction request did not return the expected error: ${expectedError}`
      ).toContain(expectedError)
    }
  }
}
