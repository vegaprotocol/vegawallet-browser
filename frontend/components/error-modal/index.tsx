import { Button } from '@vegaprotocol/ui-toolkit'
import { CodeWindow } from '../code-window'
import { Warning } from '../icons/warning'
import { Splash } from '../splash'
import locators from '../locators'

export const ErrorModal = ({ error, onClose }: { error: Error | null; onClose: () => void }) => {
  return (
    <Splash data-testid={locators.errorModal}>
      <section className="text-center">
        <h1 className="text-3xl mb-4">Something's gone wrong 🙃</h1>
        <Warning className="w-12 text-vega-pink" />
        <div className="my-5">
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
