import { stat } from 'fs'
import { By, until, WebDriver, WebElement } from 'selenium-webdriver'
import { captureScreenshot } from './driver'

const defaultTimeoutMillis = 10000

export async function clickElement(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  await element.click()
}

export async function getWebElementContainingText(
  desiredText: string,
  driver: WebDriver,
  locator: By,
  timeout: number = defaultTimeoutMillis
) {
  const elements = await getElements(driver, locator, timeout)
  for (const element of elements) {
    const text = await getWebElementText(driver, element, timeout)
    if (text.includes(desiredText)) {
      return element
    }
  }

  throw new Error(`Could not find element containing text: ${desiredText}`)
}

export async function clickDescendantOfWebElement(
  driver: WebDriver,
  parentElement: WebElement,
  descendantLocator: By,
  timeout: number = defaultTimeoutMillis
) {
  await waitForElementToBeReady(driver, descendantLocator, timeout)
  const descendantElement = await parentElement.findElement(descendantLocator)
  await clickWebElement(driver, descendantElement, timeout)
}

export async function clickWebElement(driver: WebDriver, element: WebElement, timeout: number = defaultTimeoutMillis) {
  ;(await waitForWebElementToBeReady(driver, element, timeout)).click()
}

export async function getWebElementText(
  driver: WebDriver,
  element: WebElement,
  timeout: number = defaultTimeoutMillis
) {
  await waitForWebElementToBeReady(driver, element, timeout)
  return await element.getText()
}

async function waitForWebElementToBeReady(
  driver: WebDriver,
  element: WebElement,
  timeout: number = defaultTimeoutMillis
) {
  await driver.wait(until.elementIsVisible(element), timeout, 'WebElement not visible')
  await driver.wait(until.elementIsEnabled(element), timeout, 'WebElement not enabled')
  await waitForWebElementNotStale(driver, element, timeout)
  return element
}

async function waitForWebElementNotStale(
  driver: WebDriver,
  element: WebElement,
  timeout: number = defaultTimeoutMillis
) {
  await driver.wait(
    async () => {
      try {
        await element.getTagName()
        return true
      } catch (error) {
        return false
      }
    },
    timeout,
    `Element ${element} is stale`
  )
}

export async function getElementText(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  return element.getText()
}

export async function waitForElementToDisappear(driver: WebDriver, locator: By, timeout: number = 5000) {
  if (await isElementDisplayed(driver, locator, timeout)) {
    await driver.wait(async () => !(await isElementDisplayed(driver, locator, 200)), timeout)
  }
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

export async function sendKeysToElement(
  driver: WebDriver,
  locator: By,
  text: string,
  clearField = true
): Promise<void> {
  if (clearField) {
    await clearTextField(driver, locator)
  }
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
    await driver.wait(until.elementIsVisible(element), timeout)
    return await element.isDisplayed()
  } catch (error) {
    return false
  }
}

//This is a work around as the ui toolkit elements do noT Ccorrectly reflect the selected state through the isSelected method
export async function isElementSelected(driver: WebDriver, locator: By, timeout: number = defaultTimeoutMillis) {
  try {
    const element = await waitForElementToBeReady(driver, locator, timeout)
    return (await element.getAttribute('aria-checked')) === 'true'
  } catch (error) {
    return false
  }
}

export async function getAttributeValue(
  driver: WebDriver,
  locator: By,
  attributeName: string,
  timeout: number = defaultTimeoutMillis
) {
  const element = await waitForElementToBeReady(driver, locator, timeout)
  return await element.getAttribute(attributeName)
}

export async function waitForElementToBeSelected(
  driver: WebDriver,
  locator: By,
  timeout: number = defaultTimeoutMillis
) {
  await driver.wait(async () => {
    return await isElementSelected(driver, locator)
  }, timeout)
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
  const initialHandles = await driver.getAllWindowHandles()
  const initialActiveHandle = await driver.getWindowHandle()
  await driver.executeScript('window.open();')
  const handlesAfterOpen = await driver.getAllWindowHandles()
  const newTab = getDifference(handlesAfterOpen, initialHandles)

  expect(newTab.length).toBe(1)
  await switchWindowHandles(driver, closeOld, newTab[0], initialActiveHandle)
  return newTab[0]
}

function getDifference(listA: any[], listB: any[]): any[] {
  return listA.filter((item) => !listB.includes(item))
}

export async function openLatestWindowHandle(driver: WebDriver) {
  const handles = await driver.getAllWindowHandles()
  const latestHandle = handles[handles.length - 1]
  await driver.switchTo().window(latestHandle)
  return await driver.getWindowHandle()
}

export async function goToNewWindowHandle(
  driver: WebDriver,
  windowHandlesBeforeNewHandle: string[],
  windowHandlesAfterNewHandle: string[]
) {
  const newHandle = getDifference(windowHandlesAfterNewHandle, windowHandlesBeforeNewHandle)
  await switchWindowHandles(driver, false, newHandle[0])
  return await driver.getWindowHandle()
}

export async function switchWindowHandles(driver: WebDriver, closeOld = true, windowHandle = '', handleToClose = '') {
  if (closeOld) {
    if (handleToClose) {
      await driver.switchTo().window(handleToClose)
    }
    await driver.close()
  }

  if (windowHandle) {
    await driver.switchTo().window(windowHandle)
  } else {
    await driver.switchTo().window((await driver.getAllWindowHandles())[0])
  }
}

export async function windowHandleHasCount(
  driver: WebDriver,
  targetCount: number,
  timeoutMs: number = 10000
): Promise<boolean> {
  try {
    await driver.wait(async () => {
      const handles = await driver.getAllWindowHandles()
      return handles.length === targetCount
    }, timeoutMs)

    return true
  } catch (error) {
    const handles = await driver.getAllWindowHandles()
    for (const handle of handles) {
      await driver.switchTo().window(handle)
      await captureScreenshot(driver, `${expect.getState().currentTestName as string}-handle-${handle}`)
    }
    console.log(
      `did not reach the target count! Had ${handles.length} number of handles. Expected ${targetCount}`,
      error
    )
    return false
  }
}
