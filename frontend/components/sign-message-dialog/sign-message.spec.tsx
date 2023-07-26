import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignMessage, locators } from './sign-message'

describe('SignMessage', () => {
  test('renders header, description, and SignMessageForm', () => {
    render(<SignMessage onCancel={jest.fn()} onSign={jest.fn()} disabled={false} />)

    expect(screen.getByTestId(locators.signMessageHeader)).toHaveTextContent('Sign message')
    expect(screen.getByTestId(locators.messageDescription)).toHaveTextContent('Enter the message you want to encrypt.')
    expect(screen.getByTestId(locators.signButton)).toHaveTextContent('Sign')
    expect(screen.getByTestId(locators.cancelButton)).toHaveTextContent('Cancel')
  })

  test('calls onCancel when cancel button is clicked', async () => {
    const onCancel = jest.fn()
    render(<SignMessage onCancel={onCancel} onSign={jest.fn()} disabled={false} />)

    fireEvent.click(screen.getByTestId(locators.cancelButton))

    await waitFor(() => expect(onCancel).toHaveBeenCalledTimes(1))
  })

  test('calls onSign with input message when sign button is clicked', async () => {
    const onSign = jest.fn()
    render(<SignMessage onCancel={jest.fn()} onSign={onSign} disabled={false} />)

    const messageInput = screen.getByTestId(locators.messageInput)
    fireEvent.change(messageInput, { target: { value: 'Test message' } })
    fireEvent.click(screen.getByTestId(locators.signButton))
    await waitFor(() => expect(onSign).toHaveBeenCalledTimes(1))
  })
})
