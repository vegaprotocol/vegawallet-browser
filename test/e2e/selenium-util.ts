import { Builder, By, Capabilities, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import * as firefox from 'selenium-webdriver/firefox'
import archiver from 'archiver'
import * as fs from 'fs'

const defaultTimeoutMillis = 3000
const extensionPath = './build'

export async function initDriver() {
  let driver: WebDriver | null = null
  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    driver = await initFirefoxDriver()
  } else {
    driver = await initChromeDriver()
  }

  if (!driver) {
    throw new Error('Failed to create WebDriver instance')
  }

  return driver
}

async function initChromeDriver() {
  let chromeOptions = new chrome.Options()
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage')
    .addArguments('--disable-gpu')
    .addArguments(`--load-extension=${extensionPath + '/chrome'}`)
  return new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(chromeOptions).build()
}

async function zipDirectory(source: string, out: string): Promise<void> {
  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(out)

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', (err) => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })
}

async function initFirefoxDriver() {
  await zipDirectory(`${extensionPath}/firefox`, `${extensionPath}/firefox.zipy`)
  let firefoxOptions = new firefox.Options()
  firefoxOptions.addExtensions(`${extensionPath}/firefox.zip`)
  if (process.env.HEADLESS) {
    firefoxOptions = firefoxOptions.headless()
  }
  const driver = await new Builder().withCapabilities(Capabilities.firefox()).setFirefoxOptions(firefoxOptions).build()
  await new firefox.Driver(driver.getSession(), driver.getExecutor()).installAddon(`${extensionPath}/firefox.zip`, true)
  return driver
}

export async function clickElement(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  await element.click()
}

export async function getElementText(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  return element.getText()
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
