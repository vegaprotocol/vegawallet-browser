/* We could potentially group a file like this with its corresponding html so for each page we have a corresponding locators file the tests and pages can consume? For now
 this is just a generic locators.ts, this should at least ensure that naming related changes to elements will not require any test maintenance */
export const createNewWalletButton = 'create-new-wallet'
export const passwordInput = 'password-input'
export const confirmPasswordInput = 'confirm-password-input'
export const passwordWarningCheckbox = 'ack-password-recovery-warning'
export const submitPasswordButton = 'submit-password'
export const revealRecoveryPhraseButton = 'reveal-recovery-phrase'
export const copyRecoveryPhraseToClipboardButton = 'copy-recovery-phrase'
export const recoveryPhraseWarningCheckbox = 'ack-recovery-phrase-warning'
export const secureWalletContinueButton = 'secure-wallet-continue'
export const walletCreatedIcon = 'wallet-created'
export const getStartedButton = 'wallet-get-started'
//This refers to errors that show when not acknowledging warning checkboxes, feel free to rename if too generic
export const errorMessage = 'error-message'
export const reportBugsAndCrashesButtonMessage = 'report-bugs-and-crashes'
export const viewWalletsHeader = 'view-wallets-header'
