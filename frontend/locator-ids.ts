/* We could potentially group a file like this with its corresponding html so for each page we have a corresponding locators file the tests and pages can consume? For now
 this is just a generic locators.ts, this should at least ensure that naming related changes to elements will not require any test maintenance */
export const getStartedButton = 'get-started-button'
export const createNewWalletButton = 'create-new-wallet'

export const loginPassphrase = 'login-passphrase'
export const loginButton = 'login-button'

export const passphraseInput = 'passphrase-input'
export const confirmPassphraseInput = 'confirm-passphrase-input'
export const passphraseWarningCheckbox = 'acceptedTerms' // by id
export const submitPassphraseButton = 'submit-passphrase-button'
export const importWalletButton = 'import-wallet'
export const saveMnemonicDescription = 'save-mnemonic-description'
export const saveMnemonicButton = 'save-mnemonic-button'
export const secureYourWalletPage = 'secure-your-wallet'

export const networkIndicator = 'network-indicator'
export const walletsWalletName = 'wallets-wallet-name'
export const walletsKeyName = 'wallets-key-name'
export const walletsCreateKey = 'wallets-create-key'
export const walletsAssetHeader = 'wallets-asset-header'
export const walletsDepositLink = 'wallets-deposit-link'
export const walletsError = 'wallets-error'
export const revealRecoveryPhraseButton = 'reveal-recovery-phrase'
export const copyRecoveryPhraseToClipboardButton = 'copy-recovery-phrase'
export const secureWalletContinueButton = 'secure-wallet-continue'
export const walletCreatedIcon = 'wallet-created'

export const importMnemonic = 'import-mnemonic'
export const importMnemonicSubmit = 'import-mnemonic-submit'
export const importMnemonicDescription = 'import-mnemonic-description'
//This refers to errors that show when not acknowledging warning checkboxes, feel free to rename if too generic
export const reportBugsAndCrashesButtonMessage = 'report-bugs-and-crashes'
export const walletsPage = 'wallets-page'
export const errorMessage = 'input-error-text'
export const recoveryPhraseWarningCheckbox = 'acceptedTerms' // by id
export const viewWalletsHeader = 'view-wallets-header'

export const settingsPage = 'settings-page'
export const settingsVersionTitle = 'settings-version-title'
export const settingsVersionNumber = 'settings-version-number'
export const settingsLockButton = 'settings-lock-button'
export const settingsFeedbackDescription = 'settings-feedback-description'
export const settingsFeedbackLink = 'settings-feedback-link'

export const connectionsConnection = 'connections-connection'
