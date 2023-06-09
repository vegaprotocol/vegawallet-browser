import { render, screen } from '@testing-library/react'
import { StarsWrapper } from '.'
import locators from '../locators'

describe('StarsWrapper', () => {
  it('renders vega icon, vega logo and wallets text', () => {
    render(<StarsWrapper>Content</StarsWrapper>)
    expect(screen.getByTestId(locators.vegaIcon)).toBeInTheDocument()
    expect(screen.getByTestId(locators.vega)).toBeInTheDocument()
    expect(screen.getByText('wallet')).toBeInTheDocument()
  })
  it('renders content', () => {
    render(<StarsWrapper>Content</StarsWrapper>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
})
