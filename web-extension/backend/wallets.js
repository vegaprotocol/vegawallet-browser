import { VegaWallet, HARDENED } from '@vegaprotocol/crypto'
import { generate as generateMnemonic, validate } from '@vegaprotocol/crypto/bip-0039/mnemonic'
import ConcurrentStorage from '../lib/concurrent-storage.js'

export class WalletCollection {
  constructor ({ walletsStore, publicKeyIndexStore }) {
    this.store = new ConcurrentStorage(walletsStore)
    this.index = new ConcurrentStorage(publicKeyIndexStore)
  }

  async get ({ name }) {
    return this.store.get(name)
  }

  async getKeyInfo ({ publicKey }) {
    return this.index.get(publicKey)
  }

  async getKeypair ({ publicKey }) {
    return this.store.transaction(async (store) => {
      const { wallet } = (await this.index.get(publicKey)) ?? {}
      if (wallet == null) return

      const walletConfig = await store.get(wallet)
      if (walletConfig == null) return

      const keyConfig = walletConfig.keys.find((k) => k.publicKey === publicKey)
      if (keyConfig == null) return

      const walletInst = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed))
      const keyPair = await walletInst.keyPair(keyConfig.index)

      return {
        keyPair,
        wallet,
        ...keyConfig
      }
    })
  }

  async list () {
    return Array.from(await this.store.keys())
  }

  async listKeys ({ wallet }) {
    const walletConfig = await this.get({ name: wallet })

    if (walletConfig == null) {
      throw new Error(`Cannot find wallet with name "${wallet}".`)
    }

    return walletConfig.keys
  }

  async exportKey ({ publicKey }) {
    const key = await this.getKeypair({ publicKey })

    if (key == null) {
      throw new Error(`Cannot find key with public key "${publicKey}".`)
    }

    return {
      publicKey: key.keyPair.publicKey.toString(),
      secretKey: key.keyPair.secretKey.toString()
    }
  }

  async generateRecoveryPhrase () {
    const bitStrength = 256 // 24 words
    return (await generateMnemonic(bitStrength)).join(' ')
  }

  async import ({ name, recoveryPhrase }) {
    try {
      await validate(recoveryPhrase)

      const words = recoveryPhrase.split(/\s+/)
      if (words.length !== 24) throw new Error('Recovery phrase must be 24 words')
    } catch (err) {
      throw new Error(err.message)
    }

    return await this.store.transaction(async (store) => {
      if (await store.has(name)) throw new Error(`Wallet with name "${name}" already exists.`)

      const seed = await VegaWallet.deriveSeed(recoveryPhrase)

      await store.set(name, {
        seed: Array.from(seed),
        recoveryPhrase,
        keys: []
      })

      return null
    })
  }

  async _generateKey ({ walletInstance, index, name, metadata, options }) {
    const keyPair = await walletInstance.keyPair(index)
    const publicKey = keyPair.publicKey.toString()

    if (name == null) name = `Key ${keyPair.index - HARDENED}`

    return { name, publicKey, index: keyPair.index, metadata, options }
  }

  async generateKey ({ wallet: walletName, name, metadata, options }) {
    return await this.store.transaction(async (store) => {
      const walletConfig = await store.get(walletName)

      if (walletConfig == null) {
        throw new Error(`Cannot find wallet with name "${walletName}".`)
      }

      const wallet = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed))

      const lastKey = walletConfig.keys.at(-1) ?? {}
      const lastKeyIndex = (lastKey.index ?? HARDENED) + 1
      const key = await this._generateKey({ walletInstance: wallet, name, metadata, options, index: lastKeyIndex })

      walletConfig.keys.push(key)
      await store.set(walletName, walletConfig)

      await this.index.set(key.publicKey, { name: key.name, wallet: walletName, publicKey: key.publicKey })

      return key
    })
  }

  async renameKey ({ publicKey, name }) {
    return await this.store.transaction(async (store) => {
      const indexEntry = (await this.index.get(publicKey))
      const { wallet } = indexEntry ?? {}
      if (indexEntry == null) throw new Error(`Cannot find key with public key "${publicKey}".`)

      const walletConfig = await store.get(wallet)
      if (walletConfig == null) throw new Error(`Cannot find wallet with name "${wallet}".`)

      const keyConfig = walletConfig.keys.find((k) => k.publicKey === publicKey)
      if (keyConfig == null) throw new Error(`Cannot find key with public key "${publicKey}".`)

      keyConfig.name = name
      indexEntry.name = name

      await store.set(wallet, walletConfig)
      await this.index.set(publicKey, indexEntry)

      return keyConfig
    })
  }
}
