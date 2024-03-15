import { FormEvent, useState } from 'react'

// Random default transfer transaction. This is the Vega asset on fairground and a transfer from self to self.
const createDefaultTransaction = (publicKey: string) => {
  return JSON.stringify(
    {
      publicKey: publicKey,
      sendingMode: 'TYPE_SYNC',
      transaction: {
        transfer: {
          fromAccountType: 'ACCOUNT_TYPE_GENERAL',
          toAccountType: 'ACCOUNT_TYPE_GENERAL',

          asset: 'fc7fd956078fb1fc9db5c19b88f0874c4299b2a7639ad05a47a28c0aef291b55',
          amount: '1',
          to: publicKey,

          kind: {
            oneOff: {}
          }
        }
      }
    },
    null,
    2
  )
}

export function SubmitTransaction({ keys, onDisconnect }: { keys: any[]; onDisconnect: () => void }) {
  const [tx, setTx] = useState<string>(createDefaultTransaction(keys[0].publicKey))
  const [selectedKey, setSelectedKey] = useState<string>(keys[0].publicKey)
  const [error, setError] = useState<null | string>(null)
  const [loading, setLoading] = useState(false)

  const sendTransaction = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      setLoading(true)
      await window.vega.sendTransaction(JSON.parse(tx))
    } catch (e) {
      const err = e as any
      console.error(e)
      if (err?.data?.message) {
        setError(err.data.message)
      } else {
        setError((e as Error).toString())
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <button
        id="disconnect"
        onClick={async () => {
          await window.vega.disconnectWallet()
          onDisconnect()
        }}
      >
        Disconnect
      </button>
      <form
        onSubmit={sendTransaction}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 750,
          minHeight: 200,
          justifyContent: 'space-between',
          margin: 'auto'
        }}
      >
        <p style={{ color: 'white', marginTop: 10 }}>Current key: {selectedKey}</p>
        <select style={{ marginTop: 10 }} id="key" onChange={(e) => setSelectedKey(e.target.value)}>
          {keys.map((k) => (
            <option key={k.publicKey} id={k.publicKey} value={k.publicKey}>
              {k.publicKey} ({k.name})
            </option>
          ))}
        </select>
        <textarea
          style={{ minHeight: 300, marginTop: 10 }}
          id="input"
          placeholder="Enter your message here"
          value={tx}
          onChange={(e) => setTx(e.target.value)}
        />
        <button disabled={loading} type="submit" style={{ marginTop: 10 }} id="submit">
          Submit
        </button>
        {loading ? <p style={{ color: 'white' }}>Approve transaction in wallet ⏳ </p> : null}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </>
  )
}
