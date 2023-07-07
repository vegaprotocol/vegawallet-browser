import { render, screen } from '@testing-library/react'
import App from './App'
import { ReactNode } from 'react'
import { usePreventWindowResize } from './hooks/prevent-window-resize'
import { usePing } from './hooks/ping'

jest.mock('./hooks/prevent-window-resize')
jest.mock('./hooks/ping')

jest.mock('./components/global-error-boundary', () => ({ children }: { children: ReactNode }) => (
  <div data-testid="global-error-boundary">{children}</div>
))
jest.mock('./stores/popover-store', () => ({
  usePopoverStore: (fn: any) => {
    return fn({
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
    Object.defineProperty(window, 'resizeTo', { value: jest.fn() })

    render(<App />)
    expect(screen.getByTestId('global-error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('routing')).toBeInTheDocument()
    expect(screen.getByTestId('json-rpc-provider')).toBeInTheDocument()
  })

  it('calls global level hooks', () => {
    render(<App />)
    expect(usePreventWindowResize).toHaveBeenCalled()
    expect(usePing).toHaveBeenCalled()
  })
})
