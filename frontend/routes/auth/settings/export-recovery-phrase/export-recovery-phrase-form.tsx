import { captureException } from '@sentry/browser'
import { Button, FormGroup, Input, InputError, Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'

import { LoadingButton } from '@/components/loading-button'
import { useJsonRpcClient } from '@/contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { Validation } from '@/lib/form-validation'
import { REJECTION_ERROR_MESSAGE } from '@/lib/utils'

export const locators = {
  exportRecoveryPhraseForm: 'export-recovery-phrase-form',
  exportRecoveryPhraseFormDescription: 'export-recovery-phrase-form-description',
  exportRecoveryPhraseFormModalPassphrase: 'export-recovery-phrase-form-modal-passphrase',
  exportRecoveryPhraseFormModalSubmit: 'export-recovery-phrase-form-modal-submit',
  exportRecoveryPhraseFormModalClose: 'export-recovery-phrase-form-modal-close'
}

export interface FormFields {
  passphrase: string
}

export interface ExportRecoveryPhraseFromProperties {
  walletName: string
  onSuccess: (privateKey: string) => void
  onClose: () => void
}

export const ExportRecoveryPhraseForm = ({ onSuccess, onClose, walletName }: ExportRecoveryPhraseFromProperties) => {
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

  const exportPrivateKey = async ({ passphrase }: FormFields) => {
    try {
      setLoading(true)
      const { recoveryPhrase } = await request(RpcMethods.ExportRecoveryPhrase, { passphrase, walletName }, true)
      onSuccess(recoveryPhrase)
    } catch (error) {
      if (error instanceof Error && error.message === REJECTION_ERROR_MESSAGE) {
        setError('passphrase', { message: 'Incorrect passphrase' })
      } else {
        setError('passphrase', { message: `Unknown error occurred: ${(error as Error).message}` })
        captureException(error)
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
        data-testid={locators.exportRecoveryPhraseFormDescription}
      />
      <form className="text-left mt-3" onSubmit={handleSubmit(exportPrivateKey)}>
        <FormGroup label="Password" labelFor="passphrase">
          <Input
            autoFocus
            hasError={!!errors.passphrase?.message}
            data-testid={locators.exportRecoveryPhraseFormModalPassphrase}
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
            data-testid={locators.exportRecoveryPhraseFormModalSubmit}
            className="mt-2"
            variant="secondary"
            type="submit"
            disabled={!passphrase}
          />
          <Button
            data-testid={locators.exportRecoveryPhraseFormModalClose}
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
