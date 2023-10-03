import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { KeySelector, locators } from './key-selector'
import { MemoryRouter } from 'react-router-dom'
import { KeyListProps } from '../../../../components/key-list'

const ID = '1'.repeat(64)

const MOCK_KEY = {
  publicKey: ID,
  name: 'test',
  index: 0,
  metadata: []
}

jest.mock('../../../../components/key-list', () => ({
  KeyList: ({ onClick }: KeyListProps) => <button onClick={onClick} data-testid="key-list" />
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
    <>
      <MemoryRouter>
        <KeySelector currentKey={MOCK_KEY} />
      </MemoryRouter>
      <div data-testid="outside-element" />
    </>
  )
}

describe('KeySelector', () => {
  it('renders the currently selected key, opens key list and closes after a key is clicked', async () => {
    // 1125-KEYD-006 When switching, I can see key name, key icon and key address (truncated)
    renderComponent()
    expect(screen.getByTestId(locators.keySelectedCurrentKey(MOCK_KEY.name))).toHaveTextContent('test')
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await screen.findByTestId(locators.keySelectedDropdown)
    const keyList = screen.getByTestId('key-list')
    expect(keyList).toBeInTheDocument()
    fireEvent.click(keyList)
    await waitFor(() => expect(screen.queryByTestId('key-list')).not.toBeInTheDocument())
  })

  it('closes modal when clicking trigger', async () => {
    renderComponent()
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await screen.findByTestId(locators.keySelectedDropdown)
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await waitFor(() => expect(screen.queryByTestId('key-list')).not.toBeInTheDocument())
  })

  it('closes dropdown when clicking outside', async () => {
    const { container } = renderComponent()
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await screen.findByTestId(locators.keySelectedDropdown)
    fireEvent.pointerDown(
      container,
      new PointerEvent('pointerdown', {
        ctrlKey: false,
        button: 0
      })
    )
    await waitFor(() => expect(screen.queryByTestId('key-list')).not.toBeInTheDocument())
  })

  it('closes dropdown when escape key is pressed', async () => {
    const { container } = renderComponent()
    fireEvent.click(screen.getByTestId(locators.keySelectorTrigger))
    await screen.findByTestId(locators.keySelectedDropdown)
    fireEvent.keyDown(container, {
      key: 'Escape',
      code: 'Escape',
      keyCode: 27,
      charCode: 27
    })
    await waitFor(() => expect(screen.queryByTestId('key-list')).not.toBeInTheDocument())
  })
})
