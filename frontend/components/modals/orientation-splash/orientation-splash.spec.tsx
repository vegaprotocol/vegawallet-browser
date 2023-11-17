import { render, screen, waitFor, act } from '@testing-library/react'
import { OrientationSplash, locators } from '.'

describe('OrientationSplash', () => {
  test('renders null when in portrait mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
    render(<OrientationSplash />)
    expect(screen.queryByTestId(locators.orientationSplash)).toBeNull()
  })

  test('renders splash when in landscape mode', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
    render(<OrientationSplash />)
    expect(screen.getByTestId(locators.orientationSplash)).toBeInTheDocument()
  })

  test('sets mode to portrait on event handler being called', async () => {
    let handler: null | ((e: MediaQueryListEvent) => void) = null
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: jest.fn((evName: string, fn: (e: MediaQueryListEvent) => void) => {
          handler = fn
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
    render(<OrientationSplash />)
    // @ts-ignore
    act(() => handler?.({ matches: false }))
    await screen.findByTestId(locators.orientationSplash)
    expect(screen.getByTestId(locators.orientationSplash)).toBeInTheDocument()
  })

  test('sets mode to landscape on event handler being called', async () => {
    let handler: null | ((e: MediaQueryListEvent) => void) = null
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn((evName: string, fn: (e: MediaQueryListEvent) => void) => {
          handler = fn
        }),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn()
      }))
    })
    render(<OrientationSplash />)
    expect(screen.getByTestId(locators.orientationSplash)).toBeInTheDocument()
    // @ts-ignore
    act(() => handler?.({ matches: true }))
    await waitFor(() => expect(screen.queryByTestId(locators.orientationSplash)).not.toBeInTheDocument())
  })
})
