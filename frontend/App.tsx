import { MemoryRouter as Router } from 'react-router-dom'
import { Routing } from './routes'
import { JsonRPCProvider } from './contexts/json-rpc/json-rpc-provider'
import GlobalErrorBoundary from './components/global-error-boundary'
import { usePreventWindowResize } from './hooks/prevent-window-resize'
import { usePing } from './hooks/ping'
import { useListenForPopups } from './hooks/listen-for-popups'
import { useGlobalsStore } from './stores/globals'

export const locators = {
  appWrapper: 'app-wrapper'
}

function App() {
  useListenForPopups()
  usePreventWindowResize()
  usePing()
  const isDesktop = useGlobalsStore((state) => !state.isMobile)
  return (
    <Router>
      <GlobalErrorBoundary>
        <JsonRPCProvider>
          <main
            data-testid={locators.appWrapper}
            style={{
              minHeight: isDesktop ? 600 : undefined
            }}
            className="w-full h-full bg-black font-alpha text-vega-dark-400"
          >
            <Routing />
          </main>
        </JsonRPCProvider>
      </GlobalErrorBoundary>
    </Router>
  )
}

export default App
