import { FormEvent, useState } from 'react'

export function ConnectWallet({
  onConnected
}: Readonly<{
  onConnected: (value: boolean) => void
}>) {
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(false)
  const [chainId, setChainId] = useState('vega-fairground-202305051805' as string)
  const handleConnection = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setLoading(true)
      await window.vega.connectWallet({
        chainId
      })
      onConnected(true)
    } catch (e) {
      console.error(e)
      onConnected(false)
      setError((e as unknown as Error).toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <form style={{ width: '100%', maxWidth: 400, margin: 'auto' }} onSubmit={handleConnection}>
      <select style={{ width: '100%' }} value={chainId} onChange={(e) => setChainId(e.target.value)}>
        <option value="vega-mainnet-0011">Mainnet</option>
        <option value="vega-fairground-202305051805">Fairground</option>
        <option value="vega-stagnet1-202307191148">Stagnet</option>
        <option value="vega-devnet1-202401251038">Devnet</option>
        <option value="vega-mainnet-mirror-202306231148">Mirror</option>
        <option value="vega-testnet-0002-v4">Validator Testnet</option>
      </select>
      <button style={{ width: '100%', marginTop: 10 }} type="submit" disabled={loading} id="connect">
        Connect Wallet
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
