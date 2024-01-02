import { render, screen } from '@testing-library/react'

import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

import { Incentives, locators } from './incentives'

const renderComponent = () =>
  render(
    <MockNetworkProvider>
      <Incentives />
    </MockNetworkProvider>
  )

describe('Incentives', () => {
  it('renders the paragraph with correct data-testid attribute', () => {
    renderComponent()
    const textContent =
      'This is an experimental release for testing purposes only and supports trading in testnet assets with no financial risk. Download to get involved in testing on Vega and participate in Fairground incentives to earn rewards!'

    const paragraph = screen.getByTestId(locators.paragraph)
    expect(paragraph).toHaveTextContent(textContent)
  })

  it('renders the link with correct data-testid attribute', () => {
    renderComponent()
    const link = screen.getByTestId(locators.link)
    expect(link).toBeInTheDocument()
  })
})
