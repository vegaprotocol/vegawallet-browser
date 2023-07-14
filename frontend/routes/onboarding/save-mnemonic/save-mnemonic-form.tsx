import { useForm, useWatch } from 'react-hook-form'
import { Checkbox } from '../../../components/checkbox'
import { saveMnemonicButton } from '../../../locator-ids'
import { LoadingButton } from '../../../components/loading-button'

interface FormFields {
  acceptedTerms: boolean
}

export const SaveMnemonicForm = ({
  onSubmit,
  loading,
  disabled
}: {
  onSubmit: () => void
  loading: boolean
  disabled: boolean
}) => {
  const { control, handleSubmit } = useForm<FormFields>()
  const acceptedTerms = useWatch({ control, name: 'acceptedTerms' })
  return (
    <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
      <Checkbox
        className="mb-8"
        name="acceptedTerms"
        label="I understand that if I lose my recovery phrase, I lose access to my wallet and keys."
        control={control}
        disabled={disabled}
      />
      <LoadingButton
        loading={loading}
        text="Create wallet"
        loadingText="Creating wallet"
        data-testid={saveMnemonicButton}
        fill={true}
        type="submit"
        variant="primary"
        disabled={!Boolean(acceptedTerms) || disabled}
      />
    </form>
  )
}
