import { render, screen } from '@testing-library/react'
import { VegaHeader } from '.'
import locators from '../locators'

describe('VegaHeader', () => {
  it('renders vega icon, vega logo and wallets text', () => {
    render(<VegaHeader />)
    expect(screen.getByTestId(locators.vegaIcon)).toBeInTheDocument()
    expect(screen.getByTestId(locators.vega)).toBeInTheDocument()
    expect(screen.getByText('wallet')).toBeInTheDocument()
  })
})
