import { VegaWallet, HARDENED } from '@vegaprotocol/crypto'
import { generate as generateMnemonic, wordlist } from '@vegaprotocol/crypto/bip-0039/mnemonic'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import JSONRPCServer from '../lib/json-rpc-server.js'

export class WalletCollection {
  constructor({ walletsStore, publicKeyIndexStore }) {
    this.store = new ConcurrentStorage(walletsStore)
    this.index = new ConcurrentStorage(publicKeyIndexStore)
  }

  async get({ name }) {
    return this.store.get(name)
  }

  async getKeyByPublicKey({ publicKey }) {
    return this.store.transaction(async (store) => {
      const { wallet } = await this.index.get(publicKey)
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

  async list() {
    return Array.from(await this.store.keys())
  }

  async listKeys({ wallet }) {
    const walletConfig = await this.get({ name: wallet })

    if (walletConfig == null) {
      throw new Error(`Cannot find wallet with name "${wallet}".`)
    }

    return walletConfig.keys
  }

  async generateRecoveryPhrase() {
    const bitStrength = 256 // 24 words
    return (await generateMnemonic(bitStrength)).join(' ')
  }

  async import({ name, recoveryPhrase }) {
    const words = recoveryPhrase.toLowerCase().split(' ')
    if (words.length !== 24) throw new JSONRPCServer.Error('Recovery phrase must be 24 words long.')
    words.forEach((w) => {
      if (!wordlist.includes(w)) throw new JSONRPCServer.Error(`Word ${w} is not in BIP-0039 word list.`)
    })
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

  async _generateKey({ walletInstance, index, name, metadata, options }) {
    const keyPair = await walletInstance.keyPair(index)
    const publicKey = keyPair.publicKey.toString()

    if (name == null) name = `Key ${keyPair.index - HARDENED}`

    return { name, publicKey, index: keyPair.index, metadata, options }
  }

  async generateKey({ wallet: walletName, name, metadata, options }) {
    return await this.store.transaction(async (store) => {
      const walletConfig = await store.get(walletName)

      if (walletConfig == null) {
        throw new Error(`Cannot find wallet with name "${walletName}".`)
      }

      const wallet = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed))

      const lastKey = walletConfig.keys.at(-1) ?? {}
      const lastKeyIndex = (lastKey.index ?? HARDENED + 1) + 1
      const key = await this._generateKey({ walletInstance: wallet, name, metadata, options, index: lastKeyIndex })

      walletConfig.keys.push(key)
      await store.set(walletName, walletConfig)

      await this.index.set(key.publicKey, { name: key.name, wallet: walletName, publicKey: key.publicKey })

      return key
    })
  }
}
