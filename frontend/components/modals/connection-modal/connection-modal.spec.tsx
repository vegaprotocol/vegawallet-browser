import { fireEvent, render, screen } from '@testing-library/react'

import { useInteractionStore } from '@/stores/interaction-store'
import { mockStore } from '@/test-helpers/mock-store'
import locators from '../../locators'
import { ConnectionModal } from './connection-modal'
import { ConnectionSuccessProperties } from './connection-success'

jest.mock('@/stores/interaction-store')

jest.mock('./connection-success', () => ({
  ConnectionSuccess: ({ onClose }: ConnectionSuccessProperties) => (
    <button onClick={onClose} data-testid="connection-success" />
  )
}))

describe('ConnectionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders nothing when isOpen is false', () => {
    mockStore(useInteractionStore, { connectionModalOpen: false })
    const { container } = render(<ConnectionModal />)
    expect(container).toBeEmptyDOMElement()
  })
  it('renders connection details when open but not yet connected', () => {
    mockStore(useInteractionStore, { connectionModalOpen: true, currentConnectionDetails: {} })
    render(<ConnectionModal />)
    expect(screen.getByTestId(locators.connectionModalApprove)).toBeInTheDocument()
  })
  it('renders connection success when hasConnected is true', () => {
    mockStore(useInteractionStore, {
      connectionModalOpen: true,
      handleConnectionDecision: jest.fn(),
      currentConnectionDetails: {}
    })
    render(<ConnectionModal />)
    fireEvent.click(screen.getByTestId(locators.connectionModalApproveButton))
    expect(screen.getByTestId('connection-success')).toBeInTheDocument()
  })
  it('renders nothing if connection is not approved', () => {
    mockStore(useInteractionStore, {
      connectionModalOpen: true,
      handleConnectionDecision: jest.fn(),
      currentConnectionDetails: {}
    })
    render(<ConnectionModal />)
    fireEvent.click(screen.getByTestId(locators.connectionModalDenyButton))
    expect(screen.queryByTestId('connection-success')).not.toBeInTheDocument()
  })
  it('handle the interaction decision when connection is approve after showing success state', () => {
    const handleConnectionDecision = jest.fn()
    mockStore(useInteractionStore, {
      connectionModalOpen: true,
      handleConnectionDecision,
      currentConnectionDetails: {}
    })
    render(<ConnectionModal />)
    fireEvent.click(screen.getByTestId(locators.connectionModalApproveButton))
    fireEvent.click(screen.getByTestId('connection-success'))
    expect(handleConnectionDecision).toHaveBeenCalledWith(true)
  })
})
