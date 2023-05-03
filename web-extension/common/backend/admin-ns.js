import ConcurrentStorage from '../lib/concurrent-storage'
import JSONRPCServer from '../lib/json-rpc-server'
import * as adminValidation from '../validation/admin/index.js'
import { version } from '../../package.json' assert { type: "json" }
import { generate as generateMnemonic } from '@vegaprotocol/crypto/bip-0039/mnemonic'

function doValidate(validator, params) {
  if (!validator(params))
    throw new JSONRPCServer.Error(
      validator.errors[0].message,
      1,
      validator.errors.map((e) => e.message)
    )
}

export default function init() {
  let storedPassphrase = null
  let selectedNetwork = null

  const settings = new ConcurrentStorage(new Map())
  const wallets = new ConcurrentStorage(new Map())
  const networks = new ConcurrentStorage(new Map())

  return new JSONRPCServer({
    methods: {
      async 'admin.app_globals'() {
        doValidate(adminValidation.appGlobals, params)

        const hasPassphrase = storedPassphrase != null
        const hasWallet = Array.from(await wallets.list()).length > 0

        return {
          passphrase: hasPassphrase,
          wallet: hasWallet,
          locked: false,
          version,

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

      async 'admin.create_passpharse'(params) {
        doValidate(adminValidation.createPassphrase, params)
        if (storedPassphrase != null) throw new Error('Passphrase already exists')
        storedPassphrase = params.passphrase

        return null
      },

      async 'admin.update_passpharse'(params) {
        doValidate(adminValidation.updatePassphrase, params)
        if (storedPassphrase == null) throw new Error('Passphrase does not exist')
        if (storedPassphrase !== params.passphrase) throw new Error('Passphrase does not match')

        storedPassphrase = params.new_passphrase

        return null
      },
      async 'admin.list_networks'(params) {
        doValidate(adminValidation.listNetworks, params)
        return await networks.list()
      },
      async 'admin.selected_network'(params) {
        doValidate(adminValidation.selectedNetwork, params)

        return { network: selectedNetwork }
      },

      async 'admin.generate_recovery_phrase'(params) {
        doValidate(adminValidation.generateRecoveryPhrase, params)

        // 24 words = 256 bits
        return { recovery_phrase: (await generateMnemonic(256)).join(' ') }
      },
      async 'admin.import_wallet'(params) {
        doValidate(adminValidation.importWallet, params)
        return {}
      },

      async 'admin.list_wallets'(params) {
        doValidate(adminValidation.listWallets, params)
        return []
      },

      async 'admin.list_keys'(params) {
        doValidate(adminValidation.listKeys, params)
        return []
      },

      async 'admin.generate_key'(params) {
        doValidate(adminValidation.generateKey, params)
        return {}
      },

      async 'admin.describe_key'(params) {
        doValidate(adminValidation.describeKey, params)
        return {}
      },

      async 'admin.update_key'(params) {
        doValidate(adminValidation.updateKey, params)
        return {}
      }
    }
  })
}
