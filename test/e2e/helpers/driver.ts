import { Builder, By, Capabilities, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import * as firefox from 'selenium-webdriver/firefox'
import * as fs from 'fs-extra'
import path from 'path'
import { copyDirectoryToNewLocation, createDirectoryIfNotExists, zipDirectory } from './file-system'
import { clickElement, staticWait, switchWindowHandles } from './selenium-util'
import { navigateToExtensionLandingPage } from './wallet/wallet-setup'
import { el } from 'date-fns/locale'

const extensionPath = './build'
export const firefoxTestProfileDirectory = './test/e2e/firefox-profile/myprofile.default'

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
  chromeOptions.setUserPreferences({
    'profile.default_content_setting_values': {
      clipboard: 1
    },
    'extensions.ui.developer_mode': true
  })

  return new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(chromeOptions).build()
}

export async function initFirefoxDriver(useProfile = false, installExtension = true) {
  const firefoxExtensionPath = `${extensionPath}/firefox.zip`
  await zipDirectory(`${extensionPath}/firefox`, `${firefoxExtensionPath}`)

  let firefoxOptions = new firefox.Options()

  if (process.env.HEADLESS) {
    firefoxOptions = firefoxOptions.headless()
  }

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
        console.log('Got the expected error')
        correctException = true
      } else if ((error as Error).name.toLowerCase().includes('ECONNREFUSED')) {
        driver.close()
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

export const captureScreenshot = async (driver: WebDriver, testName: string) => {
  const screenshotData = await driver.takeScreenshot()
  const screenshotPath = `./test/test-screenshots/${testName}.png`
  await fs.ensureDir(path.dirname(screenshotPath))
  fs.writeFileSync(screenshotPath, screenshotData, 'base64')
}

//te
