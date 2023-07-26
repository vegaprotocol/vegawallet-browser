import { Dialog } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'
import { useJsonRpcClient } from '../../contexts/json-rpc/json-rpc-context'
import { RpcMethods } from '../../lib/client-rpc-methods'
import { SignedMessage } from './signed-message'
import { SignMessage } from './sign-message'

export interface SignMessageDialogProps {
  publicKey: string | null
  onClose: () => void
  open: boolean
}

export const SignMessageDialog = ({ publicKey, onClose, open }: SignMessageDialogProps) => {
  const { request } = useJsonRpcClient()
  const [signedMessage, setSignedMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const signMessage = async ({ message }: { message: string }) => {
    setLoading(true)
    const { signature } = await request(RpcMethods.SignMessage, { publicKey, message })
    setSignedMessage(signature)
    setLoading(false)
  }
  const resetDialog = () => {
    onClose()
    setSignedMessage(null)
  }
  return (
    <Dialog open={open} onInteractOutside={resetDialog} onChange={resetDialog}>
      {signedMessage ? (
        <SignedMessage message={signedMessage} onClick={resetDialog} />
      ) : (
        <SignMessage onSign={signMessage} onCancel={resetDialog} disabled={loading} />
      )}
    </Dialog>
  )
}
