import { WebDriver } from 'selenium-webdriver'
import {
  captureScreenshot,
  extensionPath,
  getHandleWithExtensionAutoOpened,
  initDriver,
  oldExtensionDirectory
} from './helpers/driver'
import { NavPanel } from './page-objects/navpanel'
import { windowHandleHasCount } from './helpers/selenium-util'
import { navigateToExtensionLandingPage, setUpWalletAndKey } from './helpers/wallet/wallet-setup'
import { copyDirectoryToNewLocation, updateOrAddJsonProperty } from './helpers/file-system'
import { chromePublicKey } from '../../rollup/postbuild'
import { GetStarted } from './page-objects/get-started'
import { Settings } from './page-objects/settings'

// Check if the UPGRADE environment variable is set to 'true'
if (process.env.UPGRADE === 'true') {
  describe('Check migration of settings after upgrade', () => {
    let driver: WebDriver
    let navPanel: NavPanel
    let settingsPage: Settings
    const expectedTelemetryDisabledMessage = 'expected telemetry to be disabled but it was not'
    const expectedAutoOpenEnabledMessage = 'expected auto open to be enabled but it was not'

    beforeAll(async () => {
      await updateOrAddJsonProperty(oldExtensionDirectory + '/manifest.json', 'key', chromePublicKey)
      driver = await initDriver(true)
      await windowHandleHasCount(driver, 2)
      const handles = await driver.getAllWindowHandles()
      let extensionID = await getHandleWithExtensionAutoOpened(driver, handles)
      navPanel = new NavPanel(driver)
      await navPanel.goToSettings()
      await copyDirectoryToNewLocation(extensionPath + '/chrome', oldExtensionDirectory)
      await navigateToExtensionLandingPage(driver, extensionID)
      settingsPage = await navPanel.goToSettings()
    })

    afterEach(async () => {
      await captureScreenshot(driver, expect.getState().currentTestName as string)
      await driver.quit()
    })

    it('can navigate to settings and update telemetry opt in/out preference', async () => {
      expect(await settingsPage.isTelemetrySelected(), expectedTelemetryDisabledMessage).toBe(false)
      expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenEnabledMessage).toBe(true)
      await settingsPage.lockWalletAndCheckLoginPageAppears()
    })
  })
}
