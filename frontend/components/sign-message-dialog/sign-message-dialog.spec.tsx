import { render, screen, fireEvent } from '@testing-library/react'
import { SignMessageDialog, SignMessageDialogProps } from './sign-message-dialog'
import { mockClient } from '../../test-helpers/mock-client'
import { JsonRPCProvider } from '../../contexts/json-rpc/json-rpc-provider'
import { locators as signMessageLocators } from './sign-message'
import { locators as signedMessageLocators } from './signed-message'

const renderComponent = (props: SignMessageDialogProps) => {
  return render(
    <JsonRPCProvider>
      <SignMessageDialog {...props} />
    </JsonRPCProvider>
  )
}

describe('SignMessageDialog', () => {
  beforeEach(() => {
    mockClient()
  })
  test('renders SignMessage component when signedMessage is null', () => {
    const mockOnClose = jest.fn()
    renderComponent({
      publicKey: 'test-public-key',
      onClose: mockOnClose,
      open: true
    })

    expect(screen.getByTestId(signMessageLocators.signMessageHeader)).toBeInTheDocument()
    expect(screen.queryByTestId(signedMessageLocators.signedMessageHeader)).not.toBeInTheDocument()
  })

  test('renders SignedMessage component when signedMessage is not null', async () => {
    const mockOnClose = jest.fn()
    renderComponent({
      publicKey: 'test-public-key',
      onClose: mockOnClose,
      open: true
    })
    const messageInput = screen.getByTestId(signMessageLocators.messageInput)
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.click(screen.getByTestId(signMessageLocators.signButton))

    await screen.findByTestId(signedMessageLocators.signedMessageHeader)
    expect(screen.getByTestId(signedMessageLocators.signedMessageHeader)).toBeInTheDocument()
  })

  test('calls onClose and resets dialog when signMessage is cancelled', () => {
    const mockOnClose = jest.fn()
    renderComponent({
      publicKey: 'test-public-key',
      onClose: mockOnClose,
      open: true
    })

    fireEvent.click(screen.getByTestId(signMessageLocators.cancelButton))

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
