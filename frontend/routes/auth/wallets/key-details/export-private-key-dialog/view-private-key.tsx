import { Button } from '@vegaprotocol/ui-toolkit'
import { HiddenContainer } from '../../../../../components/hidden-container'

export const locators = {
  viewPrivateKeyClose: 'view-private-key-close'
}

export const ViewPrivateKey = ({ privateKey, onClose }: { onClose: () => void; privateKey: string }) => {
  return (
    <>
      <HiddenContainer text="Reveal private key" hiddenInformation={privateKey} />
      <Button
        data-testid={locators.viewPrivateKeyClose}
        className="mt-4"
        fill={true}
        variant="primary"
        onClick={onClose}
      >
        Done
      </Button>
    </>
  )
}
