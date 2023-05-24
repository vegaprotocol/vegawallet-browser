import { Builder, By, Capabilities, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import * as firefox from 'selenium-webdriver/firefox'
import archiver from 'archiver'
import * as fs from 'fs-extra'
import path from 'path'
import { clickElement } from './selenium-util'

const extensionPath = './build'
const firefoxTestProfileDirectory = './test/e2e/firefox-profile/myprofile.default'

export async function initDriver(useProfile: boolean = false, installExtension = true) {
  let driver: WebDriver | null = null
  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    driver = await initFirefoxDriver(useProfile, installExtension)
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
    }
  })

  return new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(chromeOptions).build()
}

function getMostRecentAddonFilePath(directory: string): string | null {
  const addonFiles = fs
    .readdirSync(directory)
    .filter((file) => file.startsWith('addon-') && file.endsWith('.xpi'))
    .map((file) => ({
      name: file,
      createdAt: fs.statSync(path.join(directory, file)).birthtimeMs
    }))
    .sort((a, b) => b.createdAt - a.createdAt)

  if (addonFiles.length > 0) {
    return path.join(directory, addonFiles[0].name)
  }

  return null
}

async function initFirefoxDriver(useProfile = false, installExtension = true) {
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

function createDirectoryIfNotExists(directoryPath: string) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true })
  } else {
    console.log(`Directory already exists: ${directoryPath}`)
  }
}

export function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

function deleteDirectoryIfExists(directoryPath: string) {
  if (fs.existsSync(directoryPath)) {
    fs.rmdirSync(directoryPath, { recursive: true })
    console.log(`Directory deleted: ${directoryPath}`)
  } else {
    console.log(`Directory does not exist: ${directoryPath}`)
  }
}

export async function copyProfile(driver: WebDriver) {
  let seleniumInstanceProfile: string

  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    seleniumInstanceProfile = (await (await driver.getCapabilities()).get('moz:profile')) as string
    await copyDirectoryToNewLocation(seleniumInstanceProfile, firefoxTestProfileDirectory)
  } else {
    seleniumInstanceProfile = 'chrome logic will go here'
  }
}

async function copyDirectoryToNewLocation(srcDir: string, targetDir: string) {
  try {
    const lockFilePath = path.join(srcDir, 'lock')
    if (await fs.pathExists(lockFilePath)) {
      await fs.unlink(lockFilePath)
      console.log(`Deleted 'lock' file: ${lockFilePath}`)
    }

    const filter = (src: string, dest: string) => {
      const fileName = path.basename(src)
      return fileName !== 'lock'
    }
    await fs.emptyDir(targetDir)
    await fs.copy(srcDir, targetDir, { filter })
    console.log('Directory copied successfully!')
  } catch (err) {
    console.error('Error copying directory:', err)
  }
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

export const captureScreenshot = async (driver: WebDriver, testName: string) => {
  const screenshotData = await driver.takeScreenshot()
  const screenshotPath = `./test-screenshots/${testName}.png`
  await fs.ensureDir(path.dirname(screenshotPath))
  fs.writeFileSync(screenshotPath, screenshotData, 'base64')
}
