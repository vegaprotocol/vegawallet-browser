import { render, screen } from '@testing-library/react'
import { ConnectionDetails } from './connection-details'
import locators from '../locators'

describe('ConnectionDetails', () => {
  it('should render header, hostname, keys and permissions', () => {
    render(<ConnectionDetails handleDecision={() => {}} hostname="https://www.google.com" />)
    expect(screen.getByTestId(locators.modalHeaderTitle)).toHaveTextContent('Connected to dApp')
    expect(screen.getByTestId(locators.dAppHostname)).toHaveTextContent('https://www.google.com')
    expect(screen.getByTestId(locators.connectionModalAccessListTitle)).toHaveTextContent('Allow this site to:')
    const permissions = screen.getAllByTestId(locators.connectionModalAccessListAccess)
    expect(permissions).toHaveLength(2)
    expect(permissions[0]).toHaveTextContent('See all of your wallet’s public keys')
    expect(permissions[1]).toHaveTextContent('Send transaction requests for you to sign')
  })
  it('calls handleDecision handler with true when approve button is clicked', () => {
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
