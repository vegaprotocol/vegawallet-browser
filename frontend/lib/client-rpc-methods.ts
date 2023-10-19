export const RpcMethods = {
  // Wallets
  ListWallets: 'admin.list_wallets',
  ListKeys: 'admin.list_keys',
  GenerateKey: 'admin.generate_key',
  ExportKey: 'admin.export_key',
  RenameKey: 'admin.rename_key',

  // Onboarding
  CreatePassphrase: 'admin.create_passphrase',
  GenerateRecoveryPhrase: 'admin.generate_recovery_phrase',
  ImportWallet: 'admin.import_wallet',
  AppGlobals: 'admin.app_globals',

  // Login
  Lock: 'admin.lock',
  Unlock: 'admin.unlock',

  // Connections
  ListConnections: 'admin.list_connections',
  ConnectionsChange: 'admin.connections_change',
  OpenPopout: 'admin.open_popout',
  UpdateSettings: 'admin.update_app_settings',
  RemoveConnection: 'admin.remove_connection',

  // Misc
  SignMessage: 'admin.sign_message',
  Fetch: 'admin.fetch'
}
