import { ok } from 'assert'

//Native selectors
const safariAddressBarMenuButton = '~PageFormatMenuButton'
const safariManageExtensionsMenuItem = '~ManageExtensions'
const safariEnableVegaWalletToggle = '//XCUIElementTypeSwitch[@name="Vega Wallet - Beta"]'
const safariManageExtensionsDoneButton = '~Done'
const openVegaWalletMenuItem = '~Vega Wallet - Beta'
const grantPermissionButton = '~Always Allow…'
const grantPermissionToAllWebsitesButton = '~Always Allow on Every Website'

//Browser wallet elements
const getStartedButton = '~I UNDERSTAND'
const passwordField = '//XCUIElementTypeSecureTextField[@value="Enter a password"]'
const confirmPasswordField = '//XCUIElementTypeSecureTextField[@value="Enter password again"]'
const acceptWarning = '//XCUIElementTypeSwitch[@value="0"]'
const createPasswordButton = '~CREATE PASSWORD'
const createWalletButton = '~CREATE A WALLET'
const revealRecoveryPhrase = '~Reveal recovery phrase'
const revealRecoveryPhraseWarning =
  '//XCUIElementTypeStaticText[@name="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."]'
const recoveryPhraseCreateWalletButton = '~CREATE WALLET'
const optOutOfErrorReportingButton = '~NO THANKS'
const viewWalletDefaultKey = '~Key 0'
const connect = '//XCUIElementTypeButton[@name="CONNECT"]'

const click = async (selector) => {
  const element = await $(selector)
  await element.click()
}

async function switchToNativeContext() {
  const contexts = await driver.getContexts()
  await driver.switchContext(contexts[0])
}

async function enableVegaWallet() {
  await switchToNativeContext()
  await click(safariAddressBarMenuButton)
  await click(safariManageExtensionsMenuItem)
  await click(safariEnableVegaWalletToggle)
  await click(safariManageExtensionsDoneButton)
  await click(openVegaWalletMenuItem)
  await click(grantPermissionButton)
  await click(grantPermissionToAllWebsitesButton)
}

async function switchToVegaWallet() {
  await click(safariAddressBarMenuButton)
  await click(openVegaWalletMenuItem)
  await click(openVegaWalletMenuItem)
}

describe('Onboarding', () => {
  before(async () => {
    await browser.url('https://vegaprotocol.github.io/vegawallet-browser/')
    await enableVegaWallet()
  })

  afterEach(async () => {
    await click('//XCUIElementTypeStaticText[@name="Example Vega dApp"]')
  })

  it('Can onboard in safari using the wallet extension', async () => {
    await click(getStartedButton)
    await $(passwordField).setValue('password')
    await $(confirmPasswordField).setValue('password')
    await click(acceptWarning)
    await click(createPasswordButton)

    await click(createWalletButton)

    await click(revealRecoveryPhrase)
    await $('~Hide')
    await click(revealRecoveryPhraseWarning)
    await click(recoveryPhraseCreateWalletButton)

    // await click(optOutOfErrorReportingButton)

    var keyOne = await $(viewWalletDefaultKey)
    ok(await keyOne.isDisplayed(), 'Could not locate Key 1, onboarding may have been unsuccessful')
  })

  it('Can connect to the wallet', async () => {
    await browser.url('https://vegaprotocol.github.io/vegawallet-browser/')
    await click('~Connect Wallet')

    await switchToVegaWallet()
    ok(
      await $('//XCUIElementTypeStaticText[@name="See all of your wallet’s public keys"]').isDisplayed(),
      'The connect popup was not displayed in vega wallet'
    )

    await click(connect)
    await click('//XCUIElementTypeLink[@name="Connections"]')

    ok(
      await $('~https://vegaprotocol.github.io').isDisplayed(),
      "Could not find the connection to the dapp in the 'connections' vega wallet page"
    )
  })

  it('Can send a transaction to the wallet for approval', async () => {
    await click('//XCUIElementTypeButton[@name="Submit"]')

    await switchToVegaWallet()
    ok(await $('~CONFIRM').isDisplayed(), 'The transaction approval popout was not displayed in the wallet')
    await click('~CONFIRM')

    // should be back on the connectons page after approving, this is due to the state of the previous test. Should make this independent if possible. POC disclaimer ;)
    ok(
      await $(
        '~https://vegaprotocol.github.io',
        'Expected to see the connections page displayed after confirming the transaction'
      ).isDisplayed()
    )
  })
})
