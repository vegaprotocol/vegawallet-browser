import { HashRouter as Router } from 'react-router-dom'
import { Routing } from './routes'
import { JsonRPCProvider } from './contexts/json-rpc/json-rpc-provider'
import GlobalErrorBoundary from './components/global-error-boundary'
import { useLayoutEffect } from 'react'

function usePreventWindowResize() {
  useLayoutEffect(() => {
    function resetSize() {
      const frameHeight = window.outerHeight - window.innerHeight
      window.resizeTo(360, 600 + frameHeight)
    }
    window.addEventListener('resize', resetSize)
    resetSize()
    return () => window.removeEventListener('resize', resetSize)
  }, [])
}

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
