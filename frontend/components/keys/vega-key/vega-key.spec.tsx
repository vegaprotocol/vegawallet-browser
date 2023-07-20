import { render, screen } from '@testing-library/react'
import { VegaKey, locators } from '.'
import config from '@/config'

const mockPublicKey = '07248acbd899061ba9c5f3ab47791df2045c8e249f1805a04c2a943160533673'
const mockName = 'My Vega Key'

jest.mock('../vega-icon', () => ({
  KeyIcon: () => <div data-testid="key-icon" />
}))

jest.mock('../../copy-with-check', () => ({
  CopyWithCheckmark: () => <div data-testid="copy-with-checkmark" />
}))

describe('VegaKey component', () => {
  test('renders the name and truncated publicKey with explorer link', () => {
    render(<VegaKey publicKey={mockPublicKey} name={mockName} />)

    const nameElement = screen.getByTestId(locators.keyName)
    const explorerLinkElement = screen.getByTestId(locators.explorerLink)

    expect(nameElement).toHaveTextContent(mockName)
    expect(explorerLinkElement.textContent).toBe('07248a…3673')
    expect(explorerLinkElement.getAttribute('href')).toBe(`${config.network.explorer}/parties/${mockPublicKey}`)
  })

  test('renders the KeyIcon & CopyWithCheckmark components', () => {
    render(<VegaKey publicKey={mockPublicKey} name={mockName} />)

    expect(screen.getByTestId('key-icon')).toBeInTheDocument()

    expect(screen.getByTestId('copy-with-checkmark')).toBeInTheDocument()
  })
})
