import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { RenameKeyDialog, locators } from './rename-key-dialog'
import { RenameKeyFormProps } from './rename-key-form'
import { RpcMethods } from '../../../../../lib/client-rpc-methods'

jest.mock('./rename-key-form', () => ({
  RenameKeyForm: ({ onComplete }: RenameKeyFormProps) => <button onClick={onComplete} data-testid="rename-key-form" />
}))

jest.mock('../../../../../components/keys/vega-key', () => ({
  VegaKey: () => <div data-testid="vega-key" />
}))

const mockRequest = jest.fn().mockResolvedValue({ wallets: [] })

jest.mock('../../../../../contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: mockRequest
  })
}))

describe('RenameKeyDialog', () => {
  it('renders the trigger', () => {
    render(
      <RenameKeyDialog
        vegaKey={{
          name: 'Key 1',
          publicKey: '123',
          metadata: [],
          index: 0
        }}
      />
    )
    expect(screen.getByTestId(locators.renameKeyTrigger)).toBeInTheDocument()
  })
  it('opens the dialog when the trigger is clicked', () => {
    render(
      <RenameKeyDialog
        vegaKey={{
          name: 'Key 1',
          publicKey: '123',
          metadata: [],
          index: 0
        }}
      />
    )
    fireEvent.click(screen.getByTestId(locators.renameKeyTrigger))

    expect(screen.getByTestId('rename-key-form')).toBeInTheDocument()
  })
  it('renders title, vega key and form', () => {
    render(
      <RenameKeyDialog
        vegaKey={{
          name: 'Key 1',
          publicKey: '123',
          metadata: [],
          index: 0
        }}
      />
    )
    fireEvent.click(screen.getByTestId(locators.renameKeyTrigger))

    expect(screen.getByTestId('rename-key-form')).toBeInTheDocument()
    expect(screen.getByTestId('vega-key')).toBeInTheDocument()
    expect(screen.getByTestId(locators.renameKeyTitle)).toHaveTextContent('Rename key')
  })
  it('reloads the wallets when wallet name is successfully changed', async () => {
    render(
      <RenameKeyDialog
        vegaKey={{
          name: 'Key 1',
          publicKey: '123',
          metadata: [],
          index: 0
        }}
      />
    )
    fireEvent.click(screen.getByTestId(locators.renameKeyTrigger))
    fireEvent.click(screen.getByTestId('rename-key-form'))

    await waitFor(() => expect(mockRequest).toBeCalledWith(RpcMethods.ListWallets, null))
  })
})
