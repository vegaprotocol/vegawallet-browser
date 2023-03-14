import m from 'mithril'
import JSONRPCClient from '../lib/json-rpc-client.js'

const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)

const backgroundPort = runtime.connect({ name: 'popup' })
const background = new JSONRPCClient({
  send (msg) { backgroundPort.postMessage(msg) }
})
backgroundPort.onMessage.addListener((res) => { background.onmessage(res) })

const NetworkWizard = {
  view () {
    return m('form', {
      onsubmit (event) {
        event.preventDefault()

        const url = event.target['network-url'].value

        fetch(url).then(async res => {
          console.log(await res.text())
        }).finally(() => {
          m.redraw()
        })

        return false
      }
    }, [
      m('fieldset', [
        m('legend', 'Import network'),
        m('label', { for: 'network-url' }, 'Network Config URL'),
        m('input', { type: 'url', id: 'network-url', name: 'network-url', required: true, value: 'https://raw.githubusercontent.com/vegaprotocol/networks/master/mainnet1/mainnet1.toml' }),
        m('input', { type: 'submit', value: 'Fetch' })
      ])
    ])
  }
}

const WalletsView = {
  wallets: [],

  oninit () {
    this.listWallets()
  },

  listWallets () {
    background.request('admin.list_wallets')
      .then(async ({ wallets }) => {
        this.wallets = await Promise.all(wallets.map(async w => {
          const { keys } = await background.request('admin.list_keys', { wallet: w })
          return { name: w, keys }
        }))
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        m.redraw()
      })
  },

  view () {
    return this.wallets.map(w => m('details', [
      m('summary', [
        // m('input', {
        //   type: 'checkbox',
        //   checked: w.keys.every(k => k.selected),
        //   indeterminate: w.keys.some(k => k.selected) && w.keys.some(k => !k.selected),
        //   onchange: ev => w.keys.forEach(k => (k.selected = ev.currentTarget.checked))
        // }),
        w.name
      ]),
      m('ol', [
        ...w.keys.map(k => m('li', [
          // m('input', { type: 'checkbox', checked: k.selected, onchange: _ => (k.selected = !k.selected) }),
          k.name, ' (', k.publicKey.slice(0, 6) + '...' + k.publicKey.slice(-6), ')'
        ])),
        m('li', m('button', { disabled: true }, 'New Key'))
      ])
    ]))
  }
}

const NetworksSelector = {
  loading: true,
  networks: [],

  oninit () {
    this.listNetworks()
  },

  listNetworks () {
    background.request('admin.list_networks')
      .then(({ networks }) => {
        this.networks = networks
      })
      .catch(err => console.error(err))
      .finally(() => {
        this.loading = false
        m.redraw()
      })
  },

  view () {
    return m('select', { disabled: this.loading, style: { justifySelf: 'center', alignSelf: 'center' } }, [
      ...this.networks.map(n => m('option', { value: n }, n)),
      m('option', { disabled: true }, 'Import network...')
    ])
  }
}

const App = {
  view () {
    return m('main', [
      m('header', { style: { backgroundColor: 'var(--core--vega-yellow-500)', display: 'grid', gridTemplateColumns: '1fr 1fr' } }, [
        m('h1', { style: { justifySelf: 'center' } }, 'Wallet'),
        m(NetworksSelector)
      ]),
      m('section', { style: { padding: '1rem' } }, [
        // m(NetworkWizard)
        m(WalletsView)
      ])
    ])
  }
}

m.mount(document.body, App)
