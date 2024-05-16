import { Builder, By, Capabilities, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import * as firefox from 'selenium-webdriver/firefox'
import * as fs from 'fs-extra'
import path from 'path'
import { copyDirectoryToNewLocation, createDirectoryIfNotExists, zipDirectory } from './file-system'
import { clickElement, staticWait, switchWindowHandles } from './selenium-util'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './wallet/wallet-setup'
import { GetStarted } from '../page-objects/get-started'
import { CONSTANTS } from '../../../lib/constants'

export const extensionPath = './build'
export const oldExtensionDirectory = './test/vega-browserwallet-testnet-chrome-v0.10.0'
export const firefoxTestProfileDirectory = './test/e2e/firefox-profile/myprofile.default'

export async function initDriver(oldExtension = false) {
  let driver: WebDriver | null = null
  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    driver = await initFirefoxDriver()
  } else {
    driver = await initChromeDriver(oldExtension)
  }

  if (!driver) {
    throw new Error('Failed to create WebDriver instance')
  }

  return driver
}

async function initChromeDriver(useOldExtension = false) {
  let chromeOptions = new chrome.Options()
    .addArguments('--no-sandbox')
    .addArguments('--disable-dev-shm-usage')
    .addArguments('--disable-gpu')
    .addArguments('--window-size=500,850')

  if (process.env.HEADLESS) {
    chromeOptions.addArguments('--headless=new')
  }

  if (useOldExtension) {
    chromeOptions.addArguments(`--load-extension=${oldExtensionDirectory}`)
  } else {
    chromeOptions.addArguments(`--load-extension=${extensionPath + '/chrome'}`)
  }

  chromeOptions.setUserPreferences({
    'profile.default_content_setting_values': {
      clipboard: 1
    },
    'extensions.ui.developer_mode': true
  })

  const driver = new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(chromeOptions).build()
  await driver.manage().window().setRect({ width: 500, height: 850 })

  return driver
}

export async function initFirefoxDriver(useProfile = false, installExtension = true) {
  const firefoxExtensionPath = `${extensionPath}/firefox.zip`
  await zipDirectory(`${extensionPath}/firefox`, `${firefoxExtensionPath}`)
  let firefoxOptions = new firefox.Options()

  if (process.env.HEADLESS) {
    firefoxOptions = firefoxOptions.headless()
  }

  firefoxOptions.addArguments('--width=500', '--height=850')

  if (useProfile) {
    createDirectoryIfNotExists(firefoxTestProfileDirectory)
    firefoxOptions = firefoxOptions.setProfile(firefoxTestProfileDirectory)
    firefoxOptions.setBinary('/usr/local/bin/firefox-dev')
    firefoxOptions.addExtensions(firefoxExtensionPath)
    firefoxOptions.setPreference('xpinstall.signatures.required', false)
    firefoxOptions.setPreference('extensions.enabled', true)
  } else {
    firefoxOptions.addExtensions(firefoxExtensionPath)
  }

  const driver = await new Builder().withCapabilities(Capabilities.firefox()).setFirefoxOptions(firefoxOptions).build()
  await driver.manage().window().setRect({ width: 500, height: 850 })

  if (installExtension) {
    await new firefox.Driver(driver.getSession(), driver.getExecutor()).installAddon(firefoxExtensionPath, true)
  } else {
    await driver.get('about:addons')
    await clickElement(driver, By.css('[name="extension"]'))
    await clickElement(driver, By.css('.extension-enable-button'))
    await clickElement(driver, By.css('.extension-enable-button'))
  }

  return driver
}

export async function copyProfile(driver: WebDriver) {
  let seleniumInstanceProfile: string

  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    seleniumInstanceProfile = (await (await driver.getCapabilities()).get('moz:profile')) as string
    await copyDirectoryToNewLocation(seleniumInstanceProfile, firefoxTestProfileDirectory)
  } else {
    console.log('Copying profile is only supported for Firefox. Skipping this step for Chrome.')
  }
}

export async function getHandleWithExtensionAutoOpened(driver: WebDriver, handles: string[]) {
  let extensionID = ''
  for (const handle of handles) {
    await driver.switchTo().window(handle)
    const getStarted = new GetStarted(driver)

    if (await getStarted.isOnGetStartedPage()) {
      extensionID = await driver.executeScript('return chrome.runtime.id')
      await setUpWalletAndKey(driver, extensionID)
      return extensionID
    }
  }
  if (extensionID === '') {
    throw new Error("No 'chrome-extension' URL found.")
  }
}

export async function isDriverInstanceClosed(driver: WebDriver, handleToSwitchBackTo: string, maxRetries = 5) {
  let retries = 0
  let correctException = false
  while (retries < maxRetries && !correctException) {
    try {
      await navigateToExtensionLandingPage(driver)
      console.log('navigated successfully. This means the driver instance was not closed.')
      retries++
    } catch (error) {
      if ((error as Error).name.toLowerCase().includes('nosuchwindowerror')) {
        correctException = true
      } else {
        console.log('An exception that was not expected was thrown. Error:', error)
        retries++
        if (retries < maxRetries) {
          console.log(`Retrying (${retries}/${maxRetries})...`)
          await staticWait(1000)
        } else {
          console.log('Max retry attempts reached.')
        }
      }
    }
  }
  // switch back to a valid instance of driver or test will fail for driver related reasons
  await switchWindowHandles(driver, false, handleToSwitchBackTo)
  return correctException
}

// This is not something we want to do. We should ONLY use this on ECONNREFUSED exceptions in tests that use the popout functionality, not to accommodate for UI flakiness.
// This is because selenium randomly crashes due to our auto open/close functionality, however we still want to test it.
export async function runTestRetryIfDriverCrashes(
  testFunction: () => Promise<void>,
  setupFunction?: () => Promise<void>,
  teardownFunction?: () => Promise<void>,
  maxRetries = 0,
  retryIteration = 0
) {
  try {
    if (setupFunction && retryIteration > 0) {
      await setupFunction()
    }
    await testFunction()
  } catch (error) {
    if ((error as Error).message.includes('ECONNREFUSED') && retryIteration < maxRetries) {
      console.warn(`Test failed with ECONNREFUSED. Retrying (${retryIteration + 1} of ${maxRetries})...`)
      await runTestRetryIfDriverCrashes(testFunction, setupFunction, teardownFunction, maxRetries, retryIteration + 1)
    } else {
      if (retryIteration == maxRetries) {
        console.log('driver crashed three times in a row. Failing the test. Investigate your configuration')
      }
      if (teardownFunction) {
        await teardownFunction()
      }
      throw error
    }
  }
}

export const captureScreenshot = async (driver: WebDriver, testName: string) => {
  const screenshotData = await driver.takeScreenshot()
  const screenshotPath = `./test/test-screenshots/${testName}.png`
  await fs.ensureDir(path.dirname(screenshotPath))
  fs.writeFileSync(screenshotPath, screenshotData, 'base64')
}
