import { WebDriver, until } from 'selenium-webdriver'
import { APIHelper } from './wallet-api'
import { initDriver } from '../driver'
import { getLandingPageURL } from './common-wallet-values'
import { CONSTANTS } from '../../../../lib/constants'

export async function createWalletAndDriver(oldExtension = false) {
  const driver = await initDriver(oldExtension)
  const apiHelper = new APIHelper(driver)
  await navigateToExtensionLandingPage(driver)
  await apiHelper.setUpWalletAndKey()
  await navigateToExtensionLandingPage(driver)
  return driver
}

export async function navigateToExtensionLandingPage(driver: WebDriver, extensionID = '') {
  const url = await getLandingPageURL(driver, extensionID)
  await driver.get(url)
  await driver.wait(until.urlContains(url), 10000)
  driver.manage().window().setSize(CONSTANTS.width, CONSTANTS.defaultHeight)
}

export async function setUpWalletAndKey(driver: WebDriver, extensionID = '') {
  const apiHelper = new APIHelper(driver)
  await apiHelper.setUpWalletAndKey()
  await navigateToExtensionLandingPage(driver, extensionID)
}
