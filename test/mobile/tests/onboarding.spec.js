async function enableVegaWallet() {
    var button = await $('~PageFormatMenuButton')
    await button.click();
    var manageExtensionsButton = await $('~ManageExtensions')
    await manageExtensionsButton.click();

    var vegaExtensionToggle = await $('//XCUIElementTypeSwitch[@name="Vega Wallet - Fairground"]');
    await vegaExtensionToggle.click();

    var doneButton = await $('~Done');
    await doneButton.click();

    var openVegaWalletButton = await $('~Vega Wallet - Fairground');
    await openVegaWalletButton.click();

    var alwaysAllowPermission = await $('~Always Allow…');
    await alwaysAllowPermission.click();

    var alwaysAllowEverySite = await $('~Always Allow on Every Website');
    await alwaysAllowEverySite.click();
}

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

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('Safari test', () => {
  it('should do something in safari', async () => {
    await browser.url('https://vegaprotocol.github.io/vegawallet-browser/');
    await switchToNativeContext();
    await enableVegaWallet();

    var getStartedButton = await $('~GET STARTED');
    await getStartedButton.click();

    var passwordField = await $('//XCUIElementTypeSecureTextField[@value="Enter a password"]');
    await passwordField.setValue('password');

    var confirmPasswordField = await $('//XCUIElementTypeSecureTextField[@value="Enter password again"]');
    await confirmPasswordField.setValue('password');

    var acceptWarning = await $('//XCUIElementTypeSwitch[@value="0"]');
    await acceptWarning.click();

    var createPasswordButton = await $('~CREATE PASSWORD');
    await createPasswordButton.click();

    var createWalletButton = await $('~CREATE A WALLET');
    await createWalletButton.click();

    var revealRecoveryPhrase = await $('~Reveal recovery phrase');
    await revealRecoveryPhrase.click();

    await $('~Hide');
    var acceptWarning = await $('//XCUIElementTypeStaticText[@name="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."]');
    await acceptWarning.click();

    var createWalletButton = await $('~CREATE WALLET');
    await createWalletButton.click();

    const optOutOfErrorReportingButton = await $('~NO THANKS')
    await optOutOfErrorReportingButton.click();

    var keyOne = $('~Key 1');
    expect(await keyOne.isDisplayed()).toBe(true);
  });
});
