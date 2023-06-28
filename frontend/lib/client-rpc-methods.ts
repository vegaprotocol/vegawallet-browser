export const RpcMethods = {
  // Wallets
  ListWallets: 'admin.list_wallets',
  ListKeys: 'admin.list_keys',
  GenerateKey: 'admin.generate_key',

  // Onboarding
  CreatePassphrase: 'admin.create_passphrase',
  GenerateRecoveryPhrase: 'admin.generate_recovery_phrase',
  ImportWallet: 'admin.import_wallet',
  AppGlobals: 'admin.app_globals',

  // Login
  Lock: 'admin.lock',
  Unlock: 'admin.unlock',
  OpenPopout: 'admin.open_popout',

  // Connections
  ListConnections: 'admin.list_connections',
  ConnectionsChange: 'admin.connections_change',
  OpenPopout: 'admin.open_popout',
  UpdateSettings: 'admin.update_app_settings',
  RemoveConnection: 'admin.remove_connection'
}
