import { FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Page } from '../../../components/page'
import { useForm, useWatch } from 'react-hook-form'
import { Validation } from '../../../lib/form-validation'
import { useCallback, useEffect, useState } from 'react'
import { Checkbox } from '../../../components/checkbox'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../route-names'
import { confirmPassphraseInput, passphraseInput, submitPassphraseButton } from '../../../locator-ids'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../lib/client-rpc-methods'
import { LoadingButton } from '../../../components/loading-button'

interface FormFields {
  password: string
  confirmPassword: string
  acceptedTerms: boolean
}

export const CreatePassword = () => {
  const [loading, setLoading] = useState(false)
  const { client } = useJsonRpcClient()
  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm<FormFields>()
  const navigate = useNavigate()
  const password = useWatch({ control, name: 'password' })
  const acceptedTerms = useWatch({ control, name: 'acceptedTerms' })
  const confirmPassword = useWatch({ control, name: 'confirmPassword' })
  const submit = useCallback(
    async ({ password }: FormFields) => {
      try {
        setLoading(true)
        await client.request(RpcMethods.CreatePassphrase, { passphrase: password })
        navigate(FULL_ROUTES.createWallet)
      } finally {
        setLoading(false)
      }
    },
    [client, navigate]
  )

  useEffect(() => {
    setFocus('password')
  }, [setFocus])

  return (
    <Page name="Create Password" backLocation={FULL_ROUTES.getStarted}>
      <>
        <p className="mb-6">
          Set a password to protect and unlock your Vega Wallet. Your password can't be recovered or used to recover a
          wallet.
        </p>
        <form onSubmit={handleSubmit(submit)}>
          <FormGroup label="Password" labelFor="password" className="mb-6">
            <Input
              id="password"
              placeholder="Enter a password"
              data-testid={passphraseInput}
              type="password"
              {...register('password')}
            />
          </FormGroup>
          <FormGroup label="Confirm password" labelFor="confirmPassword" className="mb-6">
            <Input
              id="confirmPassword"
              hasError={!!errors.confirmPassword?.message}
              placeholder="Enter password again"
              data-testid={confirmPassphraseInput}
              type="password"
              {...register('confirmPassword', {
                required: Validation.REQUIRED,
                pattern: Validation.match(password)
              })}
            />
            {errors.confirmPassword?.message && (
              <InputError forInput="confirmPassword">{errors.confirmPassword.message}</InputError>
            )}
          </FormGroup>
          <Checkbox
            name="acceptedTerms"
            label="I understand that Vega Wallet cannot recover this password if I lose it"
            control={control}
          />
          <LoadingButton
            fill={true}
            data-testid={submitPassphraseButton}
            className="mt-8"
            variant="primary"
            type="submit"
            disabled={
              Boolean(errors.confirmPassword?.message) ||
              !Boolean(password) ||
              !Boolean(confirmPassword) ||
              !acceptedTerms
            }
            loading={loading}
            loadingText="Creating password"
            text="Create password"
          />
        </form>
      </>
    </Page>
  )
}
