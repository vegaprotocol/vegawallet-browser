import { WebDriver } from 'selenium-webdriver'
import * as fs from 'fs'

const landingPageURL: string = 'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html'

async function getLandingPageURL(driver: WebDriver) {
  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    const profilePath = (await (await driver.getCapabilities()).get('moz:profile')) as string
    const userPrefsFileContent = fs.readFileSync(`${profilePath}/prefs.js`, 'utf-8')
    const uuid = await getExtensionUuid(userPrefsFileContent)
    console.log(`uuid is ${uuid}`)
    //await new Promise((resolve) => setTimeout(resolve, 30000))
    return `moz-extension://${uuid}/index.html`
    //moz-extension://a035275a-b136-4a3a-9739-6f1f126f7a1e/index.html#/onboarding/get-started
    //moz-extension://fddb321f-f82b-4a40-837b-7190ab748883/index.html
  } else {
    return landingPageURL
  }
}
export async function navigateToLandingPage(driver: WebDriver) {
  const url = await getLandingPageURL(driver)
  console.log(`url is ${url}`)
  //await new Promise((resolve) => setTimeout(resolve, 30000))
  await driver.get(url)
}
//5cb1396e-fc84-4955-8159-c325bdfe3e25
async function getExtensionUuid(userPrefsFileContent: string): Promise<string | null> {
  let uuid: string | null = null

  const userPrefsList = userPrefsFileContent.split(';')

  for (const currentPref of userPrefsList) {
    if (currentPref.includes('extensions.webextensions.uuids')) {
      uuid = currentPref.split(':')[1].replace(/"/g, '').replace('}', '').replace(')', '').replace(/\\/g, '')
    }
  }
  //
  if (uuid !== null && uuid.includes(',')) {
    uuid = uuid.split(',')[0]
  }

  return uuid
}
