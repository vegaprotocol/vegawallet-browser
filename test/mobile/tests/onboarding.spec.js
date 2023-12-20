
async function clickAcceptButton() {
  const acceptButton = await $(`//form[@name="consent"]/div[2]/button[1]`);
  await acceptButton.click();
}

describe('Safari test', () => {
  it('should do something in safari', async () => {
    console.log("Before waiting");
    await browser.url('https://google.co.uk');
    
    await new Promise(resolve => setTimeout(resolve, 5000)); // Pause for 5000 milliseconds (5 seconds)
    
    // Utilize the custom function to click the Accept button
    // await clickAcceptButton();
    const contexts = await driver.getContexts();
    console.log('Available Contexts:', contexts);
    await driver.switchContext(contexts[0]);
    var button = await $('~PageFormatMenuButton')
    await button.click();
    var manageExtensionsButton = await $('~ManageExtensions')
    await manageExtensionsButton.click();

    var vegaExtensionToggle = await $('//XCUIElementTypeSwitch[@name="Vega Wallet - Fairground"]');
    await vegaExtensionToggle.click();

    var doneButton = await $('~Done');
    await doneButton.click();

  });
});
