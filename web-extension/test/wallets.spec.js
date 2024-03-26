import { WalletCollection } from '../backend/wallets.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import EncryptedStorage from '../lib/encrypted-storage.js'

const createWallets = async () => {
  const enc = new EncryptedStorage(new Map(), { memory: 10, iterations: 1 })
  await enc.create('p')
  return {
    enc,
    wallets: new WalletCollection({
      walletsStore: new ConcurrentStorage(enc),
      publicKeyIndexStore: new ConcurrentStorage(new Map()),
      keySortIndex: new ConcurrentStorage(new Map())
    })
  }
}

describe('wallets', () => {
  it('should be able to list public key info while locked', async () => {
    const { wallets, enc } = await createWallets()

    await wallets.import({ name: 'wallet 1', recoveryPhrase: await wallets.generateRecoveryPhrase() })

    await wallets.generateKey({ wallet: 'wallet 1', name: 'key 1' })

    const keys = await wallets.listKeys({ wallet: 'wallet 1' })

    expect(keys.length).toBe(1)

    await enc.lock()

    expect(enc.isLocked).toBe(true)
    expect(await wallets.getKeyInfo({ publicKey: keys[0].publicKey })).toHaveProperty('publicKey', keys[0].publicKey)
  })

  it('should be able to rename a key', async () => {
    const { wallets } = await createWallets()

    await wallets.import({ name: 'wallet 1', recoveryPhrase: await wallets.generateRecoveryPhrase() })

    const k = await wallets.generateKey({ wallet: 'wallet 1' })
    expect(k.name).toBe('Key 0')

    expect(await wallets.listKeys({ wallet: 'wallet 1' })).toEqual([k])

    await expect(wallets.renameKey({})).rejects.toThrow('Cannot find key with public key "undefined"')
    await expect(wallets.renameKey({ publicKey: 'abc' })).rejects.toThrow('Cannot find key with public key "abc"')

    await wallets.renameKey({ publicKey: k.publicKey, name: 'Custom name' })

    expect(await wallets.listKeys({ wallet: 'wallet 1' })).toEqual([{ ...k, name: 'Custom name' }])

    const k2 = await wallets.generateKey({ wallet: 'wallet 1' })
    expect(k2.name).toBe('Key 1')

    await wallets.renameKey({ publicKey: k2.publicKey, name: 'Custom name' })

    // Two keys are allowed to have the same name
    expect(await wallets.listKeys({ wallet: 'wallet 1' })).toEqual([
      { ...k, name: 'Custom name' },
      { ...k2, name: 'Custom name' }
    ])

    // Rename to blank
    await wallets.renameKey({ publicKey: k2.publicKey, name: '' })
    expect(await wallets.listKeys({ wallet: 'wallet 1' })).toEqual([
      { ...k, name: 'Custom name' },
      { ...k2, name: '' }
    ])
  })

  it('should emit an event when a new wallet is created', async () => {
    const { wallets } = await createWallets()

    const cb = jest.fn()

    wallets.on('create_wallet', cb)

    await wallets.import({ name: 'wallet 1', recoveryPhrase: await wallets.generateRecoveryPhrase() })

    const k = await wallets.generateKey({ wallet: 'wallet 1' })
    expect(cb).toBeCalledTimes(1)
    expect(cb).toBeCalledWith({ name: 'wallet 1' })
  })

  it('should emit an event when a new key is created', async () => {
    const { wallets } = await createWallets()

    const cb = jest.fn()

    wallets.on('create_key', cb)

    await wallets.import({ name: 'wallet 1', recoveryPhrase: await wallets.generateRecoveryPhrase() })

    const k = await wallets.generateKey({ wallet: 'wallet 1' })
    expect(cb).toBeCalledTimes(1)
    expect(cb).toBeCalledWith({
      publicKey: expect.any(String),
      name: 'Key 0'
    })
  })

  it('should emit an event when a key is renamed', async () => {
    const { wallets } = await createWallets()

    const cb = jest.fn()

    wallets.on('rename_key', cb)

    await wallets.import({ name: 'wallet 1', recoveryPhrase: await wallets.generateRecoveryPhrase() })

    const k = await wallets.generateKey({ wallet: 'wallet 1' })
    await wallets.renameKey({ publicKey: k.publicKey, name: 'Custom name' })
    expect(cb).toBeCalledTimes(1)
    expect(cb).toBeCalledWith({
      publicKey: expect.any(String),
      name: 'Custom name'
    })
  })
})
