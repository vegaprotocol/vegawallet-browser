import ConcurrentStorage from '../lib/concurrent-storage.js'
import JSONRPCServer from '../lib/json-rpc-server.js'
import * as adminValidation from '../validation/admin/index.js'
import pkg from '../../../package.json'
import { WalletCollection } from './wallets.js'

function doValidate(validator, params) {
  if (!validator(params))
    throw new JSONRPCServer.Error(
      validator.errors[0].message,
      1,
      validator.errors.map((e) => e.message)
    )
}

/**
 * Initialise the admin namespace server. The stores passed should be low-level Map-like
 * storage, as the internals of the implementation will wrap these to do encryption and
 * prevent data-races
 *
 * @param {Store} settingsStore Map-like implementation to store settings.
 * @param {Store} walletsStore Map-like implementation to store wallets.
 * @param {Store} publicKeyIndexStore Map-like implementation to store an index of public keys.
 * @param {Store} networksStore Map-like implementation to store networks.
 * @param {Function} onerror Error handler
 * @returns {JSONRPCServer}
 */
export default async function init({ settingsStore, walletsStore, publicKeyIndexStore, networksStore, onerror }) {
  let storedPassphrase = null

  const settings = new ConcurrentStorage(settingsStore)
  const wallets = new WalletCollection({
    walletsStore: new ConcurrentStorage(walletsStore),
    publicKeyIndexStore: new ConcurrentStorage(publicKeyIndexStore)
  })
  const networks = new ConcurrentStorage(networksStore)

  const selectedNetwork = await settings.get('selectedNetwork')

  // If no network is selected or the selected network doesn't exist, select the first one
  if (selectedNetwork == null || !(await networks.has(selectedNetwork))) {
    await settings.set('selectedNetwork', Array.from(await networks.keys())[0])
  }

  return new JSONRPCServer({
    onerror,
    methods: {
      async 'admin.app_globals'(params) {
        doValidate(adminValidation.appGlobals, params)

        const hasPassphrase = storedPassphrase != null
        const hasWallet = Array.from(await walletsStore.keys()).length > 0

        return {
          passphrase: hasPassphrase,
          wallet: hasWallet,
          locked: false,
          version: pkg.version,

          settings: Object.fromEntries(await settings.entries())
        }
      },

      async 'admin.update_app_settings'(params) {
        doValidate(adminValidation.updateAppSettings, params)

        await settings.transaction(async (store) => {
          Object.entries(params).forEach(async ([key, value]) => {
            await store.set(key, value)
          })
        })

        return null
      },

      async 'admin.create_passphrase'(params) {
        doValidate(adminValidation.createPassphrase, params)
        if (storedPassphrase != null) throw new Error('Passphrase already exists')
        storedPassphrase = params.passphrase

        return null
      },

      async 'admin.update_passphrase'(params) {
        doValidate(adminValidation.updatePassphrase, params)
        if (storedPassphrase == null) throw new Error('Passphrase does not exist')
        if (storedPassphrase !== params.passphrase) throw new Error('Passphrase does not match')

        storedPassphrase = params.newPassphrase

        return null
      },

      async 'admin.list_networks'(params) {
        doValidate(adminValidation.listNetworks, params)
        return { networks: Array.from(await networks.keys()) }
      },

      async 'admin.generate_recovery_phrase'(params) {
        doValidate(adminValidation.generateRecoveryPhrase, params)

        return { recoveryPhrase: await wallets.generateRecoveryPhrase() }
      },

      async 'admin.import_wallet'(params) {
        doValidate(adminValidation.importWallet, params)

        await wallets.import(params)
        return null
      },

      async 'admin.list_wallets'(params) {
        doValidate(adminValidation.listWallets, params)

        return { wallets: await wallets.list() }
      },

      async 'admin.list_keys'(params) {
        doValidate(adminValidation.listKeys, params)

        return { keys: Array.from(await wallets.listKeys(params)) }
      },

      async 'admin.generate_key'(params) {
        doValidate(adminValidation.generateKey, params)

        return await wallets.generateKey(params)
      }
    }
  })
}
