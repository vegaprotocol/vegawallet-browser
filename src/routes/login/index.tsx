import { useForm, useWatch } from 'react-hook-form'
import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../lib/form-validation'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../route-names'
import { StarsWrapper } from '../../components/stars-wrapper'
import { loginButton, loginPassphrase } from '../../locator-ids'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'

interface FormFields {
  passphrase: string
}

export const Login = () => {
  const { client } = useJsonRpcClient()
  const {
    control,
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors }
  } = useForm<FormFields>()
  const navigate = useNavigate()
  const passphrase = useWatch({ control, name: 'passphrase' })
  const submit = useCallback(
    async (fields: { passphrase: string }) => {
      try {
        await client.request('admin.unlock', { passphrase: fields.passphrase })
        navigate(FULL_ROUTES.wallets)
      } catch (e) {
        // TODO handle if error or if passphrase wrong
        setError('passphrase', { message: 'Incorrect passphrase' })
      }
    },
    [client, navigate, setError]
  )
  useEffect(() => {
    setFocus('passphrase')
  }, [setFocus])
  return (
    <StarsWrapper>
      <form className="text-left" onSubmit={handleSubmit(submit)}>
        <FormGroup label="passphrase" labelFor="passphrase">
          <Input
            hasError={!!errors.passphrase?.message}
            data-testid={loginPassphrase}
            type="passphrase"
            {...register('passphrase', {
              required: Validation.REQUIRED
            })}
          />
          {errors.passphrase?.message && <InputError forInput="passphrase">{errors.passphrase.message}</InputError>}
        </FormGroup>
        <Button
          data-testid={loginButton}
          fill={true}
          className="mt-2"
          variant="primary"
          type="submit"
          disabled={!Boolean(passphrase)}
        >
          Login
        </Button>
      </form>
    </StarsWrapper>
  )
}
