import { useForm, useWatch } from 'react-hook-form'
import { OnboardingPage } from '../../../components/pages/onboarding-page'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FormGroup, InputError, TextArea } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../../lib/form-validation'
import { FULL_ROUTES } from '../../route-names'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { createWallet } from '../../../lib/create-wallet'
import { WalletImported } from './wallet-imported'
import { LoadingButton } from '../../../components/loading-button'

export const locators = {
  importMnemonic: 'import-mnemonic',
  importMnemonicSubmit: 'import-mnemonic-submit',
  importMnemonicDescription: 'import-mnemonic-description'
}

interface FormFields {
  mnemonic: string
}

export const ImportWallet = () => {
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { request } = useJsonRpcClient()
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormFields>({
    mode: 'onChange'
  })
  const navigate = useNavigate()
  const submit = async (fields: FormFields) => {
    try {
      setLoading(true)
      await createWallet(fields.mnemonic, request, true)
      setShowSuccess(true)
    } catch (e) {
      setError('mnemonic', { message: e?.toString() })
    } finally {
      setLoading(false)
    }
  }
  const mnemonic = useWatch({ control, name: 'mnemonic' })
  if (showSuccess)
    return (
      <WalletImported
        onClose={() => {
          navigate(FULL_ROUTES.telemetry)
          setShowSuccess(false)
        }}
      />
    )
  return (
    <OnboardingPage name="Import wallet" backLocation={FULL_ROUTES.createWallet}>
      <div>
        <p data-testid={locators.importMnemonicDescription} className="mb-6">
          Enter or paste in your Vega wallet's recovery phrase.
        </p>
        <form onSubmit={handleSubmit(submit)}>
          <FormGroup label="" labelFor="mnemonic" className="mb-6">
            <TextArea
              autoFocus
              data-testid={locators.importMnemonic}
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
            data-testid={locators.importMnemonicSubmit}
            fill={true}
            className="mt-2"
            variant="primary"
            type="submit"
            loading={loading}
            disabled={!mnemonic || !!errors.mnemonic?.message}
            text="Import wallet"
            loadingText="Importing"
          />
        </form>
      </div>
    </OnboardingPage>
  )
}
