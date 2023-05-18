import { fireEvent, render, screen } from '@testing-library/react'
import { GetStarted } from '.'
import componentLocators from '../../../components/locators'
import { getStartedButton } from '../../../locator-ids'
import { FULL_ROUTES } from '../../route-names'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

describe('GetStarted', () => {
  it('renders title', () => {
    render(<GetStarted />)
    expect(screen.getByTestId(componentLocators.vegaIcon)).toBeInTheDocument()
    expect(screen.getByTestId(componentLocators.vega)).toBeInTheDocument()
    expect(screen.getByText('wallet')).toBeInTheDocument()
  })
  it('renders list of reasons to use vega wallet & get started button', () => {
    render(<GetStarted />)
    expect(screen.getByText('Securely connect to Vega dapps')).toBeInTheDocument()
    expect(screen.getByText('Instantly approve and reject transactions')).toBeInTheDocument()
    expect(screen.getByTestId(getStartedButton)).toHaveTextContent('Get Started')
  })
  it('Redirects to the create password route when button is clicked', () => {
    render(<GetStarted />)
    const button = screen.getByTestId(getStartedButton)
    fireEvent.click(button)
    expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.createPassword)
  })
})
