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
      // this code returns the recovery phrase just fine for now, want to use the JsonRPC client
      const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime
      const port = runtime.connect({ name: 'popup' })
      const responsePromise = new Promise<string>((resolve) => {
        port.onMessage.addListener((msg: any) => {
          console.log('promise: ', msg)
          resolve(msg.result.recoveryPhrase)
        })
      })
      await port.postMessage({
        jsonrpc: '2.0',
        id: 1,
        method: 'admin.generate_recovery_phrase',
        params: null
      })

      const recoveryPhrase = await responsePromise
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
