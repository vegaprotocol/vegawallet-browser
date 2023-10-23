import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { RenameKeyForm, locators } from './rename-key-form' // Update the import path
import { RpcMethods } from '../../../../../lib/client-rpc-methods'

const mockRequest = jest.fn().mockResolvedValue(null)

jest.mock('../../../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: mockRequest
  })
}))

describe('RenameKeyForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('renders the form with input and submit button', () => {
    render(<RenameKeyForm keyName={'keyName'} publicKey="publicKey" />)

    const inputElement = screen.getByTestId(locators.renameKeyInput)
    const submitButton = screen.getByTestId(locators.renameKeySubmit)

    expect(inputElement).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('disables submit button when the form is empty', async () => {
    render(<RenameKeyForm keyName={'keyName'} publicKey="publicKey" />)

    const submitButton = screen.getByTestId(locators.renameKeySubmit)

    expect(submitButton).toBeDisabled()
  })

  it('displays an error message when input is too long', async () => {
    render(<RenameKeyForm keyName={'keyName'} publicKey="publicKey" />)

    const inputElement = screen.getByTestId(locators.renameKeyInput)
    const submitButton = screen.getByTestId(locators.renameKeySubmit)

    fireEvent.change(inputElement, {
      target: { value: 'ThisIsAVeryLongKeyNameThatExceeds30Characters' }
    })
    fireEvent.click(submitButton)
    await screen.findByTestId('input-error-text')

    expect(screen.getByTestId('input-error-text')).toHaveTextContent('Key name cannot be more than 30 character long')
  })

  it('calls the renameKey function with the new key name when submitted', async () => {
    const mockNewKeyName = 'NewKeyName'
    render(<RenameKeyForm keyName={'keyName'} publicKey="publicKey" />)

    const inputElement = screen.getByTestId(locators.renameKeyInput)
    const submitButton = screen.getByTestId(locators.renameKeySubmit)

    fireEvent.change(inputElement, { target: { value: mockNewKeyName } })
    fireEvent.click(submitButton)
    await waitFor(() => expect(mockRequest).toHaveBeenCalled())
    expect(mockRequest).toHaveBeenCalledWith(RpcMethods.RenameKey, {
      publicKey: 'publicKey',
      name: mockNewKeyName
    })
  })
})