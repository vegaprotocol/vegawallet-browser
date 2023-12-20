describe('Safari URL Entry Test', () => {
  
  it('should enter a URL into Safari', async () => {
      console.log("Before waiting");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Pause for 5000 milliseconds (5 seconds)
      var searchSelector = await $(`//XCUIElementTypeTextField[@name="TabBarItemTitle"]`)
      await searchSelector.waitForDisplayed({ timeout: 10000 });
      await searchSelector.click();
  });
});