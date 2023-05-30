import { WebDriver } from 'selenium-webdriver'
export class APIHelper {
  private driver: WebDriver

  constructor(driver: WebDriver) {
    this.driver = driver
  }

  async generateRecoveryPhrase() {
    return await this.driver.executeScript<string>(async () => {
      const { recoveryPhrase } = await window.client.request('admin.generate_recovery_phrase', null)
      return recoveryPhrase
    })
  }

  async login(passphrase: string) {
    // TODO don't hardcode passphrase
    return await this.driver.executeScript<string>(async (passphrase: string) => {
      await window.client.request('admin.unlock', { passphrase: passphrase })
    }, passphrase)
  }

  async importWallet(walletName: string, recoveryPhrase: string) {
    return await this.driver.executeScript<string>(
      async (walletName: string, recoveryPhrase: string) => {
        const resp = await window.client.request('admin.import_wallet', {
          recoveryPhrase: recoveryPhrase,
          name: walletName
        })
        return resp
      },
      walletName,
      recoveryPhrase
    )
  }

  async createPassphrase(passphrase: string) {
    return await this.driver.executeScript<string>(async (passphrase: string) => {
      const resp = await window.client.request('admin.create_passphrase', { passphrase: passphrase })
      return resp
    }, passphrase)
  }

  async listConnections() {
    return await this.driver.executeScript<string>(async () => {
      const { connections } = await window.client.request('admin.list_connections', {})
      return connections
    })
  }

  async createKey(walletName: string, keyName: string) {
    return await this.driver.executeScript<string>(
      async (walletName: string, keyName: string) => {
        const { publicKey } = await window.client.request('admin.generate_key', {
          wallet: walletName,
          name: keyName
        })
        return publicKey
      },
      walletName,
      keyName
    )
  }

  async setUpWalletAndKey(passphrase = 'password1', walletName = 'Wallet 1', keyName = 'Key 1') {
    let resp: any
    resp = await this.createPassphrase(passphrase)
    expect(resp, `expected to create passphrase via the api but the response was not null, instead it was: ${resp}`, {
      showPrefix: false
    }).toBe(null)

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
