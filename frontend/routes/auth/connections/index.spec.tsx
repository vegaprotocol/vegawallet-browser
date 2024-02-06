import { render, screen } from '@testing-library/react'

import { useConnectionStore } from '@/stores/connections'
import { mockStore } from '@/test-helpers/mock-store'

import { ConnectionsIndex } from '.'

jest.mock('@/stores/connections')
jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request: jest.fn() })
}))
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Outlet: () => <div data-testid="outlet" />
}))

describe('ConnectionsIndex', () => {
  it('should load connections and render the outlet', () => {
    const loadConnections = jest.fn()
    mockStore(useConnectionStore, { loading: false, loadConnections })
    render(<ConnectionsIndex />)
    expect(loadConnections).toHaveBeenCalled()
    expect(screen.getByTestId('outlet')).toBeInTheDocument()
  })
})
