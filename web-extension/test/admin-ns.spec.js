/* globals expect, it, describe, jest, beforeEach, afterEach */
import initAdminServer from '../backend/admin-ns.js'
import { WalletCollection } from '../backend/wallets.js'
import { NetworkCollection } from '../backend/network.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import EncryptedStorage from '../lib/encrypted-storage.js'
import { ConnectionsCollection } from '../backend/connections.js'
import { createHTTPServer, createJSONHTTPServer } from './helpers.js'
import { CONSTANTS } from '../../lib/constants.js'

const createAdmin = async ({ passphrase, datanodeUrls } = {}) => {
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
    networks: new NetworkCollection(new Map([['fairground', { name: 'Fairground', rest: datanodeUrls ?? [] }]])),
    onerror (err) {
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
  beforeEach(() => {
    jest.clearAllMocks()
  })
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

    expect(updatePassphrase.error).toEqual({ code: 1, message: 'Invalid passphrase' })

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

    expect(unlockFailure.error).toEqual({ code: 1, message: 'Invalid passphrase or corrupted storage' })

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

    expect(unlockFailure.error).toEqual({ code: 1, message: 'Encryption not initialised' })
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

  it('should open popout', async () => {
    // 1107-SETT-001 When the browser wallet is open in a new window, the window stays on top
    const admin = await createAdmin()

    await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.open_popout', params: null }, {})

    expect(globalThis.chrome.windows.create).toBeCalledWith({
      url: 'moz-extension://8b413e68-1e0d-4cad-b98e-1eb000799783/index.html',
      type: 'popup',
      width: CONSTANTS.width,
      height: 600,
      focused: true,
      left: undefined,
      top: undefined
    })
    expect(globalThis.chrome.windows.create).toBeCalledTimes(1)
  })

  it('should not open pop out if one is already open', async () => {
    globalThis.chrome.windows.create.mockResolvedValue({
      id: 1
    })
    const admin = await createAdmin()
    await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.open_popout', params: null }, {})
    expect(globalThis.chrome.windows.create).toBeCalled()
    await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.open_popout', params: null }, {})
    expect(globalThis.chrome.windows.create).toBeCalledTimes(1)
  })

  it('should sign message with given public key', async () => {
    const admin = await createAdmin({ passphrase: 'foo' })

    const importWallet = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.import_wallet',
      params: {
        name: 'Wallet 1',
        recoveryPhrase:
          'mandate verify garage episode glimpse evidence erosion resist fit razor fluid theme remember penalty address media claim beach fiscal taste impact lucky test survey'
      }
    })

    expect(importWallet.result).toEqual(null)

    const generateKey = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.generate_key',
      params: {
        name: 'Key 1',
        wallet: 'Wallet 1'
      }
    })

    const publicKey = generateKey.result.publicKey

    const message = ' '

    const signMessage = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.sign_message',
      params: {
        publicKey,
        message
      }
    })

    expect(signMessage.result).toEqual({
      signature: 'RdgrLZBovd0sCY4RcVFTF5aebV5TwbxkohhpvnJZMw0a1c0+50jqtJqaVTBBf4B3C1PlbvNGfGl4BMiqrr9DAA=='
    })

    const message2 = 'Hello World'

    const signMessage2 = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.sign_message',
      params: {
        publicKey,
        message: message2
      }
    })

    expect(signMessage2.result).toEqual({
      signature: '2tCYSehD1WO0udvU1P92UzkP4BoPB4NLxs3JCGwFKb9oD86njCXoGrVgE1k2zpM7Tcjs3HzSBg8bDCTm3FjUBQ=='
    })

    // generate a new key

    const generateKey2 = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.generate_key',
      params: {
        name: 'Key 2',
        wallet: 'Wallet 1'
      }
    })

    const publicKey2 = generateKey2.result.publicKey

    const signMessage3 = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.sign_message',
      params: {
        publicKey: publicKey2,
        message
      }
    })

    expect(signMessage3.result).toEqual({
      signature: '1f25T84uQ+CTePavhus+nKrIllQr5R1pdipstz8+J+bKDBQM0MGfFjuxRnaR9bqQrgW0xc/z2ma56I4MYInaBA=='
    })

    const signMessage4 = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.sign_message',
      params: {
        publicKey: publicKey2,
        message: message2
      }
    })

    expect(signMessage4.result).toEqual({
      signature: 'sNGQ0io4t3oh/L8z1N8I+/gAai9I7ke10BcsGXmRXC70UHbYD5ysaA9v9/9g6gLBA9gfuXPuGxG9z+86yfYQDg=='
    })
  })

  it('should proxy requests to healthy data node on fetch', async () => {
    const chainHeight = {
      height: '2',
      chainId: 'testnet'
    }

    const expected = {
      assets: ['asset1', 'asset2']
    }

    const happyServer = await createJSONHTTPServer((req) => {
      if (req.url === '/blockchain/height') return { body: chainHeight }

      return { body: expected }
    })

    const sadServer = await createJSONHTTPServer(() => {
      return { statusCode: 500 }
    })

    const malformedServer = await createHTTPServer((req, res) => {
      return res.end('<Malformed JSON>')
    })

    const admin = await createAdmin({ datanodeUrls: [happyServer.url, sadServer.url, malformedServer.url] })

    const fetch = await admin.onrequest({
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.fetch',
      params: {
        path: '/assets'
      }
    })

    expect(fetch.result).toEqual(expected)

    await Promise.all([happyServer.close(), sadServer.close(), malformedServer.close()])
  })

  it(
    'should return errors from unsuccessful fetch (statusCode)',
    setupFaultyFetch({
      statusCode: 400,
      body: ''
    })
  )

  it(
    'should return errors from unsuccessful fetch (malformed response)',
    setupFaultyFetch({
      statusCode: 200,
      body: '<Malformed JSON>'
    })
  )

  function setupFaultyFetch (faultyResponse) {
    return async () => {
      const chainHeight = {
        height: '2',
        chainId: 'testnet'
      }

      const server = await createHTTPServer((req, res) => {
        if (req.url === '/blockchain/height') return res.end(JSON.stringify(chainHeight))

        res.writeHead(faultyResponse.statusCode, { 'Content-Type': 'application/json' })
        res.end(faultyResponse.body)
      })

      const admin = await createAdmin({ datanodeUrls: [server.url] })

      const fetch = await admin.onrequest({
        jsonrpc: '2.0',
        id: 1,
        method: 'admin.fetch',
        params: {
          path: '/assets'
        }
      })

      expect(fetch.result).toBeUndefined()
      expect(fetch.error).toEqual({
        code: -1,
        message: 'Failed to fetch data',
        data: expect.any(String)
      })

      await Promise.all([server.close()])
    }
  }

  const REQ_GENERATE_RECOVERY_PHRASE = (id) => ({
    jsonrpc: '2.0',
    id,
    method: 'admin.generate_recovery_phrase',
    params: null
  })

  const REQ_IMPORT_WALLET = (id, recoveryPhrase, name = 'Wallet 1') => ({
    jsonrpc: '2.0',
    id,
    method: 'admin.import_wallet',
    params: {
      name,
      recoveryPhrase
    }
  })

  const REQ_GENERATE_KEY = (id, name = 'Key 1', wallet = 'Wallet 1') => ({
    jsonrpc: '2.0',
    id,
    method: 'admin.generate_key',
    params: {
      name,
      wallet
    }
  })

  const REQ_EXPORT_KEY = (id, publicKey, passphrase) => ({
    jsonrpc: '2.0',
    id,
    method: 'admin.export_key',
    params: {
      publicKey,
      passphrase
    }
  })

  const REQ_RENAME_KEY = (id, publicKey, name) => ({
    jsonrpc: '2.0',
    id,
    method: 'admin.rename_key',
    params: {
      publicKey,
      name
    }
  })

  const REQ_LIST_KEYS = (id, wallet = 'Wallet 1') => ({
    jsonrpc: '2.0',
    id,
    method: 'admin.list_keys',
    params: {
      wallet
    }
  })

  describe('admin.export_key', () => {
    const passphrase = 'foo'
    let admin
    let key
    beforeEach(async () => {
      admin = await createAdmin({ passphrase })

      const generateRecoveryPhrase = await admin.onrequest(REQ_GENERATE_RECOVERY_PHRASE(1))
      expect(generateRecoveryPhrase.error).toBeUndefined()

      const importWallet = await admin.onrequest(REQ_IMPORT_WALLET(2, generateRecoveryPhrase.result.recoveryPhrase))
      expect(importWallet.error).toBeUndefined()

      const generateKey = await admin.onrequest(REQ_GENERATE_KEY(3))
      expect(generateKey.error).toBeUndefined()

      key = generateKey.result
    })

    afterEach(() => {
      admin = null
      key = null
    })

    it('should not export key with wrong public key', async () => {
      const exportKey = await admin.onrequest(REQ_EXPORT_KEY(4, 'wrong-public-key', passphrase))
      expect(exportKey.error).toMatchObject({
        code: 1,
        message: expect.stringMatching(/Cannot find key with public key/)
      })
    })

    it('should not export key with wrong passphrase', async () => {
      const exportKey = await admin.onrequest(REQ_EXPORT_KEY(4, key.publicKey, 'wrong-passphrase'))
      expect(exportKey.error).toEqual({
        code: 1,
        message: 'Invalid passphrase or corrupted storage'
      })
    })

    it('should export key', async () => {
      const exportKey = await admin.onrequest(REQ_EXPORT_KEY(4, key.publicKey, passphrase))
      expect(exportKey.error).toBeUndefined()
      expect(exportKey.result.publicKey).toBe(key.publicKey)
      expect(exportKey.result.secretKey).not.toBeNull()
    })
  })

  describe('admin.rename_key', () => {
    const passphrase = 'foo'
    let admin
    let key
    beforeEach(async () => {
      admin = await createAdmin({ passphrase })

      const generateRecoveryPhrase = await admin.onrequest(REQ_GENERATE_RECOVERY_PHRASE(1))
      expect(generateRecoveryPhrase.error).toBeUndefined()

      const importWallet = await admin.onrequest(REQ_IMPORT_WALLET(2, generateRecoveryPhrase.result.recoveryPhrase))
      expect(importWallet.error).toBeUndefined()

      const generateKey = await admin.onrequest(REQ_GENERATE_KEY(3))
      expect(generateKey.error).toBeUndefined()

      key = generateKey.result
    })

    afterEach(() => {
      admin = null
      key = null
    })

    it('should not rename key with wrong public key', async () => {
      const renameKey = await admin.onrequest(REQ_RENAME_KEY(4, 'wrong-public-key', 'New Name'))
      expect(renameKey.error).toMatchObject({
        code: 1,
        message: expect.stringMatching(/Cannot find key with public key/)
      })

      const listKeys = await admin.onrequest(REQ_LIST_KEYS(5))
      expect(listKeys.error).toBeUndefined()
      expect(listKeys.result.keys).toEqual([{ ...key, name: 'Key 1' }])
    })

    it('should rename key', async () => {
      const renameKey = await admin.onrequest(REQ_RENAME_KEY(4, key.publicKey, 'New Name'))
      expect(renameKey.error).toBeUndefined()

      const listKeys = await admin.onrequest(REQ_LIST_KEYS(5))
      expect(listKeys.error).toBeUndefined()
      expect(listKeys.result.keys).toEqual([{ ...key, name: 'New Name' }])
    })

    it('should allow multiple keys with same name', async () => {
      const generateKey2 = await admin.onrequest(REQ_GENERATE_KEY(4, 'Key 1'))
      expect(generateKey2.error).toBeUndefined()

      const listKeys = await admin.onrequest(REQ_LIST_KEYS(5))
      expect(listKeys.error).toBeUndefined()
      expect(listKeys.result.keys).toEqual([
        { ...key, name: 'Key 1' },
        { ...generateKey2.result, name: 'Key 1' }
      ])

      const renameKey = await admin.onrequest(REQ_RENAME_KEY(6, generateKey2.result.publicKey, 'New Name'))
      expect(renameKey.error).toBeUndefined()

      const renameKey2 = await admin.onrequest(REQ_RENAME_KEY(7, key.publicKey, 'New Name'))
      expect(renameKey2.error).toBeUndefined()

      const listKeys2 = await admin.onrequest(REQ_LIST_KEYS(8))
      expect(listKeys2.error).toBeUndefined()
      expect(listKeys2.result.keys).toEqual([
        { ...key, name: 'New Name' },
        { ...generateKey2.result, name: 'New Name' }
      ])
    })
  })
})
