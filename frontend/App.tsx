import { HashRouter as Router } from 'react-router-dom'
import { Routing } from './routes'
import { JsonRPCProvider } from './contexts/json-rpc/json-rpc-provider'
import GlobalErrorBoundary from './components/global-error-boundary'
import { usePreventWindowResize } from './hooks/prevent-window-resize'
import { usePing } from './hooks/ping'
import { useListenForPopups } from './hooks/listen-for-popups'
import { useJsonRpcClient } from './contexts/json-rpc/json-rpc-context'

const AppLoader = () => {
  const { request } = useJsonRpcClient
  // Load assets
  // Load markets
  return (
    <main className="w-full h-full bg-black font-alpha text-vega-dark-400">
      <Routing />
    </main>
  )
}

function App() {
  useListenForPopups()
  usePreventWindowResize()
  usePing()
  return (
    <Router>
      <GlobalErrorBoundary>
        <JsonRPCProvider>
          <AppLoader />
        </JsonRPCProvider>
      </GlobalErrorBoundary>
    </Router>
  )
}

export default App
