import NodeRPC from '../backend/node-rpc.js'
import http from 'node:http'

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function createHTTPServer(fn) {
  const server = http.createServer(fn)

  await server.listen()

  return {
    url: new URL(`http://localhost:${server.address().port}/`),
    close: () => server.close()
  }
}

async function createServer(height = 100, timeout = 0) {
  return createHTTPServer(async (_, res) => {
    await wait(timeout)
    res.end(JSON.stringify({ height }))
  })
}

async function createFaultyServer() {
  return createHTTPServer(async (_, res) => {
    res.statusCode = 500
    res.end()
  })
}


describe('node-rpc', () => {
  test('findHealthyNode - mix of nodes', async () => {
    const [healthy, slow, unhealthy] = await Promise.all([
      await Promise.all([createServer(100),
      createServer(99),
      createServer(101)]),

      await Promise.all([createServer(100, 500),
      createServer(99, 500),
      createServer(101, 500)]),

      await Promise.all([createServer(50),
      createServer(49),
      createServer(51),
      createFaultyServer()])
    ])

    const servers = [...healthy, ...slow, ...unhealthy]

    const node = await NodeRPC.findHealthyNode(servers.map((s) => s.url), undefined, undefined, 5)

    expect(node._url).toBeInstanceOf(URL)
    expect(healthy.find((s) => s.url.href === node._url.href)).toBeDefined()

    await Promise.all(servers.map((s) => s.close()))
  })

  test('findHealthyNode - only faulty nodes', async () => {
    const servers = await Promise.all([createFaultyServer(), createFaultyServer()])

    await expect(NodeRPC.findHealthyNode(servers.map((s) => s.url))).rejects.toThrow('No healthy node found')

    await Promise.all(servers.map((s) => s.close()))
  })
})
