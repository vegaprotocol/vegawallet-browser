import { WebDriver } from 'selenium-webdriver'
import JSONRPCClient from '../../../src/lib/json-rpc-client'

export class APIHelper {
  private driver: WebDriver

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  async generateRecoveryPhrase() {
    return await this.driver.executeScript<string>(async () => {
      // @ts-ignore
      const { recoveryPhrase } = await window.client.request('admin.generate_recovery_phrase', null)
      return recoveryPhrase
    })
  }

  async importWallet(client: JSONRPCClient, recoveryPhrase: string) {
    let resp: any
    await this.driver.executeScript(async () => {
      resp = await client.request('admin.import_wallet', {
        recovery_phrase: recoveryPhrase,
        name: 'Wallet import'
      })
    })
    return resp
  }
}
