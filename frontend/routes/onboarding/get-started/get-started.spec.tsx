import { fireEvent, render, screen } from '@testing-library/react'
import { GetStarted } from '.'
import componentLocators from '../../../components/locators'
import { getStartedButton } from '../../../locator-ids'
import { FULL_ROUTES } from '../../route-names'
import config from '!/config'
import { locators as disclaimerLocators } from './disclaimer'
import { locators as incentivesLocators } from './incentives'

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
    expect(button).toHaveFocus()
    fireEvent.click(button)
    expect(mockedUsedNavigate).toBeCalledWith(FULL_ROUTES.createPassword)
  })
  it('Renders disclaimer when showDisclaimer is true', async () => {
    // 1101-ONBD-037 If built for mainnet I can see a legal disclaimer with a button to read more
    // 1101-ONBD-038 If built for mainnet I can press read more to see the full disclaimer

    config.showDisclaimer = true
    render(<GetStarted />)
    expect(screen.getByTestId(disclaimerLocators.readMoreButton)).toBeInTheDocument()
    expect(screen.getByTestId(disclaimerLocators.previewText)).toBeInTheDocument()
    expect(screen.getByTestId(getStartedButton)).toHaveTextContent('I understand')
    fireEvent.click(screen.getByTestId(disclaimerLocators.readMoreButton))
    await screen.findByTestId(disclaimerLocators.disclaimerText)
    expect(screen.getByTestId(disclaimerLocators.disclaimerText)).toBeInTheDocument()
  })
  it('Renders incentive banner when showDisclaimer is false', () => {
    // 1101-ONBD-039 If not built for mainnet I can see a message related to testnet
    config.showDisclaimer = false
    render(<GetStarted />)
    expect(screen.getByTestId(getStartedButton)).toHaveTextContent('Get Started')
    expect(screen.getByTestId(incentivesLocators.paragraph)).toBeInTheDocument()
  })
})
