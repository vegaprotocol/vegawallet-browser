import { useCallback, useEffect, useState } from 'react'
import { Page } from '../../../components/page'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { Checkbox } from '../../../components/checkbox'
import { MnemonicContainer } from '../../../components/mnemonic-container'
import { saveMnemonicButton, saveMnemonicDescription } from '../../../locator-ids'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import { createWallet } from '../../../lib/create-wallet'
import { LoadingButton } from '../../../components/loading-button'
import { WalletCreated } from './wallet-created'

interface FormFields {
  acceptedTerms: boolean
}

export const SaveMnemonic = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { client } = useJsonRpcClient()
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<FormFields>()
  const [mnemonicShown, setMnemonicShown] = useState<boolean>(false)
  const [mnemonic, setMnemonic] = useState<string | null>(null)

  const suggestMnemonic = useCallback(async () => {
    const res = await client.request(RpcMethods.GenerateRecoveryPhrase, null)
    const { recoveryPhrase } = res
    setMnemonic(recoveryPhrase)
  }, [client])

  useEffect(() => {
    suggestMnemonic()
  }, [suggestMnemonic])

  const acceptedTerms = useWatch({ control, name: 'acceptedTerms' })

  const submit = useCallback(async () => {
    try {
      setLoading(true)
      await createWallet(mnemonic as string, client)
      setShowSuccess(true)
    } finally {
      setLoading(false)
    }
  }, [client, mnemonic, setLoading, setShowSuccess])
  // While loading, render nothing
  if (!mnemonic) return null
  if (showSuccess)
    return (
      <WalletCreated
        onClose={() => {
          navigate(FULL_ROUTES.wallets)
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
        <form className="mt-8" onSubmit={handleSubmit(submit)}>
          {mnemonicShown && (
            <Checkbox
              className="mb-8"
              name="acceptedTerms"
              label="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."
              control={control}
            />
          )}
          <LoadingButton
            loading={loading}
            text="Create wallet"
            loadingText="Creating wallet"
            data-testid={saveMnemonicButton}
            fill={true}
            type="submit"
            variant="primary"
            disabled={!Boolean(acceptedTerms)}
          />
        </form>
      </>
    </Page>
  )
}
