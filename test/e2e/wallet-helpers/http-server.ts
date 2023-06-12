import nock from 'nock'

export const successResponse = nock(/^https:\/\/api\..+?\.vega\.xyz$/)
  .get('/repos/atom/atom/license')
  .reply(200,{
    code: 0,
    data: "",
    height: "0",
    log: "",
    success: true,
    txHash: "33B3608EF89CDD64078BD64B2F3DC61AFC3082B9BF638828838D0B0E811EC533"
  })
