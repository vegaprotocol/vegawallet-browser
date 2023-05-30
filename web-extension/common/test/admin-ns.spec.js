import initAdminServer from '../backend/admin-ns.js'
import { WalletCollection } from '../backend/wallets.js'
import { NetworkCollection } from '../backend/network.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import EncryptedStorage from '../lib/encrypted-storage.js'
import { ConnectionsCollection } from '../backend/connections.js'

const createAdmin = async ({ passphrase } = {}) => {
  const enc = new EncryptedStorage(new Map(), { memory: 10, iterations: 1 })
  const publicKeyIndexStore = new ConcurrentStorage(new Map())
  const server = initAdminServer({
    encryptedStore: enc,
    settings: new ConcurrentStorage(new Map([['selectedNetwork', 'fairground']])),
    wallets: new WalletCollection({
      walletsStore: enc,
      publicKeyIndexStore
    }),
    connections: new ConnectionsCollection({
      connectionsStore: new ConcurrentStorage(new Map()),
      publicKeyIndexStore
    }),
    networks: new NetworkCollection(new Map([['fairground', { name: 'Fairground' }]])),
    onerror(err) {
      throw err
    }
  })

  if (passphrase) {
    await server.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.create_passphrase',
      params: { passphrase }
    })
  }

  return server
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

  it('should create wallet', async () => {
    const admin = await createAdmin({ passphrase: 'foo' })

    const generateRecoveryPhrase = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.generate_recovery_phrase',
      params: null
    })

    const importWallet = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.import_wallet',
      params: {
        name: 'Wallet 1',
        recoveryPhrase: generateRecoveryPhrase.result.recoveryPhrase
      }
    })

    expect(importWallet.result).toEqual(null)
  })

  it('should allow updating the passphase', async () => {
    const admin = await createAdmin({ passphrase: 'foo' })

    const updatePassphrase = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.update_passphrase',
      params: {
        passphrase: 'notfoo',
        newPassphrase: 'bar'
      }
    })

    expect(updatePassphrase.error.toJSON()).toEqual({ code: 1, message: 'Invalid passphrase' })

    const updatePassphrase2 = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.update_passphrase',
      params: {
        passphrase: 'foo',
        newPassphrase: 'bar'
      }
    })

    expect(updatePassphrase2.result).toEqual(null)

    // Lock the wallet
    await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.lock',
      params: null
    })

    const unlockFailure = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.unlock',
      params: {
        passphrase: 'foo'
      }
    })

    expect(unlockFailure.error.toJSON()).toEqual({ code: 1, message: 'Invalid passphrase or corrupted storage' })

    const unlockSuccess = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.unlock',
      params: {
        passphrase: 'bar'
      }
    })

    expect(unlockSuccess.result).toEqual(null)
  })

  it('should not be able to unlock an uninitialised wallet', async () => {
    const admin = await createAdmin()

    const unlockFailure = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.unlock',
      params: {
        passphrase: 'foo'
      }
    })

    expect(unlockFailure.error.toJSON()).toEqual({ code: 1, message: 'Encryption not initialised' })
  })

  it('app_globals should be true after creating a wallet, locking and unlocking', async () => {
    const admin = await createAdmin({ passphrase: 'foo' })

    const generateRecoveryPhrase = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.generate_recovery_phrase',
      params: null
    })

    const importWallet = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.import_wallet',
      params: {
        name: 'Wallet 1',
        recoveryPhrase: generateRecoveryPhrase.result.recoveryPhrase
      }
    })

    expect(importWallet.result).toEqual(null)

    // Lock the wallet
    await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.lock',
      params: null
    })

    const [unlockSuccess, appGlobals] = await Promise.all([
      admin.onrequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'admin.unlock',
        params: {
          passphrase: 'foo'
        }
      }),

      await admin.onrequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'admin.app_globals',
        params: null
      })
    ])

    expect(unlockSuccess.result).toEqual(null)
    expect(appGlobals.result.wallet).toEqual(true)
  })

  it('should list connections', async () => {
    const admin = await createAdmin()

    const listConnections = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.list_connections',
      params: null
    })

    expect(listConnections.result).toEqual({ connections: [] })
  })
})
