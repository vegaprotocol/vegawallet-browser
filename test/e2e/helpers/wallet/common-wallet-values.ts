import { WebDriver } from 'selenium-webdriver'
import * as fs from 'fs'

//URLS
const e2eExtensionId = 'jfaancmgehieoohdnmcdfdlkblfcehp'
const chromeExtensionURL = (id: string) => `chrome-extension://${id}/index.html`
export const testDAppUrl = 'https://vegaprotocol.github.io/vegawallet-browser/'
export const consoleSmokePublicKey = '10743917237e3f76eabcec06acc4e56807c468c6a84f437c4c9ff75dc2822851'
export const consoleSmokeRecoveryPhrase =
  'deny puzzle bitter bright cost rival foam wall cook urban rotate beach improve problem trumpet happy basket glad total message nuclear indoor media pumpkin'
export const consoleSmokeMainnetRecoveryPhrase =
  'fog tissue potato witness render oven scan diet nut carpet light question intact cook twist index citizen saddle boy snake dust you first chair'

//PASSWORDS
export const defaultPassword = 'password1'
export const validRecoveryPhrase =
  'solid length discover gun swear nose artwork unfair vacuum canvas push hybrid owner wasp arrest mixed oak miss cage scatter tree harsh critic believe'

//REQUESTS
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

export async function getLandingPageURL(driver: WebDriver, extensionID = '') {
  let uuid: string | null
  let landingPageURL: string = ''

  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    const profilePath = (await (await driver.getCapabilities()).get('moz:profile')) as string
    const userPrefsFileContent = fs.readFileSync(`${profilePath}/prefs.js`, 'utf-8')
    if (extensionID) {
      uuid = extensionID
    } else {
      uuid = await getExtensionUuid(userPrefsFileContent)
    }
    if (uuid) {
      landingPageURL = `moz-extension://${uuid}/index.html`
    }
  } else {
    console.log('extension id is', extensionID)
    uuid = extensionID !== '' ? extensionID : e2eExtensionId
    console.log('e2e extensionId is', e2eExtensionId)
    console.log('uuid is', uuid)
    landingPageURL = chromeExtensionURL(uuid)
  }

  console.log('url is', landingPageURL)
  return landingPageURL // Ensure that a string is always returned
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
