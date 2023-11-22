import { MemoryRouter as Router } from 'react-router-dom'

import GlobalErrorBoundary from '@/components/global-error-boundary'
import { JsonRPCProvider } from '@/contexts/json-rpc/json-rpc-provider'
import { useListenForPopups } from '@/hooks/listen-for-popups'
import { usePing } from '@/hooks/ping'
import { usePreventWindowResize } from '@/hooks/prevent-window-resize'
import { useGlobalsStore } from '@/stores/globals'

import { CONSTANTS } from '../lib/constants'
import { Routing } from './routes'

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
              minHeight: isDesktop ? CONSTANTS.defaultHeight : undefined
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
