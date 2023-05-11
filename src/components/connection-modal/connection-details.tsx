import { Button } from '@vegaprotocol/ui-toolkit'
import { Frame } from '../frame'
import { Tick } from '../icons/tick'
import { ModalHeader } from '../modal-header'

import locators from '../locators'

export const ConnectionDetails = ({
  handleDecision,
  isLoading,
  hostname
}: {
  handleDecision: (decision: boolean) => void
  isLoading: boolean
  hostname: string
}) => {
  return (
    <div data-testid={locators.connectionModalApprove} className="px-5">
      <ModalHeader hostname={hostname} title="Connected to dApp" />
      <Frame>
        <p className="text-vega-dark-300 mb-3" data-testid={locators.connectionModalAccessListTitle}>
          Allow this site to:
        </p>
        <ul className="list-none">
          <li className="flex">
            <Tick className="w-3 mr-2 text-vega-green-550" />
            <p data-testid={locators.connectionModalAccessListAccess} className="text-light-200">
              See all of your wallet’s public keys
            </p>
          </li>
          <li className="flex">
            <Tick className="w-3 mr-2 text-vega-green-550" />
            <p data-testid={locators.connectionModalAccessListAccess} className="text-light-200">
              Send transaction requests for you to sign
            </p>
          </li>
        </ul>
      </Frame>
      <div className="grid grid-cols-[1fr_1fr] justify-between gap-4 mt-5">
        <Button
          data-testid={locators.connectionModalDenyButton}
          disabled={!!isLoading}
          onClick={() => handleDecision(false)}
        >
          Deny
        </Button>
        <Button
          data-testid={locators.connectionModalApproveButton}
          variant="primary"
          disabled={!!isLoading}
          onClick={() => handleDecision(true)}
        >
          Approve
        </Button>
      </div>
    </div>
  )
}
