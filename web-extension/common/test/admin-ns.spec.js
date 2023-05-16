import initAdminServer from '../backend/admin-ns.js'
import { WalletCollection } from '../backend/wallets.js'
import { NetworkCollection } from '../backend/network.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import EncryptedStorage from '../lib/encrypted-storage.js'

const createAdmin = async () => {
  const enc = new EncryptedStorage(new Map())
  return initAdminServer({
    encryptedStore: enc,
    settings: new ConcurrentStorage(new Map([['selectedNetwork', 'fairground']])),
    wallets: new WalletCollection({
      walletsStore: enc,
      publicKeyIndexStore: new Map()
    }),
    networks: new NetworkCollection(new Map([['fairground', { name: 'Fairground' }]])),
    onerror(err) {
      throw err
    }
  })
}

describe('admin-ns', () => {
  it('should return app globals', async () => {
    const admin = await createAdmin()
    const appGlobals = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
    expect(appGlobals.result.passphrase).toBe(false)
    expect(appGlobals.result.wallet).toBe(false)
    expect(appGlobals.result.locked).toBe(false)
    expect(/^\d+\.\d+\.\d+$/.test(appGlobals.result.version)).toBe(true)
    expect(appGlobals.result.settings).toEqual({ selectedNetwork: 'fairground' })
  })
  it('should update app settings', async () => {
    const admin = await createAdmin()
    const updateAppSettings = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.update_app_settings',
      params: { telemetry: false }
    })

    expect(updateAppSettings.result).toBe(null)
    const appGlobals2 = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
    expect(appGlobals2.result.settings.telemetry).toBe(false)
  })
  it('should create passphrase', async () => {
    const admin = await createAdmin()

    const createPassphrase = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.create_passphrase',
      params: { passphrase: 'foo' }
    })
    expect(createPassphrase.result).toBe(null)
    const appGlobals3 = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
    expect(appGlobals3.result.passphrase).toBe(true)
  })
  it('should generate recovery phrase', async () => {
    const admin = await createAdmin()

    const generateRecoveryPhrase = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.generate_recovery_phrase',
      params: null
    })
    expect(generateRecoveryPhrase.result.recoveryPhrase.split(' ').length).toBe(24)
  })
  it('should list networks', async () => {
    const admin = await createAdmin()

    const listNetworks = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.list_networks',
      params: null
    })

    expect(listNetworks.result).toEqual({ networks: ['fairground'] })
  })
})
