// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VegaWallet, HARDENED } from '@vegaprotocol/crypto'
import type { WalletModel } from '@vegaprotocol/wallet-admin'

import { Storage } from '../storage/wrapper'
import { Wallet } from '../storage/schemas/wallet'

export class Keys {
  private store: Storage<Wallet>

  constructor(store: Storage<Wallet>) {
    this.store = store
  }

  async generate(
    params: WalletModel.GenerateKeyParams
  ): Promise<WalletModel.GenerateKeyResult> {
    // TODO: Consider the passphrase when we have encrypted storage
    const walletConfig = await this.store.get(params.wallet)

    if (walletConfig == null)
      throw new Error(`Cannot find wallet with name "${params.wallet}".`)

    const wallet = await VegaWallet.fromSeed(new Uint8Array(walletConfig.seed))

    const lastKey = walletConfig.keys.at(-1)

    const lastKeyIndex = lastKey?.index ?? HARDENED + 1

    const keyPair = await wallet.keyPair(lastKeyIndex + 1)

    let keyName = params.metadata.find((m) => m.key === 'name')?.value
    if (keyName == null) keyName = `Key ${keyPair.index - HARDENED}`

    const metadata = [
      {
        key: 'name',
        value: keyName,
      },
      // Add renaming metadata sans the key name
      ...params.metadata.filter((m) => m.key === 'name'),
    ]

    // TODO: Ideally this should be in a mutex on the storage key
    walletConfig.keys.push({
      index: keyPair.index,
      publicKey: keyPair.pk.toString(),
      metadata,
    })

    await this.store.set(params.wallet, walletConfig)

    return {
      publicKey: keyPair.pk.toString(),
      algorithm: wallet.algorithm,
      metadata,
    }
  }

  async describe(
    params: WalletModel.DescribeKeyParams
  ): Promise<WalletModel.DescribeKeyResult> {
    throw new Error('Not implemented')
  }

  async list(
    params: WalletModel.ListKeysParams
  ): Promise<WalletModel.ListKeysResult> {
    // TODO: Consider the passphrase when we have encrypted storage
    const walletConfig = await this.store.get(params.wallet)

    if (walletConfig == null)
      throw new Error(`Cannot find wallet with name "${params.wallet}".`)

    return {
      keys: walletConfig.keys.map((k) => {
        return {
          publicKey: k.publicKey,
          // Taken the liberty here to make the unnamed key show the first 4 bytes of the PK
          // This should never happen as  the name key should not be able to be deleted
          name:
            k.metadata.find((m) => m.key === 'name')?.value ??
            k.publicKey.slice(0, 8),
        }
      }),
    }
  }

  async annotate(
    params: WalletModel.AnnotateKeyParams
  ): Promise<WalletModel.AnnotateKeyResult> {
    throw new Error('Not implemented')
  }

  // async isolate (params: WalletModel.IsolateKeyParams): Promise<WalletModel.IsolateKeyResult> {
  //   throw new Error('Not implemented')
  // }

  // async rotate (params: WalletModel.RotateKeyParams): Promise<WalletModel.RotateKeyResult> {
  //   throw new Error('Not implemented')
  // }

  async taint(
    params: WalletModel.TaintKeyParams
  ): Promise<WalletModel.TaintKeyResult> {
    throw new Error('Not implemented')
  }

  async untaint(
    params: WalletModel.UntaintKeyParams
  ): Promise<WalletModel.UntaintKeyResult> {
    throw new Error('Not implemented')
  }
}
