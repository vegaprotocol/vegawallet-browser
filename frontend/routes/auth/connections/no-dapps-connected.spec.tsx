import { render, screen } from '@testing-library/react'
import { NoAppsConnected, locators } from './no-dapps-connected'

describe('NoDappsConnected', () => {
  it('renders message', () => {
    render(<NoAppsConnected />)
    expect(screen.getByTestId(locators.connectionsNoConnections)).toHaveTextContent(
      'Your wallet is not connected to any dapps.'
    )
  })
})
