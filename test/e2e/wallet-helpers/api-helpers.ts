import { WebDriver } from 'selenium-webdriver'
import { useLogger } from '@vegaprotocol/react-helpers'
import JSONRPCClient from '../../../src/lib/json-rpc-client'
import { CreateClient } from '../../../src/contexts/json-rpc/json-rpc-provider'

export class APIHelper {
  private driver: WebDriver

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  async getClient() {
    let client: JSONRPCClient
    await this.driver.executeAsyncScript(async () => {
      const clientLogger = useLogger({
        application: 'E2E tests',
        tags: ['global', 'json-rpc-client']
      })
      client = CreateClient(clientLogger)
      return client
    })
  }

  async generateRecoveryPhrase(client: JSONRPCClient) {
    console.log('client', client)
    let resp: any
    await this.driver.executeScript(async () => {
      resp = await client.request('admin.generate_recovery_phrase', null)
    })
    return resp
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
