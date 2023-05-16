import { fireEvent, render, screen } from '@testing-library/react'
import { useModalStore } from '../../lib/modal-store'
import locators from '../locators'
import { TransactionModal } from '.'

jest.mock('../../lib/modal-store', () => ({
  useModalStore: jest.fn()
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
    expect(false).toBe(true)
  })
})
