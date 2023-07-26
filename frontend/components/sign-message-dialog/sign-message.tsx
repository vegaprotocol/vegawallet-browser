import { Button, TextArea } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'

export const locators = {
  messageInput: 'message-input',
  cancelButton: 'cancel-button',
  signButton: 'sign-button',
  messageDescription: 'message-description',
  signMessageHeader: 'sign-message-header'
}

interface SignMessageProps {
  onCancel: () => void
  onSign: ({ message }: { message: string }) => void
  disabled: boolean
}

const SignMessageForm = ({ onCancel, onSign, disabled }: SignMessageProps) => {
  const { register, handleSubmit } = useForm<{ message: string }>()
  return (
    <form onSubmit={handleSubmit(onSign)}>
      <TextArea {...register('message')} autoFocus placeholder="Enter a message" data-testid={locators.messageInput} />
      <div className="mt-4 flex justify-between">
        <Button disabled={disabled} onClick={onCancel} data-testid={locators.cancelButton}>
          Cancel
        </Button>
        <Button disabled={disabled} type="submit" variant="secondary" data-testid={locators.signButton}>
          Sign
        </Button>
      </div>
    </form>
  )
}

export const SignMessage = ({ onCancel, onSign, disabled }: SignMessageProps) => {
  return (
    <div className="p-2 text-center">
      <h1 data-testid={locators.signMessageHeader} className="text-xl text-white mb-2">
        Sign message
      </h1>
      <p className="mb-3" data-testid={locators.messageDescription}>
        Enter the message you want to encrypt.
      </p>
      <SignMessageForm onCancel={onCancel} onSign={onSign} disabled={disabled} />
    </div>
  )
}
