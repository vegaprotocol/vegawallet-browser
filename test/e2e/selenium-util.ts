import { By, until, WebDriver, WebElement } from 'selenium-webdriver'

const defaultTimeoutMillis = 10000

export async function clickElement(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  await element.click()
}

export async function getElementText(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  return element.getText()
}

export async function waitForChildElementsCount(
  driver: WebDriver,
  childElementLocator: By,
  expectedCount: number,
  timeout = defaultTimeoutMillis
): Promise<void> {
  await driver.wait(
    async () => {
      const childElements = await driver.findElements(childElementLocator)
      return childElements.length === expectedCount
    },
    timeout,
    `Expected ${expectedCount} child elements, but found a different number.`
  )
}

export async function sendKeysToElement(driver: WebDriver, locator: By, text: string): Promise<void> {
  const element = await waitForElementToBeReady(driver, locator)
  await element.sendKeys(text)
}

export function getByDataTestID(dataTestID: string) {
  return By.css(`[data-testid ='${dataTestID}']`)
}

export async function waitForElementToBeReady(
  driver: WebDriver,
  locator: By,
  timeout: number = defaultTimeoutMillis
): Promise<WebElement> {
  let element: WebElement

  try {
    element = await driver.wait(
      until.elementLocated(locator),
      timeout,
      `Timeout waiting for element with locator: ${locator}`
    )
  } catch (error) {
    console.error(`Error waiting for element with locator: ${locator}`, error)
    throw error
  }
  try {
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
    const err = error as Error
    if (err.name === 'StaleElementReferenceError') {
      console.warn(`Element with locator ${locator} became stale, retrying...`)
      return await waitForElementToBeReady(driver, locator, timeout)
    }
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

export async function isElementEnabled(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  try {
    await driver.wait(until.elementLocated(locator), timeout)
    const element = await driver.findElement(locator)
    return await element.isEnabled()
  } catch (error) {
    return false
  }
}

export async function openNewWindowAndSwitchToIt(driver: WebDriver) {
  await driver.executeScript('window.open();')
  const handles = await driver.getAllWindowHandles()
  await driver.switchTo().window(handles[1])
}
