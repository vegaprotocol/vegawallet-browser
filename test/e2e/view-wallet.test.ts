import { WebDriver } from 'selenium-webdriver'
import { initDriver } from './driver'
import { GetStarted } from './page-objects/get-started'
import { Password } from './page-objects/password'
import { SecureYourWallet } from './page-objects/secure-your-wallet'
import { CreateAWallet } from './page-objects/create-a-wallet'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'

describe('View wallet page', () => {
  let driver: WebDriver
  let getStarted: GetStarted
  let password: Password
  let secureYourWallet: SecureYourWallet
  let createAWallet: CreateAWallet
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  const testPassword = 'password1'

  beforeAll(async () => {
    //TODO- replace this set up with an api method to create a password and an api method importing a wallet. We should then be taken straight to the view wallet page
    driver = await initDriver()
    password = new Password(driver)
    getStarted = new GetStarted(driver)
    secureYourWallet = new SecureYourWallet(driver)
    createAWallet = new CreateAWallet(driver)
    viewWallet = new ViewWallet(driver)
    await navigateToLandingPage(driver)
    apiHelper = new APIHelper(driver)
    //const recoveryPhrase = await apiHelper.generateRecoveryPhrase()
    //console.log('recoveryPhrase: ', recoveryPhrase)
    const client = await apiHelper.getClient()
    //console.log('newWallet: ', newWallet)

    await new Promise((resolve) => setTimeout(resolve, 30000))
    // await getStarted.getStarted()
    // await password.createPassword(testPassword)
    // await createAWallet.createNewWallet()
    // await secureYourWallet.revealRecoveryPhrase(true)
  })

  afterAll(async () => {
    //await driver.quit()
  })

  it('can create new key/pair in the view wallet screen', async () => {
    // 1101-BWAL-028  can create a new key pair from the wallet view
    // 1101-BWAL-029 New key pairs are assigned a name automatically "Vega Key 1" "Vega Key 2" etc.
    // 1101-BWAL-030 New key pairs are listed in order they were created - oldest first
    await viewWallet.createNewKeyPair()
    expect(await viewWallet.getWalletKeys()).toMatchObject(['Key 1', 'Key 2'])

    await viewWallet.createNewKeyPair()
    expect(await viewWallet.getWalletKeys()).toMatchObject(['Key 1', 'Key 2', 'Key 3'])

    await navigateToLandingPage(driver)
    expect(await viewWallet.getWalletKeys()).toMatchObject(['Key 1', 'Key 2', 'Key 3'])
  })
})
