import { WebDriver } from 'selenium-webdriver'
import * as fs from 'fs'

const chromeExtensionURL: string = 'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html'

async function getLandingPageURL(driver: WebDriver) {
  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    const profilePath = (await (await driver.getCapabilities()).get('moz:profile')) as string
    const userPrefsFileContent = fs.readFileSync(`${profilePath}/prefs.js`, 'utf-8')
    const uuid = await getExtensionUuid(userPrefsFileContent)
    return `moz-extension://${uuid}/index.html`
  } else {
    return chromeExtensionURL
  }
}

export async function navigateToLandingPage(driver: WebDriver) {
  const url = await getLandingPageURL(driver)
  await driver.get(url)
}

async function getExtensionUuid(userPrefsFileContent: string): Promise<string | null> {
  let uuid: string | null = null
  const userPrefsList = userPrefsFileContent.split(';')

  for (const currentPref of userPrefsList) {
    if (currentPref.includes('extensions.webextensions.uuids')) {
      uuid = currentPref.split(':')[1].replace(/"/g, '').replace('}', '').replace(')', '').replace(/\\/g, '')
    }
  }

  if (uuid !== null && uuid.includes(',')) {
    uuid = uuid.split(',')[0]
  }

  return uuid
}
