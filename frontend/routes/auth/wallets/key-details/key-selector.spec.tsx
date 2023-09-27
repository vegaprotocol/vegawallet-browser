import { render, screen } from '@testing-library/react'
import { KeySelector, locators } from './key-selector'

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
              publicKey: '2'.repeat(24),
              name: 'test2',
              index: 1,
              metadata: []
            },
            {
              publicKey: '3'.repeat(24),
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

describe('KeySelector', () => {
  it('renders the currently selected key', () => {
    render(<KeySelector currentKey={MOCK_KEY} />)
    expect(screen.getByTestId(locators.keySelectedCurrentKey)).toHaveTextContent('test')
  })
})
