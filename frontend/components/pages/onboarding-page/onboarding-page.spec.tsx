import { render, screen } from '@testing-library/react'
import { OnboardingPage } from './onboarding-page'
import { MemoryRouter } from 'react-router-dom'
import { locators as headerLocators } from '../../header'
import { locators } from '../page'

describe('Page', () => {
  it('renders page header correctly', () => {
    render(
      <MemoryRouter>
        <OnboardingPage name="Test Page">
          <span>Page</span>
        </OnboardingPage>
      </MemoryRouter>
    )
    expect(screen.getByTestId(headerLocators.header)).toBeInTheDocument()
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
    expect(screen.getByTestId(locators.basePageBack)).toHaveAttribute('href', '/test')
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
