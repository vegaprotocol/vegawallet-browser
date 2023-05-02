import { useForm, useWatch } from 'react-hook-form'
import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../lib/form-validation'
import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '..'
import { StarsWrapper } from '../../components/stars-wrapper'
import { loginButton, loginPassword } from '../../locator-ids'

interface FormFields {
  password: string
}

export const Login = () => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors }
  } = useForm<FormFields>()
  const navigate = useNavigate()
  const password = useWatch({ control, name: 'password' })
  const submit = useCallback(
    (fields: { password: string }) => {
      if (fields.password === '123') {
        // Navigate to home so it can redirect to the correct page
        navigate(FULL_ROUTES.home)
      } else {
        setError('password', { message: 'Incorrect password' })
      }
    },
    [navigate, setError]
  )
  useEffect(() => {
    setFocus('password')
  }, [setFocus])
  return (
    <StarsWrapper>
      <form className="text-left" onSubmit={handleSubmit(submit)}>
        <FormGroup label="Password" labelFor="password">
          <Input
            hasError={!!errors.password?.message}
            data-testid={loginPassword}
            type="password"
            {...register('password', {
              required: Validation.REQUIRED
            })}
          />
          {errors.password?.message && <InputError forInput="passphrase">{errors.password.message}</InputError>}
        </FormGroup>
        <Button
          data-testid={loginButton}
          fill={true}
          className="mt-2"
          variant="primary"
          type="submit"
          disabled={!Boolean(password)}
        >
          Login
        </Button>
      </form>
    </StarsWrapper>
  )
}
