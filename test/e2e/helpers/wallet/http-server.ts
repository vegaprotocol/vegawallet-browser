import http from 'node:http'
import { resolve } from 'path'
import { promises as fsPromises } from 'fs'

const jsonFilePath = './test/e2e/generated-test-data/'
const accountsMockData = `${jsonFilePath}api_v2_accounts-vega-responses.json`
const assetsMockData = `${jsonFilePath}api_v2_assets-vega-responses.json`
const marketsMockData = `${jsonFilePath}api_v2_markets-vega-responses.json`
const blockHeightMockData = `${jsonFilePath}blockchain_height-vega-responses.json`

async function getJSONStringFromFile(filePath: string) {
  try {
    const resolvedFilePath = resolve(filePath)
    const data = await fsPromises.readFile(resolvedFilePath, 'utf8')
    const jsonObject = JSON.parse(data)
    return JSON.stringify(jsonObject)
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*') /* @dev First, read about security */
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Max-Age', 2592000) // 30 days

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/transaction/raw') {
    res.end(
      JSON.stringify({
        code: 0,
        data: '',
        height: '0',
        log: '',
        success: true,
        txHash: '33B3608EF89CDD64078BD64B2F3DC61AFC3082B9BF638828838D0B0E811EC533'
      })
    )
    return
  }

  if (req.url === '/blockchain/height') {
    res.end(await getJSONStringFromFile(blockHeightMockData))
    return
  }

  if (req.url?.includes('api/v2/accounts')) {
    res.end(await getJSONStringFromFile(accountsMockData))
    return
  }

  if (req.url === '/api/v2/markets') {
    res.end(await getJSONStringFromFile(marketsMockData))
    return
  }

  if (req.url === '/api/v2/assets') {
    res.end(await getJSONStringFromFile(assetsMockData))
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

const closeServer = () => {
  return new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function closeServerAndWait() {
  try {
    await closeServer()
  } catch (error) {
    console.error('Error while closing the server:', error)
  }
}
