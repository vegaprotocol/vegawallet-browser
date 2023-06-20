import { render, screen } from '@testing-library/react'
import { ConnectionDetails } from './connection-details'
import locators from '../locators'

describe('ConnectionDetails', () => {
  it('should render header, hostname, keys and permissions', () => {
    // 1101-BWAL-038 I can see a visual representation of the dapp requesting access e.g. the favicon
    // 1101-BWAL-039 I can see what approving a connection request enables the site / dapp to do
    // 1101-BWAL-040 I can see the URL of the site / dapp requesting access
    // 1101-BWAL-042 There is a way to understand that i.e. this connection request gives access to ALL my keys now and in the future
    render(<ConnectionDetails handleDecision={() => {}} hostname="https://www.google.com" />)
    expect(screen.getByTestId(locators.modalHeaderTitle)).toHaveTextContent('Connected to dApp')
    expect(screen.getByTestId(locators.dAppHostname)).toHaveTextContent('https://www.google.com')
    expect(screen.getByTestId(locators.hostImage)).toBeVisible()
    expect(screen.getByTestId(locators.connectionModalAccessListTitle)).toHaveTextContent('Allow this site to:')
    const permissions = screen.getAllByTestId(locators.connectionModalAccessListAccess)
    expect(permissions).toHaveLength(2)
    expect(permissions[0]).toHaveTextContent('See all of your wallet’s public keys') // Note for dex - should we add that this is future keys too?
    expect(permissions[1]).toHaveTextContent('Send transaction requests for you to sign')
  })
  it('calls handleDecision handler with true when approve button is clicked', () => {
    // 1101-BWAL-037 There is a way to approve or deny a connection request
    const handleDecision = jest.fn()
    render(<ConnectionDetails handleDecision={handleDecision} hostname="https://www.google.com" />)
    screen.getByTestId(locators.connectionModalApproveButton).click()
    expect(handleDecision).toHaveBeenCalledWith(true)
  })
  it('calls handleDecision handler with false when deny button is clicked', () => {
    const handleDecision = jest.fn()
    render(<ConnectionDetails handleDecision={handleDecision} hostname="https://www.google.com" />)
    screen.getByTestId(locators.connectionModalDenyButton).click()
    expect(handleDecision).toHaveBeenCalledWith(false)
  })
})
