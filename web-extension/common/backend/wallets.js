import { VegaWallet, HARDENED } from '@vegaprotocol/crypto'
import { generate as generateMnemonic } from '@vegaprotocol/crypto/bip-0039/mnemonic'
import mutexify from 'mutexify/promise'

export class WalletCollection {
  constructor(store) {
    this.store = store
    this.lock = mutexify()
  }

  async get({ wallet }) {
    return this.store.get(wallet)
  }

  async getKeyByPublicKey({ publicKey }) {
    const pkIndex = (await this.store.get('_index')) ?? {}
    if (pkIndex == null) return

    const walletName = pkIndex[publicKey]
    if (walletName == null) return

    const walletConfig = await this.get({ wallet: walletName })

    if (walletConfig == null) return

    const keyConfig = walletConfig.keys.find((k) => k.publicKey === publicKey)
    if (keyConfig == null) return

    const wallet = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed))
    const keyPair = await wallet.keyPair(keyConfig.index)

    return keyPair
  }

  async list() {
    return Array.from(await this.store.keys()).filter((k) => k !== '_index')
  }

  async listKeys({ wallet }) {
    const walletConfig = await this.get({ wallet })

    if (walletConfig == null) {
      throw new Error(`Cannot find wallet with name "${wallet}".`)
    }

    return walletConfig.keys
  }

  async create({ name }) {
    const release = await this.lock()

    try {
      // TODO: Consider the passphrase when we have encrypted storage
      if (await this.store.has(name))
        throw new Error(`Wallet with name "${name}" already exists.`)

      const bitStrength = 256 // 24 words
      const mnemonic = (await generateMnemonic(bitStrength)).join(' ')

      const seed = await VegaWallet.deriveSeed(mnemonic)

      await this.store.set(name, {
        // TODO: When we make encrypted storage we should be able to persist
        // this Uint8Array in a better way
        seed: Array.from(seed),
        keys: []
      })

      return {
        recoveryPhrase: mnemonic
      }
    } finally {
      release()
      await this.generateKey({
        wallet: name,
        metadata: [{ key: 'name', value: 'Key 1' }]
      })
    }
  }

  async generateKey({ wallet: walletName, metadata: extraMetadata }) {
    const release = await this.lock()
    try {
      // TODO: Consider the passphrase when we have encrypted storage
      const walletConfig = await this.get({ wallet: walletName })

      if (walletConfig == null) {
        throw new Error(`Cannot find wallet with name "${walletName}".`)
      }

      const wallet = await VegaWallet.fromSeed(
        new Uint8Array(walletConfig.seed)
      )

      const lastKey = walletConfig.keys.at(-1)

      const lastKeyIndex = lastKey?.index ?? HARDENED + 1

      const keyPair = await wallet.keyPair(lastKeyIndex + 1)
      const publicKey = keyPair.publicKey.toString()

      let keyName = extraMetadata.find((m) => m.key === 'name')?.value
      if (keyName == null) keyName = `Key ${keyPair.index - HARDENED}`

      const metadata = [
        {
          key: 'name',
          value: keyName
        },
        // Add renaming metadata sans the key name
        ...extraMetadata.filter((m) => m.key === 'name')
      ]

      // TODO: Ideally this should be in a mutex on the storage key
      walletConfig.keys.push({
        index: keyPair.index,
        publicKey,
        name: keyName,
        metadata
      })

      await this.store.set(walletName, walletConfig)

      const pkIndex = (await this.store.get('_index')) ?? {}
      pkIndex[publicKey] = walletName
      await this.store.set('_index', pkIndex)

      return keyPair
    } finally {
      release()
    }
  }
}
