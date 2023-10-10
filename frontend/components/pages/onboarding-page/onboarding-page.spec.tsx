import { render, screen, fireEvent } from '@testing-library/react'
import { OnboardingPage } from './onboarding-page'
import { MemoryRouter } from 'react-router-dom'
import { locators } from '../../header'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate
}))

describe('Page', () => {
  it('renders page header correctly', () => {
    render(
      <MemoryRouter>
        <OnboardingPage name="Test Page">
          <span>Page</span>
        </OnboardingPage>
      </MemoryRouter>
    )
    expect(screen.getByTestId(locators.header)).toBeInTheDocument()
    expect(screen.getByText('Test Page')).toBeInTheDocument()
  })

  it('renders back button correctly', () => {
    render(
      <OnboardingPage name="Test Page" backLocation="/test">
        <span>Page</span>
      </OnboardingPage>,
      {
        wrapper: ({ children }) => <MemoryRouter>{children}</MemoryRouter>
      }
    )
    fireEvent.click(screen.getByTestId('test-page-back'))
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/test')
  })

  it('renders children correctly', () => {
    render(
      <MemoryRouter>
        <OnboardingPage name="Test Page">
          <div data-testid="test-child" />
        </OnboardingPage>
      </MemoryRouter>
    )
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })
})
