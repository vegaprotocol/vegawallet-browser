import { WebDriver } from 'selenium-webdriver'
import * as fs from 'fs'

//URLS
const chromeExtensionURL: string = 'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html'
export const testDAppUrl = 'https://vegaprotocol.github.io/vegawallet-browser/'
export const consoleSmokePublicKey = '10743917237e3f76eabcec06acc4e56807c468c6a84f437c4c9ff75dc2822851'
export const consoleSmokeRecoveryPhrase =
  'deny puzzle bitter bright cost rival foam wall cook urban rotate beach improve problem trumpet happy basket glad total message nuclear indoor media pumpkin'

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

export async function getLandingPageURL(driver: WebDriver) {
  if (process.env.BROWSER?.toLowerCase() === 'firefox') {
    const profilePath = (await (await driver.getCapabilities()).get('moz:profile')) as string
    const userPrefsFileContent = fs.readFileSync(`${profilePath}/prefs.js`, 'utf-8')
    const uuid = await getExtensionUuid(userPrefsFileContent)
    return `moz-extension://${uuid}/index.html`
  } else {
    return chromeExtensionURL
  }
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
