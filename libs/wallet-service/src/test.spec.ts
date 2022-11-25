// @ts-nocheck
import test from 'tape'
import { WalletService } from './index'

test('admin.list_networks', async assert => {
  const ws = new WalletService({
    networkStore: new Map(),
    walletStore: new Map(),
    permissionStore: new Map()
  })

  assert.deepEqual(
    ws.adminListNetworks(),
    [],
    'Fresh service should return empty list'
  )

  ws.adminCreateNetwork({ name: 't1', config: { name: 't1', api: { restConfig: { hosts: ['localhost'] } } } })
  assert.deepEqual(
    ws.adminListNetworks().sort(),
    ['t1'],
    'One network should return one name'
  )

  ws.adminCreateNetwork({ name: 't2', config: { name: 't2', api: { restConfig: { hosts: ['localhost'] } } } })
  assert.deepEqual(
    ws.adminListNetworks().sort(),
    ['t1', 't2'],
    'Two networks should return two names'
  )

  ws.adminCreateNetwork({ name: 't1', overwrite: true, config: { name: 't1', api: { restConfig: { hosts: ['localhost:8080'] } } } })
  assert.deepEqual(
    ws.adminListNetworks().sort(),
    ['t1', 't2'],
    'Overwriting one network should return two names'
  )

  assert.throws(() => ws.adminCreateNetwork({}), { message: 'Invalid network name', code: 1000 })
  assert.throws(() => ws.adminCreateNetwork({ name: 1 }), { message: 'Invalid network name', code: 1000 })
  assert.throws(() => ws.adminCreateNetwork({ name: 't' }), { message: 'Invalid network config', code: 1000 })
  assert.throws(() => ws.adminCreateNetwork({ name: 't', config: {} }), { message: 'Invalid network config', code: 1000 })
  assert.throws(() => ws.adminCreateNetwork({ name: 't', config: { api: {} } }), { message: 'Invalid network config', code: 1000 })
  assert.throws(() => ws.adminCreateNetwork({ name: 't', config: { api: { restConfig: {} } } }), { message: 'Invalid network config', code: 1000 })
  assert.throws(() => ws.adminCreateNetwork({ name: 't', config: { api: { restConfig: { hosts: [] } } } }), { message: 'Invalid network config', code: 1000 })

  assert.end()
})

test('admin.import_network', async assert => {
  const ws = new WalletService({
    networkStore: new Map(),
    walletStore: new Map(),
    permissionStore: new Map()
  })

  assert.throws(() => ws.adminImportNetwork({ name: '' }), /Method not found/, 'admin.import_network is unimplemented')

  assert.end()
})

test('admin.describe_network', async assert => {
  const ws = new WalletService({
    networkStore: new Map([
      // Add one network premordially
      ['t1', { name: 't1', api: { restConfig: { hosts: ['localhost'] } } }]
    ]),
    walletStore: new Map(),
    permissionStore: new Map()
  })

  assert.deepEqual(ws.adminDescribeNetwork({ network: 't1' }), {
    name: 't1',
    api: {
      restConfig: {
        hosts: ['localhost']
      }
    }
  })

  assert.throws(() => ws.adminDescribeNetwork({}), { message: 'Invalid network', code: 1000 })
  assert.throws(() => ws.adminDescribeNetwork({ network: 1 }), { message: 'Invalid network', code: 1000 })

  assert.end()
})

test('admin.update_network', async assert => {
  const ws = new WalletService({
    networkStore: new Map([
      // Add one network premordially
      ['t1', { name: 't1', api: { restConfig: { hosts: ['localhost'] } } }]
    ]),
    walletStore: new Map(),
    permissionStore: new Map()
  })

  assert.deepEqual(ws.adminDescribeNetwork({ network: 't1' }), {
    name: 't1',
    api: {
      restConfig: {
        hosts: ['localhost']
      }
    }
  }, 'Precondition')

  assert.deepEqual(ws.adminUpdateNetwork({
    name: 't1',
    api: {
      restConfig: {
        hosts: ['example.com']
      }
    }
  }), {}, 'Successfully update network t1')

  assert.deepEqual(ws.adminDescribeNetwork({ network: 't1' }), {
    name: 't1',
    api: {
      restConfig: {
        hosts: ['example.com']
      }
    }
  }, 'Postcondition')

  assert.end()
})

test('admin.remove_network', async assert => {
  const ws = new WalletService({
    networkStore: new Map([
      // Add one network premordially
      ['t1', { name: 't1', api: { restConfig: { hosts: ['localhost'] } } }]
    ]),
    walletStore: new Map(),
    permissionStore: new Map()
  })

  assert.throws(() => ws.adminRemoveNetwork({}), { message: 'Invalid network', code: 1000 }, 'Remove network with invalid name')
  assert.throws(() => ws.adminRemoveNetwork({ name: 't2' }), { message: 'Invalid network', code: 1000 }, 'Remove non-existing network')

  assert.deepEqual(ws.adminListNetworks(), ['t1'], 'Precondition')
  assert.deepEqual(ws.adminRemoveNetwork({ name: 't1' }), {}, 'Remove network with success')
  assert.deepEqual(ws.adminListNetworks(), [], 'Postcondition')
  assert.throws(() => ws.adminRemoveNetwork({ name: 't1' }), { message: 'Invalid network', code: 1000 }, 'Remove same network twice')
  assert.deepEqual(ws.adminListNetworks(), [], 'Postcondition')

  assert.end()
})
