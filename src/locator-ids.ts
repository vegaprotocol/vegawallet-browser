/* We could potentially group a file like this with its corresponding html so for each page we have a corresponding locators file the tests and pages can consume? For now
 this is just a generic locators.ts, this should at least ensure that naming related changes to elements will not require any test maintenance */
export const getStartedButton = 'get-started-button'
export const createNewWalletButton = 'create-new-wallet'

export const loginPassword = 'login-password'
export const loginButton = 'login-button'

export const passwordInput = 'password-input'
export const confirmPasswordInput = 'confirm-password-input'
export const passwordWarningCheckbox = 'acceptedTerms' // by id
export const submitPasswordButton = 'submit-password'
export const importWalletButton = 'import-wallet'
export const saveMnemonicDescription = 'save-mnemonic-description'
export const saveMnemonicButton = 'save-mnemonic-button'

export const networkIndicator = 'network-indicator'
export const walletsWalletName = 'wallets-wallet-name'
export const walletsKeyName = 'wallets-key-name'
export const walletsCreateKey = 'wallets-create-key'
export const walletsAssetHeader = 'wallets-asset-header'
export const walletsDepositLink = 'wallets-deposit-link'
export const walletsError = 'wallets-error'

export const recoveryPhraseWarningCheckbox = 'acceptedTerms' // by id
export const walletsPage = 'wallets-page'
export const errorMessage = 'input-error-text'
export const viewWalletsHeader = 'view-wallets-header'
