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
  // if the length of context is less than 2 then we should throw an error
  if (contexts.length < 2) {
    throw new Error('Expect to have native and web view context available. Something is wrong.');
  }
  await driver.switchContext(contexts[1]);
}

describe('Safari test', () => {
  it('should do something in safari', async () => {
    await browser.url('https://vegaprotocol.github.io/vegawallet-browser/');
    await switchToNativeContext();
    await enableVegaWallet();

    var vegaWalletWindowElement = await $('//XCUIElementTypeOther[@name="main"])[2]');
    const { x, y, width, height } = await vegaWalletWindowElement.getLocation();
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    //switch context and then...

    await browser.url('https://vegaprotocol.github.io/vegawallet-browser/');

    await driver.touchPerform([
      {
        action: 'press',
        options: { x: centerX, y: centerY },
      },
      {
        action: 'wait',
        options: { ms: 1000 }, // Optional wait time (adjust as needed)
      },
      {
        action: 'moveTo',
        options: { x: centerX, y: 0 }, // Swipe to the top of the screen (Y = 0)
      },
      {
        action: 'release',
      },
    ]);
  });
});
