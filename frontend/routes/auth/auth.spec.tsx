import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import locators from '../../components/locators'
import { useAssetsStore } from '../../stores/assets-store'
import { useMarketsStore } from '../../stores/markets-store'
import { useWalletStore } from '../../stores/wallets'
import { mockStore } from '../../test-helpers/mock-store'
import { FULL_ROUTES } from '../route-names'
import { Auth } from '.'

jest.mock('../../components/page-header', () => ({
  PageHeader: () => <div data-testid="page-header" />
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet" />
}))

jest.mock('../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ client: jest.fn() })
}))

jest.mock('../../stores/wallets')
jest.mock('../../stores/assets-store')
jest.mock('../../stores/markets-store')

jest.mock('../../components/modals', () => ({
  ModalWrapper: () => <div data-testid="modal-wrapper" />
}))

jest.mock('../../components/dapps-header/dapps-header', () => ({
  DappsHeader: () => <div data-testid="dapps-header" />
}))

const mockStores = () => {
  const loadWallets = jest.fn()
  const fetchAssets = jest.fn()
  const fetchMarkets = jest.fn()
  mockStore(useWalletStore, {
    loadWallets
  })
  mockStore(useAssetsStore, {
    fetchAssets
  })
  mockStore(useMarketsStore, {
    fetchMarkets
  })

  return {
    loadWallets,
    fetchAssets,
    fetchMarkets
  }
}

const renderComponent = (route: string = '') => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Auth />
    </MemoryRouter>
  )
}

describe('Auth', () => {
  it('renders outlet, header and navbar', () => {
    mockStores()
    renderComponent()

    expect(screen.getByTestId(locators.navBar)).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId('modal-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('page-header')).toBeInTheDocument()
  })
  it('loads the users wallets, assets and markets', () => {
    const { loadWallets, fetchAssets, fetchMarkets } = mockStores()
    renderComponent()

    expect(loadWallets).toHaveBeenCalledTimes(1)
    expect(fetchAssets).toHaveBeenCalledTimes(1)
    expect(fetchMarkets).toHaveBeenCalledTimes(1)
  })
  it('renders wallets header on wallets page', () => {
    mockStores()
    renderComponent(FULL_ROUTES.wallets)

    expect(screen.getByTestId('dapps-header')).toBeVisible()
  })
})
