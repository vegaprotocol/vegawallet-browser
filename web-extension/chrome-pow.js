import webworker from './backend/pow/web-worker.js'
import inprocess from './backend/pow/in-process.js'
import JSONRPCServer from '../lib/json-rpc-server.js'

const solver = (async () => {
  const pow = await webworker() || inprocess()

  return pow
})()

const server = new JSONRPCServer({
  methods: {
    async solve(args) {
      const pow = await solver

      const s = await pow(args)

      s.nonce = s.nonce.toString()

      return s
    }
  }
})

chrome.runtime.onMessage.addListener(async function listener(message, sender) {
  // ensure sender.id is the same as this extension id
  if (sender.id !== chrome.runtime.id) return
  if (message.target !== 'offscreen') return

  const res = await server.onrequest(message.data)

  chrome.runtime.sendMessage({
    target: 'offscreen',
    data: res
  })
})


