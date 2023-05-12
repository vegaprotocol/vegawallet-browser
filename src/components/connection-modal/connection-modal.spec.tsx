import { fireEvent, render, screen } from '@testing-library/react'
import { ConnectionModal } from './connection-modal'
import { useModalStore } from '../../lib/modal-store'
import locators from '../locators'
import { ConnectionSuccessProps } from './connection-success'

jest.mock('../../lib/modal-store', () => ({
  useModalStore: jest.fn()
}))

jest.mock('./connection-success', () => ({
  ConnectionSuccess: ({ onClose }: ConnectionSuccessProps) => (
    <button onClick={onClose} data-testid="connection-success" />
  )
}))

describe('ConnectionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders nothing when isOpen is false', () => {
    ;(useModalStore as unknown as jest.Mock).mockImplementationOnce((fn) => {
      const res = { isOpen: false }
      fn(res)
      return res
    })
    const { container } = render(<ConnectionModal />)
    expect(container).toBeEmptyDOMElement()
  })
  it('renders connection details when open but not yet connected', () => {
    ;(useModalStore as unknown as jest.Mock).mockImplementationOnce((fn) => {
      const res = { isOpen: true }
      fn(res)
      return res
    })
    render(<ConnectionModal />)
    expect(screen.getByTestId(locators.connectionModalApprove)).toBeInTheDocument()
  })
  it('renders connection success when hasConnected is true', () => {
    ;(useModalStore as unknown as jest.Mock).mockImplementation((fn) => {
      const res = { isOpen: true, setIsOpen: jest.fn() }
      fn(res)
      return res
    })
    render(<ConnectionModal />)
    fireEvent.click(screen.getByTestId(locators.connectionModalApproveButton))
    expect(screen.getByTestId('connection-success')).toBeInTheDocument()
  })
  it('renders nothing if connection is not approved', () => {
    ;(useModalStore as unknown as jest.Mock).mockImplementation((fn) => {
      const res = { isOpen: true, setIsOpen: jest.fn() }
      fn(res)
      return res
    })
    render(<ConnectionModal />)
    fireEvent.click(screen.getByTestId(locators.connectionModalDenyButton))
    expect(screen.queryByTestId('connection-success')).not.toBeInTheDocument()
  })
  it('renders closes connection success when onClose is called', () => {
    let open = true
    ;(useModalStore as unknown as jest.Mock).mockImplementation((fn) => {
      const res = { isOpen: open, setIsOpen: (v: boolean) => (open = v) }
      fn(res)
      return res
    })
    const { container } = render(<ConnectionModal />)
    fireEvent.click(screen.getByTestId(locators.connectionModalApproveButton))
    fireEvent.click(screen.getByTestId('connection-success'))
    expect(container).toBeEmptyDOMElement()
  })
})
