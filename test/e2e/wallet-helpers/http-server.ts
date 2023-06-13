import http from 'node:http'

export const server = http.createServer((req, res) => {
  if (req.url === '/transaction/raw')
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

  if (req.url === '/blockchain/height')
    res.end(
      JSON.stringify({
        height: '3144128',
        hash: '07d5343f3f5645400c13d9576f13ec2f74511236b5f826951646164485f04ba6',
        spamPowHashFunction: 'sha3_24_rounds',
        spamPowDifficulty: 15,
        spamPowNumberOfPastBlocks: 100,
        spamPowNumberOfTxPerBlock: 2,
        spamPowIncreasingDifficulty: false,
        chainId: 'fairground'
      })
    )

  return res.end('Not found')
})
