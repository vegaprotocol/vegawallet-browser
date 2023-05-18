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
    const response = await this.driver.executeScript<string>(async (passphrase: string) => {
      const resp = await window.client.request('admin.unlock', { passphrase: passphrase })
      return resp
    }, passphrase)
    return response
  }

  async importWallet(walletName: string, recoveryPhrase: string) {
    const response = await this.driver.executeScript<string>(
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

    return response
  }

  async createPassphrase(passphrase: string) {
    const response = await this.driver.executeScript<string>(async (passphrase: string) => {
      const resp = await window.client.request('admin.create_passphrase', { passphrase: passphrase })
      return resp
    }, passphrase)
    return response
  }

  async createKey(walletName: string, keyName: string) {
    return (
      await this.driver.executeScript<string>(
        async (walletName: string, keyName: string) => {
          const resp = await window.client.request('admin.generate_key', {
            wallet: walletName,
            name: keyName
          })
          return resp
        },
        walletName,
        keyName
      ),
      walletName,
      keyName
    )
  }

  async setUpPasswordWalletAndKey(passphrase: string, walletName: string, keyName: string) {
    const passphraseResponse = await this.createPassphrase(passphrase)
    console.log('passphraseResponse', passphraseResponse)
    const recoveryPhrase = await this.generateRecoveryPhrase()
    console.log('recoveryPhrase', recoveryPhrase)
    const importWalletResponse = await this.importWallet(walletName, recoveryPhrase)
    console.log('importWalletResponse', importWalletResponse)
    const createKeyResponse = await this.createKey(walletName, keyName)
    console.log('createKeyResponse', createKeyResponse)
    const loginResponse = await this.login(passphrase)
    console.log('loginResponse', loginResponse)
  }
}
