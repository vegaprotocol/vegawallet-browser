import { WebDriver } from 'selenium-webdriver'
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

  async importWallet(recoveryPhrase: string) {
    return (
      await this.driver.executeScript<string>(async (recoveryPhrase: string) => {
        // @ts-ignore
        const resp = await window.client.request('admin.import_wallet', {
          recoveryPhrase: recoveryPhrase,
          name: 'Wallet import'
        })
        return resp
      }, recoveryPhrase),
      recoveryPhrase
    )
  }

  async createPassphrase(passphrase: string) {
    return (
      await this.driver.executeScript<string>(async (passphrase: string) => {
        // @ts-ignore
        const resp = await window.client.request('admin.create_passphrase', { passphrase: passphrase })
        return resp
      }, passphrase),
      passphrase
    )
  }

  async createKey(walletName: string, keyName: string) {
    return (
      await this.driver.executeScript<string>(
        async (walletName: string, keyName: string) => {
          // @ts-ignore
          const resp = await client.request('admin.generate_key', {
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
}
