import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot, initDriver } from './driver'
import { ViewWallet } from './page-objects/view-wallet'
import { navigateToExtensionLandingPage } from './wallet-helpers/common'
import { APIHelper } from './wallet-helpers/api-helpers'
import { ErrorModal } from './page-objects/error'

describe('Global error', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet
  let apiHelper: APIHelper
  let errorModal: ErrorModal

  beforeEach(async () => {
    driver = await initDriver()
    viewWallet = new ViewWallet(driver)
    apiHelper = new APIHelper(driver)
    errorModal = new ErrorModal(driver)
    await navigateToExtensionLandingPage(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('shows global error page when an unhandled error comes from the backend', async () => {
    await setUpWalletAndKey()
    await apiHelper.request('some.method.that.does.not.exist')
    await errorModal.checkOnErrorPage()
    await errorModal.clickCloseButton()
    await viewWallet.checkOnViewWalletPage()
  })

  async function setUpWalletAndKey() {
    await apiHelper.setUpWalletAndKey()
    await navigateToExtensionLandingPage(driver)
  }
})
