import { WebDriver } from 'selenium-webdriver'
import { RpcMethods } from '../../../frontend/lib/client-rpc-methods'
import { defaultPassword } from './common'
export class APIHelper {
  private driver: WebDriver

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  async generateRecoveryPhrase() {
    return await this.driver.executeScript<string>(async (rpcMethod: string) => {
      const { recoveryPhrase } = await window.client.request(rpcMethod, null)
      return recoveryPhrase
    }, RpcMethods.GenerateRecoveryPhrase)
  }

  async request(method: string) {
    return await this.driver.executeScript<string>(async (method: string) => {
      const resp = await window.request(method)
      return resp
    }, method)
  }

  async lockWallet() {
    return await this.driver.executeScript<string>(async () => {
      const resp = await window.client.request('admin.lock', null)
      return resp
    })
  }

  async login(passphrase = defaultPassword) {
    return await this.driver.executeScript<string>(async (passphrase: string) => {
      const resp = await window.client.request('admin.unlock', { passphrase: passphrase })
      return resp
    }, passphrase)
  }

  async importWallet(walletName: string, recoveryPhrase: string) {
    return await this.driver.executeScript<string>(
      async (walletName: string, recoveryPhrase: string, rpcMethod: string) => {
        const resp = await window.client.request(rpcMethod, {
          recoveryPhrase: recoveryPhrase,
          name: walletName
        })
        return resp
      },
      walletName,
      recoveryPhrase,
      RpcMethods.ImportWallet
    )
  }

  async createPassphrase(passphrase: string) {
    return await this.driver.executeScript<string>(
      async (passphrase: string, rpcMethod: string) => {
        const resp = await window.client.request(rpcMethod, { passphrase: passphrase })
        return resp
      },
      passphrase,
      RpcMethods.CreatePassphrase
    )
  }

  async listConnections() {
    return await this.driver.executeAsyncScript<string>(async (callback: (arg0: any) => void) => {
      const { connections } = await window.client.request('admin.list_connections', null)
      callback(connections)
    })
  }

  async createKey(walletName: string, keyName: string) {
    return await this.driver.executeScript<string>(
      async (walletName: string, keyName: string, rpcMethod: string) => {
        const { publicKey } = await window.client.request(rpcMethod, {
          wallet: walletName,
          name: keyName
        })
        return publicKey
      },
      walletName,
      keyName,
      RpcMethods.GenerateKey
    )
  }

  async createPassphraseAndCheckSuccess(passphrase = 'password1') {
    const resp = await this.createPassphrase(passphrase)
    expect(resp, `expected to create passphrase via the api but the response was not null, instead it was: ${resp}`, {
      showPrefix: false
    }).toBe(null)
  }

  async setUpWalletAndKey(passphrase = 'password1', walletName = 'Wallet 1', keyName = 'Key 1') {
    let resp: any
    await this.createPassphraseAndCheckSuccess(passphrase)

    const recoveryPhrase = await this.generateRecoveryPhrase()
    expect(
      recoveryPhrase,
      `expected to generate recovery phrase via the api but response did not return a phrase, instead it was: ${recoveryPhrase}`,
      { showPrefix: false }
    ).toBeTruthy()

    resp = await this.importWallet(walletName, recoveryPhrase)
    expect(
      resp,
      `expected to be able to import wallet via the api but the response was not null, instead it was: ${resp}`,
      { showPrefix: false }
    ).toBe(null)

    const publicKey = await this.createKey(walletName, keyName)
    expect(
      publicKey,
      `expected to be able to create key for ${walletName} via the api. Expected to find a key in response but the value returned was falsy`,
      { showPrefix: false }
    ).toBeTruthy()

    resp = await this.login(passphrase)
    expect(resp, `expected to login via the api but the response was not null, instead it was: ${resp}`, {
      showPrefix: false
    }).toBe(null)
  }
}
