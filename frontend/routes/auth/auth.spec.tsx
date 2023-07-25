import { render, screen } from '@testing-library/react'
import { Auth } from '.'
import { MemoryRouter } from 'react-router-dom'
import locators from '../../components/locators'

import { useWalletStore } from '../../stores/wallets'
import { FULL_ROUTES } from '../route-names'

jest.mock('../../components/page-header', () => ({
  PageHeader: () => <div data-testid="page-header" />
}))

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  Outlet: () => <div data-testid="outlet" />
}))

jest.mock('../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ client: jest.fn() })
}))

jest.mock('../../stores/wallets', () => ({
  useWalletStore: jest.fn()
}))

jest.mock('../../components/connection-modal', () => ({
  ConnectionModal: () => <div data-testid="connection-modal" />
}))

jest.mock('../../components/transaction-modal', () => ({
  TransactionModal: () => <div data-testid="transaction-modal" />
}))

jest.mock('../../components/dapps-header/dapps-header', () => ({
  DappsHeader: () => <div data-testid="dapps-header" />
}))

const renderComponent = (route: string = '') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Auth />
    </MemoryRouter>
  )
}

describe('Auth', () => {
  it('renders outlet, header and navbar', () => {
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        loadWallets: jest.fn()
      })
    })
    renderComponent()

    expect(screen.getByTestId(locators.navBar)).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId('connection-modal')).toBeInTheDocument()
    expect(screen.getByTestId('transaction-modal')).toBeInTheDocument()
    expect(screen.getByTestId('page-header')).toBeInTheDocument()
  })
  it('loads the users wallets', () => {
    const mockLoad = jest.fn()
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        loadWallets: mockLoad
      })
    })
    renderComponent()

    expect(mockLoad).toBeCalledTimes(1)
  })
  it('renders wallets header on wallets page', () => {
    const mockLoad = jest.fn()
    ;(useWalletStore as unknown as jest.Mock).mockImplementation((fn) => {
      return fn({
        loadWallets: mockLoad
      })
    })
    renderComponent(FULL_ROUTES.wallets)

    expect(screen.getByTestId('dapps-header')).toBeVisible()
  })
})
