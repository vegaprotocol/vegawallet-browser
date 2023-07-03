import { HashRouter as Router } from 'react-router-dom'
import { Routing } from './routes'
import { JsonRPCProvider } from './contexts/json-rpc/json-rpc-provider'
import GlobalErrorBoundary from './components/global-error-boundary'
import { usePreventWindowResize } from './hooks/prevent-window-reszie'

function App() {
  usePreventWindowResize()
  return (
    <Router>
      <GlobalErrorBoundary>
        <JsonRPCProvider>
          <main className="w-full h-full bg-black font-alpha text-vega-dark-400">
            <Routing />
          </main>
        </JsonRPCProvider>
      </GlobalErrorBoundary>
    </Router>
  )
}

export default App
