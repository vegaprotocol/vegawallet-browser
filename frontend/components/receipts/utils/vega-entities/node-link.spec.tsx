import { render, screen } from '@testing-library/react'

import config from '!/config'

import { locators, NodeLink } from './node-link'

describe('ProposalLink', () => {
  it('renders truncated id and link', () => {
    const id = '1'.repeat(64)
    render(<NodeLink nodeId={id} />)
    expect(screen.getByTestId(locators.proposalLink)).toHaveTextContent('111111…1111')
    expect(screen.getByTestId(locators.proposalLink)).toHaveAttribute(
      'href',
      `${config.network.governance}/validators/${id}`
    )
  })
  it('renders name if passed in', () => {
    render(<NodeLink nodeId={'1'.repeat(64)} name="foo" />)
    expect(screen.getByTestId(locators.proposalLink)).toHaveTextContent('foo')
  })
})
