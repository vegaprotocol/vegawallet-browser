import { test } from 'brittle'
import initAdminServer from '../backend/admin-ns.js'

test('admin-ns', async (assert) => {
  const admin = await initAdminServer({
    settingsStore: new Map(),
    walletsStore: new Map(),
    networksStore: new Map([['fairground', { name: 'Fairground' }]]),
    publicKeyIndexStore: new Map(),
    onerror(err) {
      assert.fail(err)
    }
  })

  const appGlobals = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
  assert.is(appGlobals.result.passphrase, false, 'passphrase is not set')
  assert.is(appGlobals.result.wallet, false, 'has no wallets')
  assert.is(appGlobals.result.locked, false, 'is not locked')
  assert.ok(/^\d+\.\d+\.\d+$/.test(appGlobals.result.version), 'version is a semver string')
  assert.alike(
    appGlobals.result.settings,
    {
      selectedNetwork: 'fairground'
    },
    'settings is empty'
  )

  const updateAppSettings = await admin.onrequest(
    { jsonrpc: '2.0', id: 1, method: 'admin.update_app_settings', params: { telemetry: false } },
    {}
  )
  assert.is(updateAppSettings.result, null, 'updateAppSettings returns null')

  const appGlobals2 = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
  assert.is(appGlobals2.result.settings.telemetry, false, 'settings.telemetry is false')

  const createPassphrase = await admin.onrequest(
    { jsonrpc: '2.0', id: 1, method: 'admin.create_passpharse', params: { passphrase: 'foo' } },
    {}
  )
  assert.is(createPassphrase.result, null, 'createPassphrase returns null')

  const appGlobals3 = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
  assert.is(appGlobals3.result.passphrase, true, 'passphrase is set')

  const generateRecoveryPhrase = await admin.onrequest(
    { jsonrpc: '2.0', id: 1, method: 'admin.generate_recovery_phrase', params: null },
    {}
  )
  assert.is(generateRecoveryPhrase.result.recoveryPhrase.split(' ').length, 24, 'recovery phrase is 24 words')

  const importWallet = await admin.onrequest(
    {
      jsonrpc: '2.0',
      id: 1,
      method: 'admin.import_wallet',
      params: {
        recoveryPhrase: generateRecoveryPhrase.result.recoveryPhrase,
        name: 'foo'
      }
    },
    {}
  )
  assert.is(importWallet.result, null, 'importWallet returns null')

  const appGlobals4 = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.app_globals', params: null }, {})
  assert.is(appGlobals4.result.wallet, true, 'has a wallet')

  const listWallets = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.list_wallets', params: null }, {})
  assert.is(listWallets.result.wallets.length, 1, 'has one wallet')
  assert.alike(listWallets.result, { wallets: ['foo'] }, 'wallets list is correct')

  const listKeys = await admin.onrequest(
    { jsonrpc: '2.0', id: 1, method: 'admin.list_keys', params: { wallet: 'foo' } },
    {}
  )
  assert.is(listKeys.result.keys.length, 1, 'has one key')
  assert.ok(typeof listKeys.result.keys[0].publicKey === 'string', 'publicKey is a string')
  assert.ok(typeof listKeys.result.keys[0].name === 'string', 'name is a string')

  const listNetworks = await admin.onrequest({ jsonrpc: '2.0', id: 1, method: 'admin.list_networks', params: null }, {})
  assert.is(listNetworks.result.networks.length, 1, 'has one network')
  assert.alike(listNetworks.result, { networks: ['fairground'] }, 'networks list is correct')
})
