import { By, WebDriver } from 'selenium-webdriver'
import {
  clickElement,
  getByDataTestID,
  isElementDisplayed,
  sendKeysToElement,
  waitForElementToDisappear
} from '../selenium-util'
import { locators as signMessageLocators } from '../../../frontend/components/sign-message-dialog/sign-message'
import { locators as signedMessageLocators } from '../../../frontend/components/sign-message-dialog/signed-message'

export class SignMessage {
  private readonly signButton: By = getByDataTestID(signMessageLocators.signButton)
  private readonly cancelButton: By = getByDataTestID(signMessageLocators.cancelButton)
  private readonly messageField: By = getByDataTestID(signMessageLocators.messageInput)

  private readonly doneButton: By = getByDataTestID(signedMessageLocators.signedMessageDoneButton)
  private readonly signedMessageHeader: By = getByDataTestID(signedMessageLocators.signedMessageHeader)
  private readonly signedMessageText: By = getByDataTestID('code-window-content')

  constructor(private readonly driver: WebDriver) {}

  async checkOnSignMessageview() {
    expect(
      await this.isSignMessageView(),
      "expected to be on the 'sign message' view but could not locate the 'sign' button",
      {
        showPrefix: false
      }
    ).toBe(true)
  }

  async isSignMessageView() {
    return await isElementDisplayed(this.driver, this.signButton)
  }

  async signMessage(message: string) {
    await this.checkOnSignMessageview()
    await sendKeysToElement(this.driver, this.messageField, message)
    await clickElement(this.driver, this.signButton)
  }

  async cancelSigning() {
    await this.checkOnSignMessageview()
    await clickElement(this.driver, this.cancelButton)
    await waitForElementToDisappear(this.driver, this.signButton)
  }

  async checkMessageSigned() {
    expect(await isElementDisplayed(this.driver, this.signedMessageText), 'could not locate a signed message', {
      showPrefix: false
    }).toBe(true)
  }

  async checkMessageSignedAndClose() {
    await this.checkMessageSigned()
    await clickElement(this.driver, this.doneButton)
    await waitForElementToDisappear(this.driver, this.signedMessageHeader)
  }
}
