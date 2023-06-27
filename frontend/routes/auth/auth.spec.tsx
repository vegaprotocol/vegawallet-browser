import { render, screen } from '@testing-library/react'
import { Auth } from '.'
import { MemoryRouter } from 'react-router-dom'
import locators from '../../components/locators'
import { JsonRPCProvider } from '../../contexts/json-rpc/json-rpc-provider'
import { mockClient } from '../../test-helpers/mock-client'

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  Outlet: () => <div data-testid="outlet" />
}))

jest.mock('../../components/connection-modal', () => ({
  ConnectionModal: () => <div data-testid="connection-modal" />
}))

jest.mock('../../components/transaction-modal', () => ({
  TransactionModal: () => <div data-testid="transaction-modal" />
}))

describe('Auth', () => {
  it('renders outlet, header and navbar', () => {
    mockClient()
    render(
      <JsonRPCProvider>
        <MemoryRouter>
          <Auth />
        </MemoryRouter>
      </JsonRPCProvider>
    )
    expect(screen.getByTestId(locators.navBar)).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId('connection-modal')).toBeInTheDocument()
    expect(screen.getByTestId('transaction-modal')).toBeInTheDocument()
  })
  it('loads the users wallets', () => {
    expect(false).toBe(true)
  })
})
