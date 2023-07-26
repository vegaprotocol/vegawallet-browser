import { Button } from '@vegaprotocol/ui-toolkit'
import { CodeWindow } from '../code-window'

export const SignedMessage = ({ onClick, message }: { onClick: () => void; message: string }) => {
  return (
    <div className="p-2 text-center">
      <h1 className="text-xl text-white mb-2">Your signed message</h1>
      <CodeWindow text={message} content={message} />
      <Button variant="secondary" fill={true} onClick={onClick}>
        Done
      </Button>
    </div>
  )
}
