import { Builder, By, Capabilities, until, WebDriver } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import * as firefox from 'selenium-webdriver/firefox'
import archiver from 'archiver'
import * as fs from 'fs-extra'
import path from 'path'

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
  chromeOptions.setUserPreferences({
    'profile.default_content_setting_values': {
      clipboard: 1
    }
  })

  return new Builder().withCapabilities(Capabilities.chrome()).setChromeOptions(chromeOptions).build()
}

async function initFirefoxDriver() {
  await zipDirectory(`${extensionPath}/firefox`, `${extensionPath}/firefox.zip`)
  let firefoxOptions = new firefox.Options()
  firefoxOptions.addExtensions(`${extensionPath}/firefox.zip`)
  if (process.env.HEADLESS) {
    firefoxOptions = firefoxOptions.headless()
  }
  const driver = await new Builder().withCapabilities(Capabilities.firefox()).setFirefoxOptions(firefoxOptions).build()
  await new firefox.Driver(driver.getSession(), driver.getExecutor()).installAddon(`${extensionPath}/firefox.zip`, true)
  return driver
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
  console.log(`Screenshot captured: ${screenshotPath}`)
}
