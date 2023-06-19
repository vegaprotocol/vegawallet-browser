import { By, until, WebDriver, WebElement } from 'selenium-webdriver'
import { elementIsDisabled } from 'selenium-webdriver/lib/until'

const defaultTimeoutMillis = 10000

export async function clickElement(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  await element.click()
}

export async function getElementText(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  return element.getText()
}

export async function waitForElementToDisappear(
  driver: WebDriver,
  element: WebElement,
  timeout: number = defaultTimeoutMillis
) {
  await driver.wait(until.stalenessOf(element), timeout, 'Success modal did not disappear')
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

export async function hasTotalNumElements(expectedElements: number, locator: By, driver: WebDriver) {
  try {
    await waitForChildElementsCount(driver, locator, expectedElements)
    return true
  } catch (error) {
    const err = error as Error
    console.log(err.message)
    return false
  }
}

export async function getElements(driver: WebDriver, childElementLocator: By, timeout = defaultTimeoutMillis) {
  await waitForElementToBeReady(driver, childElementLocator, timeout)
  return await driver.findElements(childElementLocator)
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

export function staticWait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })
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

export async function clearTextField(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  await element.clear()
  await waitForTextFieldToBeEmpty(driver, locator, timeout)
}

async function waitForTextFieldToBeEmpty(driver: WebDriver, locator: By, timeout: number = 2000) {
  await driver.wait(
    async () => {
      return (await getElementText(driver, locator)) === ''
    },
    timeout,
    `Expected ${locator.toString()} field value to be empty but it was not`
  )
}

export async function openNewWindowAndSwitchToIt(driver: WebDriver, closeOld = false) {
  let currentWindowHandle: string
  await driver.executeScript('window.open();')
  if (closeOld) {
    currentWindowHandle = await driver.getWindowHandle()
    await driver.close()
  }
  return await openLatestWindowHandle(driver)
}

export async function openLatestWindowHandle(driver: WebDriver) {
  const handles = await driver.getAllWindowHandles()
  const latestHandle = handles[handles.length - 1]
  await driver.switchTo().window(latestHandle)
  return await driver.getWindowHandle()
}

export async function switchWindowHandles(driver: WebDriver, closeCurrent = true, windowHandle = '') {
  if (closeCurrent) {
    await driver.close()
  }
  if (windowHandle) {
    await driver.switchTo().window(windowHandle)
  } else {
    await driver.switchTo().window((await driver.getAllWindowHandles())[0])
  }
}
