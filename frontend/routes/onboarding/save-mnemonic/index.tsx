import { useState } from 'react'
import { Page } from '../../../components/page'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { MnemonicContainer } from '../../../components/mnemonic-container'
import { saveMnemonicDescription } from '../../../locator-ids'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { createWallet } from '../../../lib/create-wallet'
import { WalletCreated } from './wallet-created'
import { clearMnemonic, useSuggestMnemonic } from '../../../hooks/suggest-mnemonic'
import { SaveMnemonicForm } from './save-mnemonic-form'

export const SaveMnemonic = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { request } = useJsonRpcClient()
  const navigate = useNavigate()
  const [mnemonicShown, setMnemonicShown] = useState<boolean>(false)
  const { mnemonic } = useSuggestMnemonic()

  const submit = async () => {
    try {
      setLoading(true)
      await createWallet(mnemonic as string, request)
      setShowSuccess(true)
    } finally {
      setLoading(false)
    }
  }
  // While loading, render nothing
  if (!mnemonic) return null
  if (showSuccess)
    return (
      <WalletCreated
        onClose={() => {
          navigate(FULL_ROUTES.telemetry)
          setShowSuccess(false)
        }}
      />
    )
  return (
    <Page name="Secure your wallet">
      <>
        <p data-testid={saveMnemonicDescription} className="pb-6">
          Write down or save this recovery phrase to a safe place. You'll need it to recover your wallet. Never share
          this with anyone else.
        </p>
        <MnemonicContainer mnemonic={mnemonic} onChange={setMnemonicShown} />
        <SaveMnemonicForm onSubmit={submit} loading={loading} disabled={!mnemonicShown} />
      </>
    </Page>
  )
}
