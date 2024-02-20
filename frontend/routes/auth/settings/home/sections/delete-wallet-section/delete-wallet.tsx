import { Button, Dialog } from '@vegaprotocol/ui-toolkit'
import { useState } from 'react'

import { VegaSection } from '@/components/vega-section'

import { DeleteWalletForm } from './delete-wallet-form'

export const locators = {
  deleteWalletButton: 'delete-wallet-button',
  deleteWalletName: 'delete-wallet-name',
  deleteWalletTitle: 'delete-wallet-title'
}

export interface FormFields {
  walletName: string
}

export const DeleteWallet = () => {
  const [open, setOpen] = useState(false)

  const resetDialog = () => {
    setOpen(false)
  }

  return (
    <>
      <VegaSection>
        <Button
          className="mt-2"
          data-testid={locators.deleteWalletButton}
          fill={true}
          variant="secondary"
          type="submit"
        >
          Delete wallet
        </Button>
      </VegaSection>
      <Dialog open={open} onInteractOutside={resetDialog} onChange={resetDialog}>
        <div className="p-2 text-base text-vega-dark-400">
          <h1 data-testid={locators.deleteWalletTitle} className="text-xl  text-center text-white mb-2">
            Delete Wallet Title
          </h1>
          <DeleteWalletForm />
        </div>
      </Dialog>
    </>
  )
}
