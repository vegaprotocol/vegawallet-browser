import { Button } from '@vegaprotocol/ui-toolkit'
import { usePopoverStore } from '../../stores/popover-store'
import { Frame } from '../frame'
import { ExpandIcon } from '../icons/expand'
import { Splash } from '../splash'

export const locators = {
  popoverModal: 'popover-modal'
}

export const PopoverOpenModal = () => {
  const { focusPopover, popoverOpen } = usePopoverStore((state) => ({
    popoverOpen: state.popoverOpen,
    focusPopover: state.focusPopover
  }))

  if (!popoverOpen) return null
  return (
    <Splash data-testid={locators.popoverModal} centered={true}>
      <Frame>
        <div className="text-center">
          <div className="flex justify-center">
            <ExpandIcon size={24} />
          </div>
          <p className="my-4 text-lg">You’re viewing your wallet in another window</p>
          <Button fill={true} onClick={focusPopover} variant="primary">
            Continue here
          </Button>
        </div>
      </Frame>
    </Splash>
  )
}
