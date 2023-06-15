import { render, screen } from '@testing-library/react'
import { NoAppsConnected } from './no-dapps-connected'
import { connectionsNoConnections } from '../../../locator-ids'

describe('NoDappsConnected', () => {
  it('renders message', () => {
    render(<NoAppsConnected />)
    expect(screen.getByTestId(connectionsNoConnections)).toHaveTextContent('Your wallet is not connected to any dapps.')
  })
})
