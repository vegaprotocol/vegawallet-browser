import { Button } from '@vegaprotocol/ui-toolkit'
import { CodeWindow } from '../code-window'
import { Splash } from '../splash'
import { ErrorIcon } from '../icons/error'

export const locators = {
  errorModal: 'error-modal',
  errorModalClose: 'error-modal-close',
  errorModalHeader: 'error-modal-description'
}

export const ErrorModal = ({ error, onClose }: { error: Error | null; onClose: () => void }) => {
  return (
    <Splash data-testid={locators.errorModal}>
      <section className="h-full text-center flex flex-col justify-center">
        <div className="text-center mx-auto">
          <ErrorIcon />
        </div>
        <h1 className="text-2xl mb-6">Something's gone wrong</h1>
        <div className="mb-8">
          {error ? (
            <CodeWindow content={error.message} text={error.message} />
          ) : (
            <CodeWindow content={'An unknown error occurred'} text={'An unknown error occurred'} />
          )}
        </div>
        <Button data-testid={locators.errorModalClose} onClick={onClose}>
          Close
        </Button>
      </section>
    </Splash>
  )
}
