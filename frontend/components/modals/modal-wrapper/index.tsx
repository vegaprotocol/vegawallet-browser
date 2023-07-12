import { ConnectionModal } from '../connection-modal'
import { PopoverOpenModal } from '../popover-open-modal'
import { TransactionModal } from '../transaction-modal'

export const ModalWrapper = () => {
  return (
    <>
      <PopoverOpenModal />
      <ConnectionModal />
      <TransactionModal />
    </>
  )
}
