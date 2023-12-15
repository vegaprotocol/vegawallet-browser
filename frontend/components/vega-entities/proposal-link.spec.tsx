import { render, screen } from '@testing-library/react'

import config from '!/config'

import { locators, ProposalLink } from './proposal-link'

describe('ProposalLink', () => {
  it('renders truncated id and link', () => {
    // 1115-EXPL-002 When I can see the market id I can see a link to the Vega block explorer for the market
    const id = '1'.repeat(64)
    render(<ProposalLink proposalId={id} />)
    expect(screen.getByTestId(locators.proposalLink)).toHaveTextContent('111111…1111')
    expect(screen.getByTestId(locators.proposalLink)).toHaveAttribute(
      'href',
      `${config.network.governance}/proposals/${id}`
    )
  })
  it('renders name if passed in', () => {
    render(<ProposalLink proposalId={'1'.repeat(64)} name="foo" />)
    expect(screen.getByTestId(locators.proposalLink)).toHaveTextContent('foo')
  })
})
