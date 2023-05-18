import JSONRPCServer from '../lib/json-rpc-server.js'
import * as adminValidation from '../validation/admin/index.js'
import pkg from '../../../package.json'

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
 * @param {Store} settings Map-like implementation to store settings.
 * @param {WalletCollection} wallets
 * @param {NetworkColleciton} networks
 * @param {Function} onerror Error handler
 * @returns {JSONRPCServer}
 */
export default function init({ encryptedStore, settings, wallets, networks, onerror }) {
  return new JSONRPCServer({
    onerror,
    methods: {
      async 'admin.app_globals'(params) {
        doValidate(adminValidation.appGlobals, params)

        const hasPassphrase = await encryptedStore.exists()
        const isLocked = encryptedStore.isLocked === true
        // TODO this is kinda indeterminate, as we don't know if the storage is empty
        const hasWallet = isLocked ? false : Array.from(await wallets.list()).length > 0

        return {
          passphrase: hasPassphrase,
          wallet: hasWallet,
          // We don't consider the app locked if there is no passphrase
          locked: hasPassphrase && isLocked,
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

        await encryptedStore.create(params.passphrase)

        return null
      },

      async 'admin.update_passphrase'(params) {
        doValidate(adminValidation.updatePassphrase, params)
        if (await encryptedStore.exists() === false) throw new JSONRPCServer.Error('Encryption not initialised', 1)
        await encryptedStore.changePassphrase(params.passphrase, params.newPassphrase)

        return null
      },

      async 'admin.unlock'(params) {
        doValidate(adminValidation.unlock, params)
        if (await encryptedStore.exists() === false) throw new JSONRPCServer.Error('Encryption not initialised', 1)
        await encryptedStore.unlock(params.passphrase)

        return null
      },

      async 'admin.lock'(params) {
        doValidate(adminValidation.lock, params)
        await encryptedStore.lock()

        return null
      },

      async 'admin.list_networks'(params) {
        doValidate(adminValidation.listNetworks, params)
        return { networks: await networks.list() }
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
