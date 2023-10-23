import { Button, FormGroup, Input, InputError } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../../../../lib/form-validation'
import { useForm, useWatch } from 'react-hook-form'
import { useJsonRpcClient } from '../../../../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../../../../lib/client-rpc-methods'
import { FormFields } from './rename-key-dialog'

export const locators = {
  renameKeyInput: 'rename-key-input',
  renameKeySubmit: 'rename-key-submit'
}

export interface RenameKeyFormProps {
  keyName: string
  publicKey: string
}

export const RenameKeyForm = ({ keyName, publicKey }: RenameKeyFormProps) => {
  const { request } = useJsonRpcClient()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormFields>({
    defaultValues: {
      keyName: ''
    }
  })
  const renameKey = ({ keyName }: FormFields) => {
    request(RpcMethods.RenameKey, { publicKey, name: keyName })
  }
  const newKeyName = useWatch({ control, name: 'keyName' })
  const keyNameTooLong = newKeyName.length > 30
  return (
    <form className="mt-4" onSubmit={handleSubmit(renameKey)}>
      <FormGroup label="Name" labelFor="keyName">
        <Input
          autoFocus
          hasError={keyNameTooLong}
          data-testid={locators.renameKeyInput}
          type="text"
          placeholder={keyName}
          {...register('keyName', {
            required: Validation.REQUIRED
          })}
        />
        {keyNameTooLong && <InputError forInput="keyName">Key name cannot be more than 30 character long</InputError>}
      </FormGroup>
      <Button
        fill={true}
        data-testid={locators.renameKeySubmit}
        className="mt-2"
        variant="primary"
        type="submit"
        disabled={!newKeyName || keyNameTooLong}
      >
        Rename
      </Button>
    </form>
  )
}
