import { WebDriver } from 'selenium-webdriver'
import {
  captureScreenshot,
  extensionPath,
  getHandleWithExtensionAutoOpened,
  initDriver,
  oldExtensionDirectory
} from '../e2e/helpers/driver'
import { NavPanel } from '../e2e/page-objects/navpanel'
import { switchWindowHandles, windowHandleHasCount } from '../e2e/helpers/selenium-util'
import { navigateToExtensionLandingPage } from '../e2e/helpers/wallet/wallet-setup'
import { copyDirectoryToNewLocation, updateOrAddJsonProperty } from '../e2e/helpers/file-system'
import { chromePublicKey } from '../../rollup/postbuild'
import { Settings } from '../e2e/page-objects/settings'
import { Login } from '../e2e/page-objects/login'

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
    await updateOrAddJsonProperty(oldExtensionDirectory + '/manifest.json', 'key', chromePublicKey)
    await driver.executeScript('await chrome.runtime.reload()')
    expect(await windowHandleHasCount(driver, 1)).toBe(true)
    await switchWindowHandles(driver, false, (await driver.getAllWindowHandles())[0])
    await navigateToExtensionLandingPage(driver, extensionID)
    await new Login(driver).login()
    settingsPage = await navPanel.goToSettings()
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('the correct settings defaults are loaded when upgrading', async () => {
    expect(await settingsPage.isTelemetrySelected(), expectedTelemetryDisabledMessage).toBe(false)
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenEnabledMessage).toBe(true)
    await settingsPage.lockWalletAndCheckLoginPageAppears()
  })
})
