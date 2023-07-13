import { useForm, useWatch } from 'react-hook-form'
import { FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../lib/form-validation'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../route-names'
import { StarsWrapper } from '../../components/stars-wrapper'
import { loginButton, loginPassphrase } from '../../locator-ids'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { LoadingButton } from '../../components/loading-button'
import { VegaHeader } from '../../components/vega-header'
import { useGlobalsStore } from '../../stores/globals'
import { RpcMethods } from '../../lib/client-rpc-methods'

const REJECTION_ERROR_MESSAGE = 'Invalid passphrase or corrupted storage'

interface FormFields {
  passphrase: string
}

export const Login = () => {
  const [loading, setLoading] = useState(false)
  const { request } = useJsonRpcClient()
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormFields>()
  const { loadGlobals } = useGlobalsStore((state) => ({
    loadGlobals: state.loadGlobals
  }))
  const navigate = useNavigate()
  const passphrase = useWatch({ control, name: 'passphrase' })
  const submit = useCallback(
    async (fields: { passphrase: string }) => {
      try {
        setLoading(true)
        await request('admin.unlock', { passphrase: fields.passphrase }, true)
        await loadGlobals(request)
        navigate(FULL_ROUTES.home)
      } catch (e) {
        if (e instanceof Error && e.message === REJECTION_ERROR_MESSAGE) {
          setError('passphrase', { message: 'Incorrect passphrase' })
        } else {
          setError('passphrase', { message: `Unknown error occurred ${e}` })
        }
      } finally {
        setLoading(false)
      }
    },
    [request, loadGlobals, navigate, setError, setLoading]
  )
  return (
    <StarsWrapper>
      <VegaHeader />
      <form className="text-left" onSubmit={handleSubmit(submit)}>
        <FormGroup label="Password" labelFor="passphrase">
          <Input
            autoFocus
            hasError={!!errors.passphrase?.message}
            data-testid={loginPassphrase}
            type="password"
            {...register('passphrase', {
              required: Validation.REQUIRED
            })}
          />
          {errors.passphrase?.message && <InputError forInput="passphrase">{errors.passphrase.message}</InputError>}
        </FormGroup>
        <LoadingButton
          loading={loading}
          loadingText="Logging in"
          text="Login"
          data-testid={loginButton}
          fill={true}
          className="mt-2"
          variant="primary"
          type="submit"
          disabled={!Boolean(passphrase)}
        />
      </form>
    </StarsWrapper>
  )
}
