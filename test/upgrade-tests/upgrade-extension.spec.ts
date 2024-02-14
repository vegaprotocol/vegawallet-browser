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
import { APIHelper } from '../e2e/helpers/wallet/wallet-api'
import config from '../../config/testnet'

expect.extend({
  nullOrAny(received, expected) {
    if (received === null) {
      return {
        pass: true,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }

    if (expected == String) {
      return {
        pass: typeof received == 'string' || received instanceof String,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }

    if (expected == Number) {
      return {
        pass: typeof received == 'number' || received instanceof Number,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }

    if (expected == Function) {
      return {
        pass: typeof received == 'function' || received instanceof Function,
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }

    if (expected == Object) {
      return {
        pass: received !== null && typeof received == 'object',
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }

    if (expected == Boolean) {
      return {
        pass: typeof received == 'boolean',
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }

    /* jshint -W122 */
    /* global Symbol */
    if (typeof Symbol != 'undefined' && this.expectedObject == Symbol) {
      return {
        pass: typeof received == 'symbol',
        message: () =>
          `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
            received
          )}`
      }
    }
    /* jshint +W122 */

    return {
      pass: received instanceof expected,
      message: () =>
        `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(
          received
        )}`
    }
  }
})

describe('Check migration of settings after upgrade', () => {
  let driver: WebDriver
  let apiHelper: APIHelper
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
    apiHelper = new APIHelper(driver)
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
    // await driver.quit()
  })

  it('the correct settings defaults are loaded when upgrading', async () => {
    expect(await settingsPage.isTelemetrySelected(), expectedTelemetryDisabledMessage).toBe(false)
    expect(await settingsPage.isAutoOpenSelected(), expectedAutoOpenEnabledMessage).toBe(true)
    await settingsPage.lockWalletAndCheckLoginPageAppears()
  })

  it('adjusts the networks as required', async () => {
    const networks = await apiHelper.listNetworks()
    const { networks: configNetworks } = config

    expect(networks.sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))).toStrictEqual(
      configNetworks
        .sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))
        .map((n) => {
          delete n.preferredNode
          return {
            ...n,
            // @ts-ignore
            _nodeTimeout: expect.nullOrAny(Number),
            // @ts-ignore
            probing: expect.nullOrAny(Boolean)
          }
        })
    )
  })
})
