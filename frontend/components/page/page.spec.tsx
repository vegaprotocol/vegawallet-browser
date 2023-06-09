import { render, screen, fireEvent } from '@testing-library/react'
import { Page } from './page'
import { MemoryRouter } from 'react-router-dom'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

describe('Page', () => {
  it('renders page header correctly', () => {
    render(
      <MemoryRouter>
        <Page name="Test Page">
          <span>Page</span>
        </Page>
      </MemoryRouter>
    )
    expect(screen.getByTestId('test-page-header')).toBeInTheDocument()
    expect(screen.getByText('Test Page')).toBeInTheDocument()
  })

  it('renders back button correctly', () => {
    render(
      <Page name="Test Page" backLocation="/test">
        <span>Page</span>
      </Page>,
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
        <Page name="Test Page">
          <div data-testid="test-child" />
        </Page>
      </MemoryRouter>
    )
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
  })
})
