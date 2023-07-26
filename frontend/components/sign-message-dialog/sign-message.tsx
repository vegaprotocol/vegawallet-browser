import { Input, Button } from '@vegaprotocol/ui-toolkit'
import { useForm } from 'react-hook-form'

interface SignMessageProps {
  onCancel: () => void
  onSign: ({ message }: { message: string }) => void
  disabled: boolean
}

const SignMessageForm = ({ onCancel, onSign, disabled }: SignMessageProps) => {
  const { register, handleSubmit } = useForm<{ message: string }>()
  return (
    <form onSubmit={handleSubmit(onSign)}>
      <Input {...register('message')} autoFocus type="text" placeholder="Enter a message" />
      <div className="mt-4 flex justify-between">
        <Button disabled={disabled} onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={disabled} type="submit" variant="secondary">
          Sign
        </Button>
      </div>
    </form>
  )
}

export const SignMessage = ({ onCancel, onSign, disabled }: SignMessageProps) => {
  return (
    <div className="p-2 text-center">
      <h1 className="text-xl text-white mb-2">Sign message</h1>
      <p className="mb-3">Enter the message you want to encrypt.</p>
      <SignMessageForm onCancel={onCancel} onSign={onSign} disabled={disabled} />
    </div>
  )
}
