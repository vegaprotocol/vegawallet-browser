import { useForm, useWatch } from 'react-hook-form'
import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../lib/form-validation'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../route-names'
import { StarsWrapper } from '../../components/stars-wrapper'
import { loginButton, loginPassphrase } from '../../locator-ids'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { useHomeStore } from '../home/store'

const REJECTION_ERROR_MESSAGE = 'Invalid passphrase or corrupted storage'

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
  const { loadGlobals } = useHomeStore((state) => ({
    loadGlobals: state.loadGlobals
  }))
  const navigate = useNavigate()
  const passphrase = useWatch({ control, name: 'passphrase' })
  const submit = useCallback(
    async (fields: { passphrase: string }) => {
      try {
        await client.request('admin.unlock', { passphrase: fields.passphrase })
        await loadGlobals(client)
        navigate(FULL_ROUTES.home)
      } catch (e) {
        if (e instanceof Error && e.message === REJECTION_ERROR_MESSAGE) {
          setError('passphrase', { message: 'Incorrect passphrase' })
        } else {
          const message = e instanceof Error ? e.message : e?.toString() || 'Unexpected error'
          setError('passphrase', { message })
        }
      }
    },
    [client, loadGlobals, navigate, setError]
  )
  useEffect(() => {
    setFocus('passphrase')
  }, [setFocus])
  return (
    <StarsWrapper>
      <form className="text-left" onSubmit={handleSubmit(submit)}>
        <FormGroup label="Password" labelFor="passphrase">
          <Input
            hasError={!!errors.passphrase?.message}
            data-testid={loginPassphrase}
            type="password"
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
