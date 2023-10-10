import { render, screen } from '@testing-library/react'
import { KeyDetailsPage, locators } from './key-details-page'
import { useAssetsStore } from '../../../../stores/assets-store'
import { silenceErrors } from '../../../../test-helpers/silence-errors'
import { useWalletStore } from '../../../../stores/wallets'
import { MemoryRouter } from 'react-router-dom'
import { locators as subHeaderLocators } from '../../../../components/sub-header'
import { FULL_ROUTES } from '../../../route-names'
import { mockStore } from '../../../../test-helpers/mock-store'
import { locators as headerLocators } from '../../../../components/header'

jest.mock('./export-private-key-dialog', () => ({
  ExportPrivateKeysDialog: () => <div data-testid="export-private-key-dialog" />
}))

jest.mock('./key-selector', () => ({
  KeySelector: () => <div data-testid="key-selector" />
}))

jest.mock('../../../../components/keys/vega-key', () => ({
  VegaKey: () => <div data-testid="vega-key" />
}))

jest.mock('./assets-list', () => ({
  AssetsList: () => <div data-testid="assets-list" />
}))

jest.mock('../../../../stores/assets-store')
jest.mock('../../../../stores/wallets')

const ID = '1'.repeat(64)

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <KeyDetailsPage id={ID} />
    </MemoryRouter>
  )
}

describe('KeyDetailsPage', () => {
  it('throws error if the key cannot be found', () => {
    silenceErrors()
    mockStore(useWalletStore, {
      loading: false,
      getKeyById: () => undefined
    })
    mockStore(useAssetsStore, {
      loading: false
    })
    expect(() => render(<KeyDetailsPage id={ID} />)).toThrowError(`Key with id ${ID} not found`)
  })

  it('renders nothing while loading assets', () => {
    mockStore(useWalletStore, {
      loading: false,
      getKeyById: () => ({
        publicKey: ID,
        name: 'test'
      })
    })
    mockStore(useAssetsStore, {
      loading: true
    })
    const { container } = render(<KeyDetailsPage id={ID} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing while loading wallets', () => {
    mockStore(useWalletStore, {
      loading: true,
      getKeyById: () => ({
        publicKey: ID,
        name: 'test'
      })
    })
    mockStore(useAssetsStore, {
      loading: false
    })
    const { container } = render(<KeyDetailsPage id={ID} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the back button, key selector, vega key indicator, title, description and export button', () => {
    // 1125-KEYD-002 There is a warning to remember that if I hold an open position the balance / totals may not be accurate as is constantly changing
    // 1125-KEYD-005 There is a way to switch between keys (or to easily navigate back to the keys page to achieve this)
    // 1125-KEYD-007 In the key details screen I can see my currently selected key and associated info
    // 1125-KEYD-008 There is a way to export a private key
    mockStore(useWalletStore, {
      loading: false,
      getKeyById: () => ({
        publicKey: ID,
        name: 'test'
      })
    })
    mockStore(useAssetsStore, {
      loading: false
    })
    renderComponent()
    expect(screen.getByTestId('key-selector')).toBeInTheDocument()
    expect(screen.getByTestId('vega-key')).toBeInTheDocument()
    expect(screen.getByTestId('export-private-key-dialog')).toBeInTheDocument()
    expect(screen.getByTestId(locators.keyDetailsBack)).toHaveAttribute('href', FULL_ROUTES.wallets)
  })

  it('clicking back navigates to the previous page', () => {
    expect(false).toBeTruthy()
  })

  it('renders asset assets list', () => {
    mockStore(useWalletStore, {
      loading: false,
      getKeyById: () => ({
        publicKey: ID,
        name: 'test'
      })
    })
    mockStore(useAssetsStore, {
      loading: false
    })
    renderComponent()
    expect(screen.getByTestId('key-selector')).toBeInTheDocument()
    expect(screen.getByTestId('vega-key')).toBeInTheDocument()
    expect(screen.getByTestId('assets-list')).toBeInTheDocument()
  })
})
