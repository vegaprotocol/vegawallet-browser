import test from 'tape'
import { Networks } from './'

const mockConfig = {
  name: 't1',
  port: 1,
  host: 'localhost',
  logLevel: 'info',
  tokenExpiry: '1h',
  api: {
    grpcConfig: {
      hosts: ['localhost:3007'],
      retries: 5,
    },
    restConfig: {
      hosts: ['http://localhost'],
    },
    graphQLConfig: {
      hosts: ['http://localhost/graphql'],
    },
  },
}

global.fetch = async (url: RequestInfo | URL) => {
  if (typeof url !== 'string') {
    return new Response()
  }

  const ext = url.split('.').slice(-1)[0]

  switch (ext) {
    case 'json': {
      const content = JSON.stringify({
        Host: 'localhost',
        Level: 'info',
        Name: 'test',
        Port: 1789,
        TokenExpiry: '1h',
        API: {
          GRPC: {
            Hosts: ['localhost:3007'],
            Retries: 5,
          },
          GraphQL: {
            Hosts: ['http://localhost/graphql'],
          },
          REST: {
            Hosts: ['http://localhost'],
          },
        },
      })
      return new Response(content)
    }
    case 'toml': {
      const content = `
Host = "localhost"
Level = "info"
Name = "test"
Port = 1789
TokenExpiry = "1h"
[API]
  [API.GRPC]
    Hosts = ["localhost:3007"]
    Retries = 5
  [API.GraphQL]
    Hosts = ["http://localhost/graphql"]
  [API.REST]
    Hosts = ["http://localhost"]
      `
      return new Response(content)
    }
    case 'yaml': {
      const content = `
Host: localhost
Level: info
Name: test
Port: 1789
TokenExpiry: 1h
API:
  GRPC:
    Hosts:
      - 'localhost:3007'
    Retries: 5
  GraphQL:
    Hosts:
      - 'http://localhost/graphql'
  REST:
    Hosts:
      - 'http://localhost'
      `
      return new Response(content)
    }
    default: {
      return new Response('')
    }
  }
}

test('admin.list_networks', async (assert) => {
  const nw = new Networks(new Map())

  assert.deepEqual(
    await nw.list(),
    [],
    'Fresh service should return empty list'
  )

  await nw.create({
    config: mockConfig,
  })
  assert.deepEqual(
    (await nw.list()).sort(),
    ['t1'],
    'One network should return one name'
  )

  await nw.create({
    config: {
      ...mockConfig,
      name: 't2',
    },
  })
  assert.deepEqual(
    (await nw.list()).sort(),
    ['t1', 't2'],
    'Two networks should return two names'
  )

  await nw.create({
    overwrite: true,
    config: {
      ...mockConfig,
      api: {
        ...mockConfig.api,
        restConfig: {
          hosts: ['http://localhost:8080'],
        },
      },
    },
  })

  assert.deepEqual(
    (await nw.list()).sort(),
    ['t1', 't2'],
    'Overwriting one network should return two names'
  )

  assert.end()
})

test('admin.import_network - toml', async (assert) => {
  const nw = new Networks(new Map())

  assert.deepEqual(await nw.list(), [], 'Networks list should be empty')

  await nw.import({
    name: 't1',
    url: 'http://source.url/file.toml',
  })

  assert.deepEqual(
    await nw.list(),
    ['t1'],
    'Networks list should return the imported network'
  )

  assert.end()
})

test('admin.import_network - yaml', async (assert) => {
  const nw = new Networks(new Map())

  assert.deepEqual(await nw.list(), [], 'Networks list should be empty')

  await nw.import({
    name: 't1',
    url: 'http://source.url/file.yaml',
  })

  assert.deepEqual(
    await nw.list(),
    ['t1'],
    'Networks list should return the imported network'
  )

  assert.end()
})

test('admin.import_network - json', async (assert) => {
  const nw = new Networks(new Map())

  assert.deepEqual(await nw.list(), [], 'Networks list should be empty')

  await nw.import({
    name: 't1',
    url: 'http://source.url/file.json',
  })

  assert.deepEqual(
    await nw.list(),
    ['t1'],
    'Networks list should return the imported network'
  )

  assert.end()
})

test('admin.import_network - unsupported extension', async (assert) => {
  const nw = new Networks(new Map())

  assert.deepEqual(await nw.list(), [], 'Networks list should be empty')

  try {
    await nw.import({
      name: 't1',
      url: 'http://source.url/file.exe',
    })
    assert.fail()
    // eslint-dsiable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    assert.ok(
      /Unsupported extension: "exe". Only ".toml", ".yaml" or ".json" file extensions are supported for network configuration./.test(
        err.message
      ),
      'admin.import_network is unimplemented'
    )
  }

  assert.end()
})

test('admin.describe_network', async (assert) => {
  const nw = new Networks(new Map([[mockConfig.name, mockConfig]]))

  assert.deepEqual(await nw.describe({ name: mockConfig.name }), mockConfig)

  assert.end()
})

test('admin.update_network', async (assert) => {
  const nw = new Networks(new Map([[mockConfig.name, mockConfig]]))

  assert.deepEqual(await nw.describe({ name: 't1' }), mockConfig)

  const newConfig = {
    ...mockConfig,
    api: {
      ...mockConfig.api,
      restConfig: {
        hosts: ['example.com'],
      },
    },
  }

  // 'Successfully update network t1'
  await nw.update(newConfig)

  assert.deepEqual(
    await nw.describe({ name: mockConfig.name }),
    newConfig,
    'Postcondition'
  )

  assert.end()
})

test('admin.remove_network', async (assert) => {
  const nw = new Networks(new Map([[mockConfig.name, mockConfig]]))

  try {
    await nw.remove({ name: 't2' })
    assert.fail()
    // eslint-dsiable-next-line @typescript-eslint/no-explicit-any
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
