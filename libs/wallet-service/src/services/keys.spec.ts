import test from 'tape'
import { Keys } from './keys'
import { Wallets } from './wallets'
import { Storage } from '../storage/wrapper'
import { WalletSchema } from '../storage/schemas/wallet'
import { MockStorage } from '../../test/mock-storage'

test('admin.generate_key / admin.list_keys', async (assert) => {
  const s = new Storage('wallets', WalletSchema, new MockStorage())
  const w = new Wallets(s)
  const k = new Keys(s)

  const wp = { wallet: 'wallet-1', passphrase: 'foobar' }
  await w.create(wp)

  assert.equal((await k.list(wp)).keys.length, 1)

  const key = await k.generate({ metadata: [], ...wp })

  assert.ok(key.publicKey, 'Has public key')
  assert.equal(key.publicKey.length, 64, 'Public key is 64 bytes')
  assert.equal(key.algorithm.name, 'vega/ed25519', 'Key has correct algorithm')
  assert.equal(key.algorithm.version, 1, 'Key has correct version')
  assert.ok(
    key.metadata.findIndex((m) => m.key === 'name' && m.value === 'Key 2') > -1,
    'Key has name metadata'
  )

  const key2 = await k.generate({
    metadata: [{ key: 'name', value: 'foo' }],
    ...wp,
  })
  assert.ok(
    key2.metadata.findIndex((m) => m.key === 'name' && m.value === 'foo') > -1,
    'Key 2 has set name metadata'
  )

  assert.deepEquals(
    (await k.list(wp)).keys.map((k) => k.name),
    ['Key 1', 'Key 2', 'foo'],
    'All keys appear in list'
  )
})
