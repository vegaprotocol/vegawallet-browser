import { useForm, useWatch } from 'react-hook-form'
import { Page } from '../../../components/page'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormGroup, InputError, TextArea } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../../lib/form-validation'
import { importMnemonic, importMnemonicDescription, importMnemonicSubmit } from '../../../locator-ids'
import { FULL_ROUTES } from '../../route-names'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { createWallet } from '../../../lib/create-wallet'
import { WalletImported } from './wallet-imported'
import { LoadingButton } from '../../../components/loading-button'

interface FormFields {
  mnemonic: string
}

export const ImportWallet = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { client } = useJsonRpcClient()
  const {
    control,
    register,
    handleSubmit,
    setFocus,
    setError,
    formState: { errors }
  } = useForm<FormFields>({
    mode: 'onChange'
  })
  const navigate = useNavigate()
  const submit = useCallback(
    async (fields: FormFields) => {
      try {
        setLoading(true)
        await createWallet(fields.mnemonic, client)
        setShowSuccess(true)
      } catch (e) {
        setError('mnemonic', { message: e?.toString() })
      } finally {
        setLoading(false)
      }
    },
    [client, setError]
  )
  const mnemonic = useWatch({ control, name: 'mnemonic' })
  useEffect(() => {
    setFocus('mnemonic')
  }, [setFocus])
  if (showSuccess)
    return (
      <WalletImported
        onClose={() => {
          navigate(FULL_ROUTES.wallets)
          setShowSuccess(false)
        }}
      />
    )
  return (
    <Page name="Import wallet" backLocation={FULL_ROUTES.createWallet}>
      <div>
        <p data-testid={importMnemonicDescription} className="mb-6">
          Enter or paste in your Vega wallet's recovery phrase.
        </p>
        <form onSubmit={handleSubmit(submit)}>
          <FormGroup label="" labelFor="mnemonic" className="mb-6">
            <TextArea
              data-testid={importMnemonic}
              hasError={!!errors.mnemonic?.message}
              placeholder="24 word recovery phrase"
              {...register('mnemonic', {
                required: Validation.REQUIRED,
                validate: (value: string) => {
                  if (value.toString().split(' ').length !== 24) return 'Recovery phrase must be 24 words'
                }
              })}
            />
            {errors.mnemonic?.message && <InputError forInput="mnemonic">{errors.mnemonic.message}</InputError>}
          </FormGroup>
          <LoadingButton
            data-testid={importMnemonicSubmit}
            fill={true}
            className="mt-2"
            variant="primary"
            type="submit"
            loading={loading}
            disabled={!Boolean(mnemonic) || !!errors.mnemonic?.message}
            text="Import wallet"
            loadingText="Importing"
          />
        </form>
      </div>
    </Page>
  )
}
