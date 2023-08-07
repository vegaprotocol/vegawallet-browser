import { render, screen } from '@testing-library/react'
import { Incentives, locators } from './incentives'

describe('Incentives', () => {
  test('renders the paragraph with correct data-testid attribute', () => {
    render(<Incentives />)
    const textContent =
      'This is an experimental release for testing purposes only and supports trading in testnet assets with no financial risk. Download to get involved in testing on Vega and participate in Fairground incentives to earn rewards!'

    const paragraph = screen.getByTestId(locators.paragraph)
    expect(paragraph).toHaveTextContent(textContent)
  })

  test('renders the link with correct data-testid attribute', () => {
    render(<Incentives />)
    const link = screen.getByTestId(locators.link)
    expect(link).toBeInTheDocument()
  })
})
