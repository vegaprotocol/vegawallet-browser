import { By, WebDriver } from 'selenium-webdriver'
import { captureScreenshot, extensionPath, initDriver, oldExtensionDirectory } from './helpers/driver'
import { NavPanel } from './page-objects/navpanel'
import {
  clickElement,
  getAttribute,
  goToNewWindowHandle,
  switchWindowHandles,
  windowHandleHasCount
} from './helpers/selenium-util'
import { VegaAPI } from './helpers/wallet/vega-api'
import { Transaction } from './page-objects/transaction'
import { ConnectWallet } from './page-objects/connect-wallet'
import { Settings } from './page-objects/settings'
import { ExtensionHeader } from './page-objects/extension-header'
import { navigateToExtensionLandingPage } from './helpers/wallet/wallet-setup'
import { copyDirectoryToNewLocation, overrideJson } from './helpers/file-system'
import { chromePublicKey } from '../../rollup/postbuild'
import { APIHelper } from './helpers/wallet/wallet-api'

describe('Check migration of settings after upgrade', () => {
  let driver: WebDriver
  let connectWalletModal: ConnectWallet
  let navPanel: NavPanel
  let settingsPage: Settings
  let transaction: Transaction
  let header: ExtensionHeader
  let vegaAPI: VegaAPI
  let apiHelper: APIHelper
  const expectedTelemetryDisabledMessage = 'expected telemetry to be disabled but it was not'
  const expectedAutoOpenEnabledMessage = 'expected auto open to be enabled but it was not'
  const developerModeToggle: By = By.css('#devMode')
  const update: By = By.id('updateNow')

  beforeAll(async () => {
    let useOldExtension = false
    console.log('is it upgrade?')
    console.log('env var is', process.env.UPGRADE)
    if (process.env.UPGRADE === 'true') {
      console.log('UPGRADE WOO')
      useOldExtension = true
      await overrideJson(oldExtensionDirectory, 'key', chromePublicKey)
      console.log('overrode that mofo')
    } else {
      console.log('nah bruv')
    }
    driver = await initDriver(useOldExtension)
    if (useOldExtension) {
      await copyDirectoryToNewLocation(extensionPath + '/chrome', oldExtensionDirectory)
      await driver.get('chrome://extensions')
      const devModeEnabled = (await getAttribute(driver, developerModeToggle, 'aria-pressed')) === 'true'
      if (!devModeEnabled) {
        await clickElement(driver, developerModeToggle)
      }
      await clickElement(driver, update)
    }
    apiHelper = new APIHelper(driver)
    navPanel = new NavPanel(driver)
    await apiHelper.setUpWalletAndKey()
    await navigateToExtensionLandingPage(driver)
    await navPanel.goToSettings()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    //await driver.quit()
  })

  it('can navigate to settings and update telemetry opt in/out preference', async () => {
    // 1111-TELE-008 There is a way to change whether I want to opt in / out of error reporting later (e.g. in settings)
    const navPanel = new NavPanel(driver)
    const settingsPage = await navPanel.goToSettings()
    expect(await settingsPage.isTelemetrySelected(), expectedTelemetryDisabledMessage).toBe(false)
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenEnabledMessage).toBe(true)
    await settingsPage.lockWalletAndCheckLoginPageAppears()
  })
})
