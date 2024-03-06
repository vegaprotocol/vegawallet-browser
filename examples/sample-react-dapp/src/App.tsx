import { useEffect, useState } from 'react'
import './App.css'
import { SubmitTransaction } from './components/submit-tx'
import { NoExtensionDetected } from './components/extension-not-found'
import { ConnectWallet } from './components/connect'

// Partial type for the window.vega object with the methods we use. There are more that can be found on the object, in the in-page script of the extension or in the extension's source code.
declare global {
  // TODO this should probably be a published package with the types proper
  interface Window {
    vega: {
      disconnectWallet: () => Promise<void>
      connectWallet: () => Promise<void>
      listKeys: () => Promise<{ keys: any[] }>
      sendTransaction: (tx: object) => Promise<void>
      on: (event: string, cb: () => void) => void
      off: () => void
    }
  }
}

function AppContent() {
  // Connect state hoisted as shared bwetween components
  const [connected, setConnected] = useState(false)
  // Keys state likewise hoisted as shared between components
  const [keys, setKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  // Check if the extension is available
  const [hasExtension, setHasExtension] = useState(false)

  // Run when the wallet is connected
  const onConnected = async (connected: boolean) => {
    if (connected) {
      // Load all keys the dapp has access to
      const { keys } = await window.vega.listKeys()
      setKeys(keys.map((k) => k.publicKey))
    }
    setConnected(connected)
  }

  // For some reason this isn't available on first load
  // in-page script is not yet loaded. This is a hack, we should provide a better way around this.
  useEffect(() => {
    setHasExtension(!!window.vega)
    if (!window.vega) {
      setLoading(true)
    }
    // Give it 100 milliseconds of time for the inpage script to load
    setTimeout(() => {
      setLoading(false)
      setHasExtension(!!window.vega)
    }, 100)
  }, [])

  useEffect(() => {
    // Wait for window.vega to be defined
    if (hasExtension) {
      // Register disconnect event handler for if the user disconnects the app from the extension.
      window.vega.on('client.disconnected', () => {
        setConnected(false)
      })
    }
    // Remove all events. Can do specific events but easier for demo this way.
    return () => {
      if (window.vega) {
        window.vega.off()
      }
    }
  }, [hasExtension])
  if (loading) {
    return null // Wait until we are sure the user has the extension or not. Until then render nothing.
  } else if (!hasExtension) {
    return <NoExtensionDetected /> // If the user doesn't have the extension, render a message to install it.
  } else if (!connected) {
    return <ConnectWallet onConnected={onConnected} /> // If the user is not connected, render the connect wallet button.
  } else {
    return (
      <SubmitTransaction onDisconnect={() => setConnected(false)} keys={keys} /> // If the user is connected, render the transaction form.
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Example Vega dApp</h1>
      </header>
      <AppContent />
    </div>
  )
}

export default App
