import test from 'tape'
import { Networks } from './networks'
import { Storage } from '../storage/wrapper'
import { NetworkSchema } from '../storage/schemas/network'
import { MockStorage } from '../../test/mock-storage'

const mockConfig = {
  Name: 't1',
  API: {
    REST: {
      Hosts: ['https://example.com'],
    },
  },
}

const mockResponse = {
  name: mockConfig.Name,
  logLevel: 'info',
  tokenExpiry: '1h',
  host: '127.0.0.1',
  port: 1789,
  api: {
    grpcConfig: {
      hosts: [],
      retries: 0,
    },
    graphQLConfig: {
      hosts: [],
    },
    restConfig: {
      hosts: mockConfig.API.REST.Hosts,
    },
  },
}

const setupFetch = (name: string, restHosts: string[] = []) => {
  global.fetch = async (url: RequestInfo | URL) => {
    if (typeof url !== 'string') {
      return new Response()
    }

    const ext = url.split('.').at(-1)

    switch (ext) {
      case 'toml': {
        const content = `
  Host = "http://example.com"
  Level = "info"
  Name = "${name}"
  Port = 1789
  TokenExpiry = "1h"
  [API]
    [API.GRPC]
      Hosts = ["http://example.com:3007"]
      Retries = 5
    [API.GraphQL]
      Hosts = ["http://example.com/graphql"]
    [API.REST]
      Hosts = [${restHosts.map((h) => `"${h}"`).join(', ')}]
        `
        return new Response(content)
      }
      default: {
        return new Response('')
      }
    }
  }
}

test('admin.list_networks', async (assert) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())
  const n = new Networks(s)

  assert.deepEqual(
    await n.list(),
    { networks: [] },
    'Fresh service should return empty list'
  )

  setupFetch('t1')

  await n.import({
    url: 'http://some.url/file.toml',
    filePath: '',
    overwrite: false,
  })

  assert.deepEqual(
    (await n.list()).networks.sort(),
    ['t1'],
    'One network should return one name'
  )

  setupFetch('t2')

  await n.import({
    url: 'http://some.url/file2.toml',
    filePath: '',
    overwrite: false,
  })

  assert.deepEqual(
    (await n.list()).networks.sort(),
    ['t1', 't2'],
    'Two networks should return two names'
  )

  setupFetch('t2', ['http://example.com:8080'])

  await n.import({
    url: 'http://some.url/file2.toml',
    filePath: '',
    overwrite: false,
  })

  assert.deepEqual(
    (await n.list()).networks.sort(),
    ['t1', 't2'],
    'Overwriting one network should return two names'
  )

  assert.end()
})

test('admin.import_network - toml', async (assert) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())
  const n = new Networks(s)

  assert.deepEqual(
    await n.list(),
    { networks: [] },
    'Networks list should be empty'
  )

  setupFetch('t1')

  await n.import({
    name: 't1',
    url: 'http://source.url/file.toml',
    filePath: '',
    overwrite: false,
  })

  assert.deepEqual(
    await n.list(),
    { networks: ['t1'] },
    'Networks list should return the imported network'
  )

  assert.end()
})

test('admin.import_network - unsupported extension', async (assert) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())
  const n = new Networks(s)

  assert.deepEqual(
    await n.list(),
    { networks: [] },
    'Networks list should be empty'
  )

  setupFetch('t1')

  try {
    await n.import({
      name: 't1',
      url: 'http://source.url/file.exe',
      filePath: '',
      overwrite: false,
    })
    assert.fail()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    assert.ok(
      /Unsupported extension: "exe". Only ".toml" file extensions are supported for network configuration./.test(
        err.message
      ),
      'admin.import_network is unimplemented'
    )
  }

  assert.end()
})

test('admin.describe_network', async (assert) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())
  await s.set(mockConfig.Name, mockConfig)
  const n = new Networks(s)

  assert.deepEqual(await n.describe({ name: mockConfig.Name }), mockResponse)

  assert.end()
})

test('admin.update_network', async (assert) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())
  await s.set(mockConfig.Name, mockConfig)
  const n = new Networks(s)

  assert.deepEqual(await n.describe({ name: mockConfig.Name }), mockResponse)

  const newConfig = {
    name: mockConfig.Name,
    logLevel: 'info',
    tokenExpiry: '2h',
    host: 'http://host.com',
    port: 80,
    api: {
      grpcConfig: {
        hosts: [],
        retries: 0,
      },
      graphQLConfig: {
        hosts: [],
      },
      restConfig: {
        hosts: ['http://example1.com', 'http://example2.com'],
      },
    },
  }

  // 'Successfully update network t1'
  await n.update(newConfig)

  assert.deepEqual(
    await n.describe({ name: mockConfig.Name }),
    {
      ...mockResponse,
      name: newConfig.name,
      api: {
        ...mockResponse.api,
        restConfig: {
          hosts: newConfig.api.restConfig.hosts,
        },
      },
    },
    'Postcondition'
  )

  assert.end()
})

test('admin.remove_network', async (assert) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())
  s.set(mockConfig.Name, mockConfig)
  const n = new Networks(s)

  try {
    await n.remove({ name: 't2' })
    assert.fail()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    assert.ok(
      /Invalid network/.test(err.message),
      'Remove non-existing network'
    )
  }

  assert.deepEqual(await n.list(), { networks: ['t1'] }, 'Precondition')

  // 'Remove network with success'
  await n.remove({ name: 't1' })

  assert.deepEqual(await n.list(), { networks: [] }, 'Postcondition')

  try {
    await n.remove({ name: 't1' })
    assert.fail()
    // eslint-disable-next-line
  } catch (err: any) {
    assert.ok(/Invalid network/.test(err.message), 'Remove same network twice')
  }
  assert.deepEqual(await n.list(), { networks: [] }, 'Postcondition')

  assert.end()
})
