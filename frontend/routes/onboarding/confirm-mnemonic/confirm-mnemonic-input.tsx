import { Input } from '@vegaprotocol/ui-toolkit'
import { Validation } from '../../../lib/form-validation'

export const ConfirmMnemonicInput = ({
  splitMnemonic,
  requiredWords,
  index,
  register,
  errors
}: {
  splitMnemonic: string[]
  index: number
  requiredWords: number[]
  register: any
  errors: any
}) => {
  const isRequired = requiredWords.includes(index)
  const lowestIndex = requiredWords[0]
  return (
    <Input
      autoFocus={lowestIndex === index}
      key={`mnemonic-input-${index}`}
      id={`mnemonic-input-${index}`}
      hasError={errors[index.toString()]?.message}
      disabled={!isRequired}
      placeholder={isRequired ? `Word ${index}` : '********'}
      data-testid={`mnemonic-input-${index}`}
      type={isRequired ? 'text' : 'password'}
      {...(isRequired
        ? register(index.toString(), {
            required: Validation.REQUIRED,
            pattern: Validation.match(splitMnemonic[index])
          })
        : {})}
    />
  )
}
