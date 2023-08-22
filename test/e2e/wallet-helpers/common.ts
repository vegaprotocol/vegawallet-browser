import { WebDriver, until } from 'selenium-webdriver'
import * as fs from 'fs'
import { APIHelper } from './api-helpers'
import { initDriver } from '../driver'

const chromeExtensionURL: string = 'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html'
export const validRecoveryPhrase =
  'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic believe'
export const defaultPassword = 'password1'
export const testDAppUrl = 'https://vegaprotocol.github.io/vegawallet-browser/'
export const dummyTransaction = {
  fromAccountType: 4,
  toAccountType: 4,
  amount: '1',
  asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
  to: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
  kind: {
    oneOff: {}
  }
}

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

export async function createWalletAndDriver() {
  const driver = await initDriver()
  const apiHelper = new APIHelper(driver)
  await navigateToExtensionLandingPage(driver)
  await apiHelper.setUpWalletAndKey()
  await navigateToExtensionLandingPage(driver)
  return driver
}

export async function navigateToExtensionLandingPage(driver: WebDriver) {
  const url = await getLandingPageURL(driver)
  await driver.get(url)
  await driver.wait(until.urlContains(url), 10000)
}

export async function setUpWalletAndKey(driver: WebDriver) {
  const apiHelper = new APIHelper(driver)
  await apiHelper.setUpWalletAndKey()
  await navigateToExtensionLandingPage(driver)
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
