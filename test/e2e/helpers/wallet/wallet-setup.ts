import { WebDriver, until } from 'selenium-webdriver'
import { APIHelper } from './wallet-api'
import { initDriver } from '../driver'
import { getLandingPageURL } from './common-wallet-values'

export async function createWalletAndDriver(oldExtension = false) {
  const driver = await initDriver(oldExtension)
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
