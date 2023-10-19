import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../../../../lib/form-validation'
import { useForm } from 'react-hook-form'
import { useJsonRpcClient } from '../../../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../../../lib/client-rpc-methods'
import { FormFields, locators } from './rename-key-dialog'

export interface RenameKeyFormProps {
  keyName: string
  publicKey: string
}

export const RenameKeyForm = ({ keyName, publicKey }: RenameKeyFormProps) => {
  const { request } = useJsonRpcClient()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormFields>()
  const renameKey = ({ keyName }: FormFields) => {
    request(RpcMethods.RenameKey, { publicKey, name: keyName })
  }

  return (
    <form onSubmit={handleSubmit(renameKey)}>
      <FormGroup label="keyName" labelFor="passphrase">
        <Input
          autoFocus
          hasError={!!errors.keyName?.message}
          data-testid={locators.renameKeyInput}
          type="text"
          {...register('keyName', {
            required: Validation.REQUIRED
          })}
        />
        {errors.keyName?.message && <InputError forInput="keyName">{errors.keyName.message}</InputError>}
      </FormGroup>
      <Button
        fill={true}
        data-testid={locators.renameKeySubmit}
        className="mt-2"
        variant="primary"
        type="submit"
        disabled={!keyName}
      >
        Submit
      </Button>
    </form>
  )
}
