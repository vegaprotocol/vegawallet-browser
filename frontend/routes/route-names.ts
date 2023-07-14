export const ROUTE_NAMES = {
  // Auth
  auth: 'auth',
  connections: 'connections',
  wallets: 'wallets',
  transactions: 'transactions',
  settings: 'settings',

  // Onboarding
  onboarding: 'onboarding',
  getStarted: 'get-started',
  importWallet: 'import-wallet',
  createPassword: 'create-password',
  saveMnemonic: 'save-mnemonic',
  confirmMnemonic: 'confirm-mnemonic',
  telemetry: 'telemetry',
  createWallet: 'create-wallet',

  // Misc
  login: 'login'
}

export const ROUTES = {
  home: '/',
  auth: `/${ROUTE_NAMES.auth}`,

  login: `/${ROUTE_NAMES.login}`,

  onboarding: `/${ROUTE_NAMES.onboarding}`,
  getStarted: ROUTE_NAMES.getStarted,
  createPassword: ROUTE_NAMES.createPassword,
  saveMnemonic: ROUTE_NAMES.saveMnemonic,
  telemetry: ROUTE_NAMES.telemetry,
  createWallet: ROUTE_NAMES.createWallet,
  importWallet: ROUTE_NAMES.importWallet,
  confirmMnemonic: ROUTE_NAMES.confirmMnemonic,

  settings: ROUTE_NAMES.settings,
  wallets: ROUTE_NAMES.wallets,
  transactions: ROUTE_NAMES.transactions,
  connections: ROUTE_NAMES.connections
}

export const FULL_ROUTES = {
  home: '/',

  onboarding: `/${ROUTE_NAMES.onboarding}`,
  getStarted: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.getStarted}`,
  createPassword: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.createPassword}`,
  saveMnemonic: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.saveMnemonic}`,
  confirmMnemonic: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.confirmMnemonic}`,
  telemetry: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.telemetry}`,
  createWallet: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.createWallet}`,
  importWallet: `/${ROUTE_NAMES.onboarding}/${ROUTE_NAMES.importWallet}`,

  login: `/${ROUTE_NAMES.login}`,

  auth: `/${ROUTE_NAMES.auth}`,
  settings: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.settings}`,
  wallets: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.wallets}`,
  transactions: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.transactions}`,
  connections: `/${ROUTE_NAMES.auth}/${ROUTE_NAMES.connections}`
}
