import fetchMock from 'jest-fetch-mock'
import { Networks } from './'
import { Storage } from '../../storage/wrapper'
import { NetworkSchema, Network } from '../../storage/schemas/network'
import { MockStorage } from '../../../test/mock-storage'

const mockConfig = {
  Name: 't1',
  API: {
    REST: {
      Hosts: ['http://localhost'],
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

const getTomlContent = (
  name: string,
  hosts: string[] = mockConfig.API.REST.Hosts
) => `
Host = "localhost"
Level = "info"
Name = "${name}"
Port = 1789
TokenExpiry = "1h"
[API]
  [API.GRPC]
    Hosts = ["localhost:3007"]
    Retries = 5
  [API.GraphQL]
    Hosts = ["http://localhost/graphql"]
  [API.REST]
    Hosts = [${hosts.map((h) => `"${h}"`).join(', ')}]
`

const getStorage = async (data?: { name: string; value: Network }) => {
  const s = new Storage('networks', NetworkSchema, new MockStorage())

  if (data) {
    await s.set(data.name, data.value)
  }
  return s
}

describe('Networks', () => {
  test('list', async () => {
    const nw = new Networks(await getStorage())

    expect(await nw.list()).toEqual({ networks: [] })

    fetchMock.mockResponseOnce(async () => getTomlContent('t1'))

    await nw.import({
      url: 'http://some.url/file.toml',
      filePath: '',
      overwrite: false,
    })

    expect((await nw.list()).networks.sort()).toEqual(['t1'])

    fetchMock.mockResponseOnce(async () => getTomlContent('t2'))

    await nw.import({
      url: 'http://some.url/file2.toml',
      filePath: '',
      overwrite: false,
    })

    expect((await nw.list()).networks.sort()).toEqual(['t1', 't2'])

    fetchMock.mockResponseOnce(async () =>
      getTomlContent('t2', ['http://localhost:8080'])
    )

    await nw.import({
      url: 'http://some.url/file2.toml',
      filePath: '',
      overwrite: false,
    })

    expect((await nw.list()).networks.sort()).toEqual(['t1', 't2'])
  })

  test('import - toml', async () => {
    const nw = new Networks(await getStorage())

    expect(await nw.list()).toEqual({ networks: [] })

    fetchMock.mockResponseOnce(async () => getTomlContent('t1'))

    await nw.import({
      name: 't1',
      url: 'http://source.url/file.toml',
      filePath: '',
      overwrite: false,
    })

    expect(await nw.list()).toEqual({ networks: ['t1'] })
  })

  test('import - unsupported', async () => {
    const nw = new Networks(await getStorage())

    expect(await nw.list()).toEqual({ networks: [] })

    fetchMock.mockResponseOnce(async () => getTomlContent('t1'))

    const importNetwork = async () => {
      await nw.import({
        name: 't1',
        url: 'http://source.url/file.exe',
        filePath: '',
        overwrite: false,
      })
    }

    await expect(importNetwork()).rejects.toThrow(
      /Unsupported extension: "exe". Only ".toml" file extensions are supported for network configuration./
    )
  })

  test('describe', async () => {
    const nw = new Networks(
      await getStorage({ name: mockConfig.Name, value: mockConfig })
    )

    expect(await nw.describe({ name: mockConfig.Name })).toEqual(mockResponse)
  })

  test('update', async () => {
    const nw = new Networks(
      await getStorage({ name: mockConfig.Name, value: mockConfig })
    )

    expect(await nw.describe({ name: 't1' })).toEqual(mockResponse)

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
          hosts: ['http://example.com'],
        },
      },
    }

    // 'Successfully update network t1'
    await nw.update(newConfig)

    expect(await nw.describe({ name: mockConfig.Name })).toEqual({
      ...mockResponse,
      name: newConfig.name,
      api: {
        ...mockResponse.api,
        restConfig: {
          hosts: newConfig.api.restConfig.hosts,
        },
      },
    })
  })

  test('remove', async () => {
    const nw = new Networks(
      await getStorage({ name: mockConfig.Name, value: mockConfig })
    )

    const remove = async (name: string) => await nw.remove({ name })

    await expect(remove('t2')).rejects.toThrow(/Invalid network/)

    expect(await nw.list()).toEqual({ networks: ['t1'] })

    // 'Remove network with success'
    await nw.remove({ name: 't1' })

    expect(await nw.list()).toEqual({ networks: [] })

    await expect(remove('t1')).rejects.toThrow(/Invalid network/)

    expect(await nw.list()).toEqual({ networks: [] })
  })
})
