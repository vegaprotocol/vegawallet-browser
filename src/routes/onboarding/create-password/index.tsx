import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Page } from '../../../components/page'
import { useForm, useWatch } from 'react-hook-form'
import { Validation } from '../../../lib/form-validation'
import { useCallback, useEffect } from 'react'
import { Checkbox } from '../../../components/checkbox'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../..'
import { confirmPasswordInput, passwordInput } from '../../../locator-ids'

interface FormFields {
  password: string
  confirmPassword: string
  acceptedTerms: boolean
}

export const CreatePassword = () => {
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
  const submit = useCallback(
    (fields: { confirmPassword: string; password: string }) => {
      console.log(fields)
      navigate(FULL_ROUTES.createWallet)
    },
    [navigate]
  )

  useEffect(() => {
    setFocus('password')
  }, [setFocus])

  return (
    <Page name="Create Password" backLocation={FULL_ROUTES.getStarted}>
      <>
        <p className="mb-6">
          Set a password to protect and unlock your Vega Wallet. Your password
          can't be recovered or used to recover a wallet.
        </p>
        <form onSubmit={handleSubmit(submit)}>
          <FormGroup label="Password" labelFor="password" className="mb-6">
            <Input
              id="password"
              hasError={!!errors.password?.message}
              placeholder="Enter a password"
              data-testid={passwordInput}
              type="password"
              {...register('password', { required: Validation.REQUIRED })}
            />
          </FormGroup>
          <FormGroup
            label="Confirm password"
            labelFor="confirmPassword"
            className="mb-6"
          >
            <Input
              id="confirmPassword"
              hasError={!!errors.confirmPassword?.message}
              placeholder="Enter password again"
              data-testid={confirmPasswordInput}
              type="password"
              {...register('confirmPassword', {
                required: Validation.REQUIRED,
                pattern: Validation.match(password)
              })}
            />
            {errors.confirmPassword?.message && (
              <InputError forInput="confirmPassword">
                {errors.confirmPassword.message}
              </InputError>
            )}
          </FormGroup>
          <Checkbox
            name="acceptedTerms"
            label="I understand that Vega Wallet cannot recover this password if I lose it"
            control={control}
          />
          <Button
            fill={true}
            className="mt-8"
            variant="primary"
            type="submit"
            disabled={
              Boolean(errors.confirmPassword?.message) || !acceptedTerms
            }
          >
            Submit
          </Button>
        </form>
      </>
    </Page>
  )
}
