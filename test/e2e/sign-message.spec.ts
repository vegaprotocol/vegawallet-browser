import { WebDriver } from 'selenium-webdriver'
import { captureScreenshot } from './driver'
import { createWalletAndDriver } from './wallet-helpers/common'
import { ViewWallet } from './page-objects/view-wallet'

describe('sign message', () => {
  let driver: WebDriver
  let viewWallet: ViewWallet

  beforeEach(async () => {
    driver = await createWalletAndDriver()
    viewWallet = new ViewWallet(driver)
  })

  afterEach(async () => {
    await captureScreenshot(driver, expect.getState().currentTestName as string)
    await driver.quit()
  })

  it('can sign a message successfully', async () => {
    const signMessageView = await viewWallet.openSignMessageView()
    await signMessageView.signMessage('my message')
    await signMessageView.checkMessageSignedAndClose()
    await viewWallet.checkOnViewWalletPage()
  })

  it('can cancel without signing a messsage', async () => {
    const signMessageView = await viewWallet.openSignMessageView()
    await signMessageView.cancelSigning()
    await viewWallet.checkOnViewWalletPage()
  })
})
