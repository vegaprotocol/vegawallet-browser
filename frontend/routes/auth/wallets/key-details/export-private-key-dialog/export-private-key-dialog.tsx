import { useState } from 'react'
import { Dialog, ButtonLink } from '@vegaprotocol/ui-toolkit'
import { VegaSection } from '../../../../../components/vega-section'
import { ExportPrivateKeyForm } from './export-private-key-form'
import { ViewPrivateKey } from './view-private-key'

export interface FormFields {
  passphrase: string
}

export const locators = {
  privateKeyDialog: 'private-key-dialog',
  privateKeyTitle: 'private-key-title',
  privateKeyTrigger: 'private-key-trigger'
}

export const ExportPrivateKeysDialog = () => {
  const [open, setOpen] = useState(false)
  const [privateKey, setPrivateKey] = useState<string | null>(null)

  const resetDialog = () => {
    setPrivateKey(null)
    setOpen(false)
  }
  return (
    <>
      <VegaSection>
        <ButtonLink data-testid={locators.privateKeyTrigger} onClick={() => setOpen(true)}>
          <span className="underline flex">
            Export private key
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="21" width="16" height="1" fill="white" />
              <path d="M12 17.5L12 2M12 2L19.5 9M12 2C12 2 6.64788 7.04738 4.5 9" stroke="white" />
            </svg>
          </span>
        </ButtonLink>
      </VegaSection>
      <Dialog open={open} onInteractOutside={resetDialog} onChange={resetDialog}>
        <div className="p-2 text-base text-vega-dark-400">
          <h1 data-testid={locators.privateKeyTitle} className="text-xl  text-center text-white mb-2">
            Export private key
          </h1>
          {privateKey ? (
            <ViewPrivateKey privateKey={privateKey} onClose={resetDialog} />
          ) : (
            <ExportPrivateKeyForm
              onSuccess={(passphrase: string) => setPrivateKey(passphrase)}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </Dialog>
    </>
  )
}
