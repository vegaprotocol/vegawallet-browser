import test from 'tape'
import { Networks } from './networks'

test('admin.list_networks', async (assert) => {
  const nw = new Networks(new Map())

  assert.deepEqual(
    await nw.list(),
    [],
    'Fresh service should return empty list'
  )

  await nw.create({
    config: { name: 't1', api: { restConfig: { hosts: ['localhost'] } } },
  })
  assert.deepEqual(
    (await nw.list()).sort(),
    ['t1'],
    'One network should return one name'
  )

  await nw.create({
    config: { name: 't2', api: { restConfig: { hosts: ['localhost'] } } },
  })
  assert.deepEqual(
    (await nw.list()).sort(),
    ['t1', 't2'],
    'Two networks should return two names'
  )

  await nw.create({
    overwrite: true,
    config: { name: 't1', api: { restConfig: { hosts: ['localhost:8080'] } } },
  })

  assert.deepEqual(
    (await nw.list()).sort(),
    ['t1', 't2'],
    'Overwriting one network should return two names'
  )

  try {
    // eslint-disable-next-line
    await nw.create({} as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network/.test(err.message))
  }
  try {
    // eslint-disable-next-line
    await nw.create({ config: { name: 1 } } as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network/.test(err.message))
  }
  try {
    await nw.create({ config: { name: 't' } })
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network config/.test(err.message))
  }
  try {
    // eslint-disable-next-line
    await nw.create({ config: { name: 't', api: {} } } as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network config/.test(err.message))
  }
  try {
    await nw.create({
      config: { name: 't', api: { restConfig: {} } },
      // eslint-disable-next-line
    } as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network config/.test(err.message))
  }
  try {
    await nw.create({
      config: { name: 't', api: { restConfig: { hosts: [] } } },
    })
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network config/.test(err.message))
  }

  assert.end()
})

test('admin.import_network', async (assert) => {
  const nw = new Networks(new Map())

  try {
    // eslint-disable-next-line
    await nw.import({ name: '' } as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(
      /Not implemented/.test(err.message),
      'admin.import_network is unimplemented'
    )
  }

  assert.end()
})

test('admin.describe_network', async (assert) => {
  const nw = new Networks(
    new Map([
      // Add one network premordially
      ['t1', { name: 't1', api: { restConfig: { hosts: ['localhost'] } } }],
    ])
  )

  assert.deepEqual(await nw.describe({ name: 't1' }), {
    name: 't1',
    api: {
      restConfig: {
        hosts: ['localhost'],
      },
    },
  })

  try {
    // eslint-disable-next-line
    await nw.describe({} as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network/.test(err.message))
  }
  try {
    // eslint-disable-next-line
    await nw.describe({ name: 1 } as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network/.test(err.message))
  }

  assert.end()
})

test('admin.update_network', async (assert) => {
  const nw = new Networks(
    new Map([
      // Add one network premordially
      ['t1', { name: 't1', api: { restConfig: { hosts: ['localhost'] } } }],
    ])
  )

  assert.deepEqual(
    await nw.describe({ name: 't1' }),
    {
      name: 't1',
      api: {
        restConfig: {
          hosts: ['localhost'],
        },
      },
    },
    'Precondition'
  )

  // 'Successfully update network t1'
  await nw.update({
    name: 't1',
    api: {
      restConfig: {
        hosts: ['example.com'],
      },
    },
  })

  assert.deepEqual(
    await nw.describe({ name: 't1' }),
    {
      name: 't1',
      api: {
        restConfig: {
          hosts: ['example.com'],
        },
      },
    },
    'Postcondition'
  )

  assert.end()
})

test('admin.remove_network', async (assert) => {
  const nw = new Networks(
    new Map([
      // Add one network premordially
      ['t1', { name: 't1', api: { restConfig: { hosts: ['localhost'] } } }],
    ])
  )

  try {
    // eslint-disable-next-line
    await nw.remove({} as any)
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(
      /Invalid network/.test(err.message),
      'Remove network with invalid name'
    )
  }
  try {
    await nw.remove({ name: 't2' })
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(
      /Invalid network/.test(err.message),
      'Remove non-existing network'
    )
  }

  assert.deepEqual(await nw.list(), ['t1'], 'Precondition')

  // 'Remove network with success'
  await nw.remove({ name: 't1' })

  assert.deepEqual(await nw.list(), [], 'Postcondition')
  try {
    await nw.remove({ name: 't1' })
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network/.test(err.message), 'Remove same network twice')
  }
  assert.deepEqual(await nw.list(), [], 'Postcondition')

  assert.end()
})
