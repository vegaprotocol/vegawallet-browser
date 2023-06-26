import { WalletCollection } from '../backend/wallets.js'
import ConcurrentStorage from '../lib/concurrent-storage.js'
import EncryptedStorage from '../lib/encrypted-storage.js'


describe('wallets', () => {
  it('should be able to list public key info while locked', async () => {
    const enc = new EncryptedStorage(new Map(), { memory: 10, iterations: 1 })
    await enc.create('p')

    const wallets = new WalletCollection({
      walletsStore: new ConcurrentStorage(enc),
      publicKeyIndexStore: new ConcurrentStorage(new Map())
    })

    await wallets.import({ name: 'wallet 1', recoveryPhrase: await wallets.generateRecoveryPhrase() })

    await wallets.generateKey({ wallet: 'wallet 1', name: 'key 1' })

    const keys = await wallets.listKeys({ wallet: 'wallet 1' })

    expect(keys.length).toBe(1)

    await enc.lock()

    expect(enc.isLocked).toBe(true)
    expect(await wallets.getKeyInfo({ publicKey: keys[0].publicKey })).toHaveProperty('publicKey', keys[0].publicKey)
  })
})
