import { HashRouter as Router } from 'react-router-dom'
import { Routing } from './routes'
import { JsonRPCProvider } from './contexts/json-rpc/json-rpc-provider'
import GlobalErrorBoundary from './components/global-error-boundary'
import { usePreventWindowResize } from './hooks/prevent-window-resize'
import { usePing } from './hooks/ping'

function useListenForPopups() {
  const { setup, teardown } = useWindowStore((state) => ({
    setup: state.setup,
    teardown: state.teardown
  }))
  useEffect(() => {
    setup()
    return teardown
  }, [setup, teardown])
}

function App() {
  useListenForPopups()
  usePreventWindowResize()
  usePing()
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
