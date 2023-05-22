import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useModalStore } from '../../lib/modal-store'
import locators from '../locators'
import { TransactionModal } from '.'

jest.mock('../../lib/modal-store', () => ({
  useModalStore: jest.fn()
}))

describe('ConnectionModal', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2021-01-01T00:00:00.000Z'))
  })

  it('renders nothing when isOpen is false', () => {
    ;(useModalStore as unknown as jest.Mock).mockImplementationOnce((fn) => {
      const res = { isOpen: false }
      fn(res)
      return res
    })
    const { container } = render(<TransactionModal />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders page header, transaction type, hostname and key', () => {
    ;(useModalStore as unknown as jest.Mock).mockImplementationOnce((fn) => {
      const res = { isOpen: true }
      fn(res)
      return res
    })
    render(<TransactionModal />)
    expect(screen.getByTestId(locators.transactionWrapper)).toBeInTheDocument()
    expect(screen.getByTestId(locators.pageHeader)).toBeInTheDocument()
    expect(screen.getByTestId(locators.transactionType)).toHaveTextContent('Order submission')
    expect(screen.getByTestId(locators.transactionRequest)).toHaveTextContent('Request from https://www.google.com')
    expect(screen.getByTestId(locators.transactionKey)).toHaveTextContent('Signing with')
    expect(screen.getByTestId(locators.transactionTimeAgo)).toHaveTextContent('Received just now')
    expect(screen.getByTestId(locators.transactionModalApproveButton)).toBeInTheDocument()
    expect(screen.getByTestId(locators.transactionModalDenyButton)).toBeInTheDocument()
  })

  it('renders nothing after denying', async () => {
    let open = true
    ;(useModalStore as unknown as jest.Mock).mockImplementation((fn) => {
      const res = { isOpen: open, setIsOpen: (v: boolean) => (open = v) }
      fn(res)
      return res
    })
    const { container } = render(<TransactionModal />)
    fireEvent.click(screen.getByTestId(locators.transactionModalDenyButton))
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })

  it('renders nothing after approving', async () => {
    let open = true
    ;(useModalStore as unknown as jest.Mock).mockImplementation((fn) => {
      const res = { isOpen: open, setIsOpen: (v: boolean) => (open = v) }
      fn(res)
      return res
    })
    const { container } = render(<TransactionModal />)
    fireEvent.click(screen.getByTestId(locators.transactionModalApproveButton))
    await waitFor(() => expect(container).toBeEmptyDOMElement())
  })
})
