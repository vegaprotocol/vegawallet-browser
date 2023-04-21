import { By, until, WebDriver } from "selenium-webdriver";

const defaultTimeoutMillis = 3000;

export async function clickElement(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout);
  await element.click();
}

export async function sendKeysToElement(driver: WebDriver, locator: By, text: string): Promise<void> {
  const element = await waitForElementToBeReady(driver, locator);
  await element.sendKeys(text);
}

export async function waitForElementToBeReady(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  try {
    const element = await driver.wait(
      until.elementLocated(locator),
      timeout,
      `Timeout waiting for element with locator: ${locator}`
    );
    await driver.wait(
      until.elementIsVisible(element),
      timeout,
      `Timeout waiting for element with locator: ${locator} to be visible`
    );
    await driver.wait(
      until.elementIsEnabled(element),
      timeout,
      `Timeout waiting for element with locator: ${locator} to be enabled`
    );
    return element;
  } catch (error) {
    console.error(`Error waiting for element with locator: ${locator}`, error);
    throw error;
  }
}

export async function isElementDisplayed(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  try {
    await driver.wait(until.elementLocated(locator), timeout);
    const element = await driver.findElement(locator);
    return await element.isDisplayed();
  } catch (error) {
    return false;
  }
}
