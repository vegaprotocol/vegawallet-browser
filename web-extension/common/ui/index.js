const runtime = (globalThis.browser?.runtime ?? globalThis.chrome?.runtime)

import m from 'mithril'

const backgroundPort = runtime.connect({ name: 'popup' })

backgroundPort.onMessage.addListener(message => {
  switch (message.method) {
    case 'selectWallet':
      prompt('Wallet name')
      break
    case 'enterPassphrase':
      prompt('Wallet passphrase')
      break
  }
})

const wallets = [
  { name: 'Wallet 1', keys: [{name: 'Key 1', selected: true }]},
  { name: 'Wallet 2', keys: [{name: 'Key 1', selected: false }]},
  { name: 'Wallet 3', keys: [{name: 'Key 1', selected: true }, {name: 'Key 2', selected: false }]},
]

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
  view () {
    return wallets.map(w => m('details', [
      m('summary', [m('input', {
        type: 'checkbox',
        checked: w.keys.every(k => k.selected),
        indeterminate: w.keys.some(k => k.selected) && w.keys.some(k => !k.selected),
        onchange: ev => w.keys.forEach(k => k.selected = ev.currentTarget.checked)
      }), w.name]),
      m('ol', [
        ...w.keys.map(k => m('li', [
          m('input', { type: 'checkbox', checked: k.selected, onchange: _ => k.selected = !k.selected }),
          k.name
        ])),
        m('li', m('button', 'New Key'))
      ])
    ]))
  }
}

const App = {
  view () {
    return m('main', [
      m('header', { style: { backgroundColor: 'var(--core--vega-yellow-500)', display: 'grid', gridTemplateColumns: '1fr 1fr' } }, [
        m('h1', { style: { justifySelf: 'center' } }, 'Wallet'),
        m('select', { style: { justifySelf: 'center', alignSelf: 'center' } }, [
          m('option', 'Fairground'),
          m('option', 'Import network...')
        ])
      ]),
      m('section', { style: { padding: '1rem' } }, [
        // m(NetworkWizard)
        m(WalletsView)
      ])
    ])
  }
}

m.mount(document.body, App)
