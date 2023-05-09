import { WebDriver } from 'selenium-webdriver'

const landingPageURL: string = 'chrome-extension://jfaancmgehieoohdnmcdfdlkblfcehph/index.html'

export async function navigateToLandingPage(driver: WebDriver) {
  await driver.get(landingPageURL)
}
