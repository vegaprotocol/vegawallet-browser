import { useForm, useWatch } from 'react-hook-form'
import { Page } from '../../../components/page'
import { useCallback, useEffect } from 'react'
import { FULL_ROUTES } from '../..'
import { useNavigate } from 'react-router-dom'
import { Button, FormGroup, InputError, TextArea } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../../lib/form-validation'
import { importMnemonic, importMnemonicDescription, importMnemonicSubmit } from '../../../locator-ids'

interface FormFields {
  mnemonic: string
}

export const ImportWallet = () => {
  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm<FormFields>()
  const navigate = useNavigate()
  const submit = useCallback(
    (fields: FormFields) => {
      console.log(fields)
      navigate(FULL_ROUTES.wallets)
    },
    [navigate]
  )
  const mnemonic = useWatch({ control, name: 'mnemonic' })

  useEffect(() => {
    setFocus('mnemonic')
  }, [setFocus])
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
                required: Validation.REQUIRED
              })}
            />
            {errors.mnemonic?.message && <InputError forInput="mnemonic">{errors.mnemonic.message}</InputError>}
          </FormGroup>
          <Button
            data-testid={importMnemonicSubmit}
            fill={true}
            className="mt-2"
            variant="primary"
            type="submit"
            disabled={!Boolean(mnemonic)}
          >
            Import wallet
          </Button>
        </form>
      </div>
    </Page>
  )
}
