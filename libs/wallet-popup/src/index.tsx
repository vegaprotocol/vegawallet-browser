import { createRoot } from 'react-dom/client'
import { App as WalletUI } from '@vegaprotocol/wallet-ui'
// @TODO: replace these with the JS API from libs/wallet-service
import { service, client, runtime } from '@vegaprotocol/wallet-ui/mocks'

const App = () => {
  return <WalletUI service={service} client={client} runtime={runtime} />
}

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App />)
