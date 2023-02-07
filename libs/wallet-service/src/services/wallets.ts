// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VegaWallet, HARDENED } from '@vegaprotocol/crypto'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { generate as generateMnemonic } from '@vegaprotocol/crypto/bip-0039/mnemonic'
import type { WalletModel } from '@vegaprotocol/wallet-admin'

import type { Storage } from '../storage/wrapper'
import { Wallet } from '../storage/schemas/wallet'

const KEY_DERIVATION_VERSION = 2
const WALLET_TYPE = 'HD Wallet'

export class Wallets {
  private store: Storage<Wallet>

  constructor(store: Storage<Wallet>) {
    this.store = store
  }

  async create(
    params: WalletModel.CreateWalletParams
  ): Promise<WalletModel.CreateWalletResult> {
    // TODO: Consider the passphrase when we have encrypted storage
    if (await this.store.has(params.wallet))
      throw new Error(`Wallet with name "${params.wallet}" already exists.`)

    const bitStrength = 256 // 24 words
    const mnemonic = (await generateMnemonic(bitStrength)).join(' ')

    const seed = await VegaWallet.deriveSeed(mnemonic)

    const wallet = await VegaWallet.fromSeed(seed)

    const keyPair = await wallet.keyPair(HARDENED + 1)

    const metadata = [{ key: 'name', value: 'Key 1' }]
    await this.store.set(params.wallet, {
      // TODO: When we make encrypted storage we should be able to persist
      // this Uint8Array in a better way
      seed: Array.from(seed),
      keys: [
        { index: keyPair.index, publicKey: keyPair.pk.toString(), metadata },
      ],
    })

    return {
      wallet: {
        name: params.wallet,
        keyDerivationVersion: KEY_DERIVATION_VERSION,
        recoveryPhrase: mnemonic,
        filePath: '',
      },
      key: {
        algorithm: wallet.algorithm,
        metadata,
        publicKey: keyPair.pk.toString(),
      },
    }
  }

  async import(
    params: WalletModel.ImportWalletParams
  ): Promise<WalletModel.ImportWalletResult> {
    throw new Error('Not Implemented')
  }

  async list(
    params: WalletModel.ListWalletsParams
  ): Promise<WalletModel.ListWalletsResult> {
    return {
      wallets: Array.from(await this.store.keys()),
    }
  }

  async describe(
    params: WalletModel.DescribeWalletParams
  ): Promise<WalletModel.DescribeWalletResult> {
    // TODO: Consider the passphrase when we have encrypted storage
    const walletConfig = await this.store.get(params.wallet)

    if (walletConfig == null)
      throw new Error(`Cannot find wallet with name "${params.wallet}".`)

    const wallet = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed))

    return {
      name: params.wallet,
      keyDerivationVersion: KEY_DERIVATION_VERSION,
      type: WALLET_TYPE,
      id: wallet.id,
    }
  }

  async rename(
    params: WalletModel.RenameWalletParams
  ): Promise<WalletModel.RenameWalletResult> {
    throw new Error('Not implemented')
  }

  async remove(
    params: WalletModel.RemoveWalletParams
  ): Promise<WalletModel.RemoveWalletResult> {
    // TODO: Consider the passphrase when we have encrypted storage
    if (await this.store.delete(params.wallet)) return null

    throw new Error('Invalid wallet')
  }
}
