import { fireEvent, render, screen } from '@testing-library/react'
import { KeySelector, locators } from './key-selector'
import { MemoryRouter } from 'react-router-dom'

const ID = '1'.repeat(64)

const MOCK_KEY = {
  publicKey: ID,
  name: 'test',
  index: 0,
  metadata: []
}

jest.mock('../../../../components/key-list', () => ({
  KeyList: () => <div data-testid="key-list" />
}))

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
  it('renders the currently selected key and opens key list', async () => {
    // 1125-KEYD-006 When switching, I can see key name, key icon and key address (truncated)
    renderComponent()
    expect(screen.getByTestId(locators.keySelectedCurrentKey(MOCK_KEY.name))).toHaveTextContent('test')
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await screen.findByTestId(locators.keySelectedDropdown)
    expect(screen.getByTestId('key-list')).toBeInTheDocument()
  })
})
