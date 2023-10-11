import { useState } from 'react'
import { useJsonRpcClient } from '../../../../../contexts/json-rpc/json-rpc-context'
import { FormGroup, InputError, Button, Input, Notification, Intent } from '@vegaprotocol/ui-toolkit'
import { useForm, useWatch } from 'react-hook-form'
import { LoadingButton } from '../../../../../components/loading-button'
import { RpcMethods } from '../../../../../lib/client-rpc-methods'
import { Validation } from '../../../../../lib/form-validation'
import { REJECTION_ERROR_MESSAGE } from '../../../../../lib/utils'
import { FormFields } from './export-private-key-dialog'
import { captureException } from '@sentry/browser'

export const locators = {
  privateKeyModalPassphrase: 'private-key-modal-passphrase',
  privateKeyModalClose: 'private-key-modal-close',
  privateKeyModalSubmit: 'private-key-modal-submit',
  privateKeyDescription: 'private-key-description'
}

export interface ExportPrivateKeyFormProps {
  publicKey: string
  onSuccess: (privateKey: string) => void
  onClose: () => void
}

export const ExportPrivateKeyForm = ({ publicKey, onSuccess, onClose }: ExportPrivateKeyFormProps) => {
  const { request } = useJsonRpcClient()
  const [loading, setLoading] = useState(false)
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormFields>()
  const passphrase = useWatch({ control, name: 'passphrase' })

  const exportPrivateKey = async ({ passphrase }: { passphrase: string }) => {
    try {
      setLoading(true)
      const { secretKey } = await request(RpcMethods.ExportKey, { publicKey, passphrase }, true)
      onSuccess(secretKey)
    } catch (e) {
      if (e instanceof Error && e.message === REJECTION_ERROR_MESSAGE) {
        setError('passphrase', { message: 'Incorrect passphrase' })
      } else {
        setError('passphrase', { message: `Unknown error occurred ${e}` })
        captureException(e)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <Notification
        message="Warning: Never share this key. Anyone who has access to this key will have access to your assets."
        intent={Intent.Danger}
        data-testid={locators.privateKeyDescription}
      />
      <form className="text-left mt-3" onSubmit={handleSubmit(exportPrivateKey)}>
        <FormGroup label="Password" labelFor="passphrase">
          <Input
            autoFocus
            hasError={!!errors.passphrase?.message}
            data-testid={locators.privateKeyModalPassphrase}
            type="password"
            {...register('passphrase', {
              required: Validation.REQUIRED
            })}
          />
          {errors.passphrase?.message && <InputError forInput="passphrase">{errors.passphrase.message}</InputError>}
        </FormGroup>
        <div className="flex flex-col gap-1 justify-between">
          <LoadingButton
            loading={loading}
            fill={true}
            loadingText="Exporting"
            text="Export"
            data-testid={locators.privateKeyModalSubmit}
            className="mt-2"
            variant="secondary"
            type="submit"
            disabled={!passphrase}
          />
          <Button
            data-testid={locators.privateKeyModalClose}
            fill={true}
            onClick={onClose}
            className="mt-2"
            variant="default"
            type="submit"
          >
            Close
          </Button>
        </div>
      </form>
    </>
  )
}
