import { render, screen } from '@testing-library/react'
import { Auth } from '.'
import { MemoryRouter } from 'react-router-dom'
import locators from '../../components/locators'
import { networkIndicator } from '../../locator-ids'

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  Outlet: () => <div data-testid="outlet" />
}))

describe('Auth', () => {
  it('renders outlet and navbar', () => {
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    )
    expect(screen.getByTestId(locators.navBar)).toBeInTheDocument()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
    expect(screen.getByTestId(locators.vegaIcon)).toBeInTheDocument()
    expect(screen.getByTestId(networkIndicator)).toHaveTextContent('Fairground')
  })
})
