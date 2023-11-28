import { render, screen } from '@testing-library/react'
import { ReactNode } from 'react'

import App, { locators } from './app'
import { usePing } from './hooks/ping'
import { usePreventWindowResize } from './hooks/prevent-window-resize'
import { useGlobalsStore } from './stores/globals'
import { mockStore } from './test-helpers/mock-store'

jest.mock('./stores/globals')
jest.mock('./hooks/prevent-window-resize')
jest.mock('./hooks/ping')

jest.mock('./components/global-error-boundary', () => ({ children }: { children: ReactNode }) => (
  <div data-testid="global-error-boundary">{children}</div>
))
jest.mock('./stores/popover-store', () => ({
  usePopoverStore: (function_: any) => {
    return function_({
      setup: jest.fn(),
      teardown: jest.fn()
    })
  }
}))

jest.mock('./components/global-error-boundary', () => ({ children }: { children: ReactNode }) => (
  <div data-testid="global-error-boundary">{children}</div>
))

jest.mock('./contexts/json-rpc/json-rpc-provider', () => ({
  JsonRPCProvider: ({ children }: { children: ReactNode }) => <div data-testid="json-rpc-provider">{children}</div>
}))

jest.mock('./routes', () => ({
  Routing: ({ children }: { children: ReactNode }) => <div data-testid="routing">{children}</div>
}))

describe('App', () => {
  it('renders routing, error boundary and jsonrpcprovider', () => {
    mockStore(useGlobalsStore, {
      isMobile: false
    })
    Object.defineProperty(window, 'resizeTo', { value: jest.fn() })

    render(<App />)
    expect(screen.getByTestId('global-error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('routing')).toBeInTheDocument()
    expect(screen.getByTestId('json-rpc-provider')).toBeInTheDocument()
    expect(screen.getByTestId(locators.appWrapper)).toHaveStyle('min-height: 600px')
  })

  it('calls global level hooks', () => {
    mockStore(useGlobalsStore, {
      isMobile: false
    })
    render(<App />)
    expect(usePreventWindowResize).toHaveBeenCalled()
    expect(usePing).toHaveBeenCalled()
  })

  it('does not add min width if the device is mobile', () => {
    mockStore(useGlobalsStore, {
      isMobile: true
    })
    render(<App />)
    expect(screen.getByTestId(locators.appWrapper)).not.toHaveStyle('min-height: 600px')
  })
})
