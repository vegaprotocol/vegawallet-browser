import { render, screen } from '@testing-library/react'

import { locators as partyLinkLocators } from '@/components/vega-entities/party-link'
import { MockNetworkProvider } from '@/contexts/network/mock-network-provider'

import { locators, Transactions } from './transactions'

const renderComponent = () => {
  render(
    <MockNetworkProvider>
      <Transactions />
    </MockNetworkProvider>
  )
}

describe('Transactions', () => {
  it('renders title, description and links to the parties', () => {
    renderComponent()
    expect(screen.getByTestId(locators.transactions)).toBeVisible()
    expect(screen.getByTestId(locators.transactionsDescription)).toHaveTextContent(
      'You can view all of your transactions since the last network reset on the block explorer.'
    )
    expect(screen.getAllByTestId(partyLinkLocators.partyLink)).toHaveLength(2)
  })
})
