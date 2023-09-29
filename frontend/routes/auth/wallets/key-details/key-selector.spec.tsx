import { fireEvent, render, screen } from '@testing-library/react'
import { KeySelector, locators } from './key-selector'
import { MemoryRouter } from 'react-router-dom'
import { FULL_ROUTES } from '../../../route-names'

const ID = '1'.repeat(64)

const MOCK_KEY = {
  publicKey: ID,
  name: 'test',
  index: 0,
  metadata: []
}

jest.mock('../../../../components/keys/vega-key', () => ({
  VegaKey: () => <div data-testid="vega-key" />
}))

jest.mock('../../../../stores/wallets', () => ({
  useWalletStore: jest.fn().mockImplementation((fn) =>
    fn({
      wallets: [
        {
          keys: [
            {
              publicKey: '1'.repeat(64),
              name: 'test',
              index: 0,
              metadata: []
            },
            {
              publicKey: '2'.repeat(64),
              name: 'test2',
              index: 1,
              metadata: []
            },
            {
              publicKey: '3'.repeat(64),
              name: 'test3',
              index: 2,
              metadata: []
            }
          ]
        }
      ]
    })
  )
}))

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <KeySelector currentKey={MOCK_KEY} />
    </MemoryRouter>
  )
}

describe('KeySelector', () => {
  it('renders the currently selected key', () => {
    renderComponent()
    expect(screen.getByTestId(locators.keySelectedCurrentKey)).toHaveTextContent('test')
  })

  it('renders keys in dropdown menu', async () => {
    // 1125-KEYD-006 When switching, I can see key name, key icon and key address (truncated)
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await screen.findByTestId(locators.keySelectedDropdown)
    expect(screen.getAllByTestId('vega-key')).toHaveLength(3)
    const [key1, key2, key3] = screen.getAllByTestId(locators.keySelectorLink)
    expect(key1).toHaveAttribute('href', `${FULL_ROUTES.wallets}/${'1'.repeat(64)}`)
    expect(key2).toHaveAttribute('href', `${FULL_ROUTES.wallets}/${'2'.repeat(64)}`)
    expect(key3).toHaveAttribute('href', `${FULL_ROUTES.wallets}/${'3'.repeat(64)}`)
  })
})
