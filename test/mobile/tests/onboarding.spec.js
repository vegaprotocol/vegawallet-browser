//Native selectors
const safariAddressBarMenuButton = '~PageFormatMenuButton';
const safariManageExtensionsMenuItem = '~ManageExtensions';
const safariEnableVegaWalletToggle = '//XCUIElementTypeSwitch[@name="Vega Wallet - Fairground"]';
const safariManageExtensionsDoneButton = '~Done';
const openVegaWalletMenuItem = '~Vega Wallet - Fairground';
const grantPermissionButton = '~Always Allow…';
const grantPermissionToAllWebsitesButton = '~Always Allow on Every Website';

//Browser wallet elements
const getStartedButton = '~GET STARTED';
const passwordField = '//XCUIElementTypeSecureTextField[@value="Enter a password"]';
const confirmPasswordField = '//XCUIElementTypeSecureTextField[@value="Enter password again"]';
const acceptWarning = '//XCUIElementTypeSwitch[@value="0"]';
const createPasswordButton = '~CREATE PASSWORD';
const createWalletButton = '~CREATE A WALLET';
const revealRecoveryPhrase = '~Reveal recovery phrase';
const revealRecoveryPhraseWarning = '//XCUIElementTypeStaticText[@name="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."]'
const recoveryPhraseCreateWalletButton = '~CREATE WALLET';
const optOutOfErrorReportingButton = '~NO THANKS';
const viewWalletDefaultKey = '~Key 1';

const click = async (selector) => {
  const element = await $(selector);
  await element.click();
};

async function switchToNativeContext() {
  const contexts = await driver.getContexts();
  await driver.switchContext(contexts[0]);
}

async function switchToWebViewContext() {
  const contexts = await driver.getContexts();
  console.log('Available Contexts:', contexts);
  if (contexts.length < 2) {
    throw new Error('Expect to have native and web view context available. Something is wrong.');
  }
  await driver.switchContext(contexts[1]);
}

async function enableVegaWallet() {
    await switchToNativeContext();
    await click(safariAddressBarMenuButton);
    await click(safariManageExtensionsMenuItem);
    await click(safariEnableVegaWalletToggle);
    await click(safariManageExtensionsDoneButton);
    await click(openVegaWalletMenuItem)
    await click(grantPermissionButton);
    await click(grantPermissionToAllWebsitesButton);
}

describe('Onboarding', () => {
  it('Can onboard in safari using the wallet extension', async () => {
    await browser.url('https://vegaprotocol.github.io/vegawallet-browser/');
    await enableVegaWallet();

    await click(getStartedButton);
    await $(passwordField).setValue('password');
    await $(confirmPasswordField).setValue('password');
    await click(acceptWarning);
    await click(createPasswordButton);

    await click(createWalletButton);

    await click(revealRecoveryPhrase);
    await $('~Hide');
    await click(revealRecoveryPhraseWarning);
    await click(recoveryPhraseCreateWalletButton);

    await click(optOutOfErrorReportingButton);

    var keyOne = $(viewWalletDefaultKey);
    expect(await keyOne.isDisplayed()).toBe(true);
  });
});