import test from 'tape'
import { Wallets } from './wallets'
import { Storage } from '../storage/wrapper'
import { WalletSchema } from '../storage/schemas/wallet'
import { MockStorage } from '../../test/mock-storage'

test('admin.create_wallet', async (assert) => {
  const s = new Storage('wallets', WalletSchema, new MockStorage())
  const w = new Wallets(s)

  const { wallet, key } = await w.create({
    wallet: 'wallet-1',
    passphrase: 'foobar',
  })

  assert.equals(wallet.name, 'wallet-1', 'Has given name')
  assert.equals(wallet.keyDerivationVersion, 2, 'Is latest KD version')
  assert.equals(
    wallet.recoveryPhrase.split(' ').length,
    24,
    'Gives 24 word mnemonic'
  )

  assert.ok(key.publicKey, 'Has public key')
  assert.equal(key.publicKey.length, 64, 'Public key is 64 bytes')
  assert.equal(key.algorithm.name, 'vega/ed25519', 'Key has correct algorithm')
  assert.equal(key.algorithm.version, 1, 'Key has correct version')
  assert.ok(
    key.metadata.findIndex((m) => m.key === 'name' && m.value === 'Key 1') > -1,
    'Key has name metadata'
  )
})

test('admin.list_wallets', async (assert) => {
  const s = new Storage('wallets', WalletSchema, new MockStorage())
  const w = new Wallets(s)

  assert.deepEquals(await w.list([]), { wallets: [] })
  await w.create({ wallet: 'wallet-1', passphrase: 'foobar' })
  try {
    await w.create({ wallet: 'wallet-1', passphrase: 'foobar' })
  } catch {
    // skip
  }
  await w.create({ wallet: 'wallet-2', passphrase: 'foobar' })

  assert.deepEquals(await w.list([]), { wallets: ['wallet-1', 'wallet-2'] })
})

// test('admin.describe_wallets', async assert => {
//   const w = new Wallets(new Map())
// })

test('admin.remove_wallets', async (assert) => {
  const s = new Storage('wallets', WalletSchema, new MockStorage())
  const w = new Wallets(s)

  const wp = { wallet: 'wallet-1', passphrase: 'foobar' }
  await w.create(wp)
  assert.equals((await w.list([])).wallets.length, 1)
  await w.remove(wp)
  assert.equals((await w.list([])).wallets.length, 0)

  try {
    await w.remove(wp)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    assert.ok(
      /Invalid wallet/.test(err.message),
      'Cannot remove non-existing wallet'
    )
  }

  assert.equals((await w.list([])).wallets.length, 0)
})
