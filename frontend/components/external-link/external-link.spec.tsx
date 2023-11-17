import { render, screen, fireEvent } from '@testing-library/react'
import { ExternalLink } from './external-link'
import { mockStore } from '../../test-helpers/mock-store'
import { useGlobalsStore } from '../../stores/globals'

jest.mock('../../stores/globals')

describe('ExternalLink component', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  test('renders ExternalLink component correctly', () => {
    render(<ExternalLink href="https://example.com">Example Link</ExternalLink>)

    expect(screen.getByTestId('external-link')).toHaveTextContent('Example Link')
    expect(screen.getByTestId('external-link')).toHaveAttribute('href', 'https://example.com')
  })

  test('opens link in new tab when clicked', () => {
    mockStore(useGlobalsStore, { isMobile: true })
    // @ts-ignore
    window.chrome = { tabs: { create: jest.fn() } }
    render(<ExternalLink href="https://example.com">Example Link</ExternalLink>)

    const link = screen.getByText('Example Link')

    fireEvent.click(link)

    expect(window.chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://example.com' })
  })

  test('renders MobileLink component when isMobile is true', () => {
    mockStore(useGlobalsStore, { isMobile: true })

    render(<ExternalLink href="https://example.com">Example Link</ExternalLink>)
    expect(screen.getByTestId('link')).toBeInTheDocument()
  })

  test('renders ExLink component when isMobile is false', () => {
    mockStore(useGlobalsStore, { isMobile: false })

    render(<ExternalLink href="https://example.com">Example Link</ExternalLink>)

    expect(screen.getByTestId('external-link')).toBeInTheDocument()
  })
})
