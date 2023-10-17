import { useState } from 'react'
import { Dialog, Button } from '@vegaprotocol/ui-toolkit'
import { VegaSection } from '../../../../../components/vega-section'
import { ExportPrivateKeyForm } from './export-private-key-form'
import { ViewPrivateKey } from './view-private-key'
import { Withdraw } from '../../../../../components/icons/withdraw'

export interface FormFields {
  passphrase: string
}

export const locators = {
  privateKeyDialog: 'private-key-dialog',
  privateKeyTitle: 'private-key-title',
  privateKeyTrigger: 'private-key-trigger'
}

export const ExportPrivateKeysDialog = ({ publicKey }: { publicKey: string }) => {
  const [open, setOpen] = useState(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)

  const resetDialog = () => {
    setPrivateKey(null)
    setOpen(false)
  }
  return (
    <>
      <VegaSection>
        <Button
          onClick={() => setOpen(true)}
          fill={true}
          className="flex justify-center"
          data-testid={locators.privateKeyTrigger}
        >
          Export private key
          <Withdraw />
        </Button>
      </VegaSection>
      <Dialog open={open} onInteractOutside={resetDialog} onChange={resetDialog}>
        <div className="p-2 text-base text-vega-dark-400">
          <h1 data-testid={locators.privateKeyTitle} className="text-xl  text-center text-white mb-2">
            Export Private Key
          </h1>
          {privateKey ? (
            <ViewPrivateKey privateKey={privateKey} onClose={resetDialog} />
          ) : (
            <ExportPrivateKeyForm
              publicKey={publicKey}
              onSuccess={(passphrase: string) => setPrivateKey(passphrase)}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </Dialog>
    </>
  )
}
