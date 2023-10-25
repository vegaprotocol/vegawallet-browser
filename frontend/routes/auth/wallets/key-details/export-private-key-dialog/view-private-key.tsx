import { Button } from '@vegaprotocol/ui-toolkit'
import { HiddenContainer } from '../../../../../components/hidden-container'

export const locators = {
  viewPrivateKeyClose: 'view-private-key-close'
}

export interface ViewPrivateKeyProps {
  onClose: () => void
  privateKey: string
}

export const ViewPrivateKey = ({ privateKey, onClose }: ViewPrivateKeyProps) => {
  return (
    <>
      <HiddenContainer wrapContent={true} text="Reveal private key" hiddenInformation={privateKey} />
      <Button
        data-testid={locators.viewPrivateKeyClose}
        className="mt-4"
        fill={true}
        variant="primary"
        onClick={onClose}
      >
        Close
      </Button>
    </>
  )
}
