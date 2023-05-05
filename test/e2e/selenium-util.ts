import { Builder, By, Capabilities, logging, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'

const defaultTimeoutMillis = 3000
const extensionPath = './build'

export async function initDriver() {
  console.log("about to try and create a new driver")
  let driver: WebDriver | null = null

  console.log("about to try and create a new chrome options")
  let chromeOptions = new chrome.Options()
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage')
    .addArguments('--disable-gpu')
    .addArguments("--disable-extensions")
    .addArguments("--start-maximized")
    .addArguments("--remote-debugging-port=9222");
   // .addArguments(`--load-extension=${extensionPath + '/chrome'}`)

   console.log("about to try and set logging prefs")
   const loggingPrefs = new logging.Preferences();
   loggingPrefs.setLevel(logging.Type.DRIVER, logging.Level.ALL);
   chromeOptions.setLoggingPrefs(loggingPrefs);

  driver = new Builder()
    .withCapabilities(Capabilities.chrome())
    .setChromeOptions(chromeOptions)
    .build()

  if (!driver) {
    throw new Error('Failed to create WebDriver instance')
  }

  console.log("about to try and print logs")
  const logs = await driver.manage().logs().get(logging.Type.DRIVER);
  logs.forEach((log) => {
    console.log(`${log.level.name}: ${log.message}`);
});

  console.log("about to try and get arsenal.com from within the initDriver function")
  await driver.get('http://arsenal.com')

  const logs2 = await driver.manage().logs().get(logging.Type.DRIVER);
  logs2.forEach((log) => {
    console.log(`${log.level.name}: ${log.message}`);
});
  console.log('Driver created')
  return driver
}

export async function clickElement(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  await element.click()
}

export async function sendKeysToElement(driver: WebDriver, locator: By, text: string): Promise<void> {
  const element = await waitForElementToBeReady(driver, locator)
  await element.sendKeys(text)
}

export function getByDataTestID(dataTestID: string) {
  return By.css(`[data-testid ='${dataTestID}']`)
}

export async function waitForElementToBeReady(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  try {
    const element = await driver.wait(
      until.elementLocated(locator),
      timeout,
      `Timeout waiting for element with locator: ${locator}`
    )
    await driver.wait(
      until.elementIsVisible(element),
      timeout,
      `Timeout waiting for element with locator: ${locator} to be visible`
    )
    await driver.wait(
      until.elementIsEnabled(element),
      timeout,
      `Timeout waiting for element with locator: ${locator} to be enabled`
    )
    return element
  } catch (error) {
    console.error(`Error waiting for element with locator: ${locator}`, error)
    throw error
  }
}

export async function isElementDisplayed(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  try {
    await driver.wait(until.elementLocated(locator), timeout)
    const element = await driver.findElement(locator)
    return await element.isDisplayed()
  } catch (error) {
    return false
  }
}
