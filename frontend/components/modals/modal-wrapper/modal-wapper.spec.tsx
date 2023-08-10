import { render, screen } from '@testing-library/react'
import { ModalWrapper } from '.'

// Mock the child components
jest.mock('../connection-modal', () => ({
  ConnectionModal: jest.fn(() => <div data-testid="connection-modal" />)
}))

jest.mock('../popover-open-modal', () => ({
  PopoverOpenModal: jest.fn(() => <div data-testid="popover-open-modal" />)
}))

jest.mock('../transaction-modal', () => ({
  TransactionModal: jest.fn(() => <div data-testid="transaction-modal" />)
}))

describe('ModalWrapper', () => {
  it('renders all the modal components', () => {
    // Render the component
    render(<ModalWrapper />)

    // Check if all the modal components are present
    expect(screen.getByTestId('popover-open-modal')).toBeInTheDocument()
    expect(screen.getByTestId('connection-modal')).toBeInTheDocument()
    expect(screen.getByTestId('transaction-modal')).toBeInTheDocument()
  })
})
