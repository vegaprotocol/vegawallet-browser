import { render, screen } from '@testing-library/react'
import { MarketLink, locators } from './market-link'
import config from '!/config'

describe('MarketLink', () => {
  it('renders truncated id and link', () => {
    // 1115-EXPL-002 When I can see the market id I can see a link to the Vega block explorer for the market
    const id = '1'.repeat(64)
    render(<MarketLink marketId={id} />)
    expect(screen.getByTestId(locators.marketLink)).toHaveTextContent('111111…1111')
    expect(screen.getByTestId(locators.marketLink)).toHaveAttribute('href', `${config.network.explorer}/markets/${id}`)
  })
  it('renders name if passed in', () => {
    render(<MarketLink marketId={'1'.repeat(64)} name="foo" />)
    expect(screen.getByTestId(locators.marketLink)).toHaveTextContent('foo')
  })
})
