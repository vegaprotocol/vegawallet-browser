import { fireEvent, render, screen } from '@testing-library/react'

import { useAsyncAction } from '@/hooks/async-action'
import { useInteractionStore } from '@/stores/interaction-store'
import { mockStore } from '@/test-helpers/mock-store'

import { CheckTransaction, locators } from './check-transaction'

jest.mock('@/stores/interaction-store')
jest.mock('@/hooks/async-action')

jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({
    request: jest.fn()
  })
}))

const renderComponent = () => {
  const checkTransaction = jest.fn()
  mockStore(useInteractionStore, { checkTransaction })
  const view = render(<CheckTransaction publicKey="publicKey" origin="origin" transaction={{}} />)
  return {
    view,
    checkTransaction
  }
}

const mockResult = (value: ReturnType<typeof useAsyncAction>) => {
  ;(useAsyncAction as jest.Mock).mockReturnValue(value)
}

describe('CheckTransaction', () => {
  it('should call checkTransaction function on load', () => {
    ;(useAsyncAction as unknown as jest.Mock).mockImplementation((function_) => ({
      loading: false,
      error: null,
      data: null,
      loaderFunction: function_
    }))
    const { checkTransaction } = renderComponent()
    expect(checkTransaction).toHaveBeenCalled()
  })
  it('should render a loading state while loading', () => {
    mockResult({
      loading: true,
      error: null,
      data: null,
      loaderFunction: jest.fn()
    })
    renderComponent()
    expect(screen.getByTestId(locators.checkTransactionLoading)).toHaveTextContent('Checking transaction validity')
  })
  it('should render a loading state while data is undefined', () => {
    mockResult({
      loading: false,
      error: null,
      data: null,
      loaderFunction: jest.fn()
    })
    renderComponent()
    expect(screen.getByTestId(locators.checkTransactionLoading)).toHaveTextContent('Checking transaction validity')
  })
  it('should render a notification with intent Danger when there is an unexpected error', async () => {
    mockResult({
      loading: false,
      error: new Error('Unexpected error'),
      data: null,
      loaderFunction: jest.fn()
    })
    renderComponent()
    expect(screen.getByTestId(locators.checkTransactionError)).toHaveTextContent(
      "There was a problem checking your transaction's validity, but you can still choose to send it."
    )
    fireEvent.pointerMove(screen.getByTestId(locators.checkTransactionError))
    const [tooltip] = await screen.findAllByTestId(locators.checkTransactionErrorTooltip)
    expect(tooltip).toHaveTextContent('Unexpected error')
  })
  it('should render a Notification with intent Success when data.valid is true', async () => {
    mockResult({
      loading: false,
      error: null,
      data: {
        valid: true
      },
      loaderFunction: jest.fn()
    })
    renderComponent()
    expect(screen.getByTestId(locators.checkTransactionValid)).toHaveTextContent('Your transaction is valid.')
    fireEvent.pointerMove(screen.getByTestId(locators.checkTransactionValid))
    const [tooltip] = await screen.findAllByTestId(locators.checkTransactionValidTooltip)
    expect(tooltip).toHaveTextContent(
      'This transaction has passed all checks and is ready to be sent to the network. This is not a guarantee of success and may still be rejected if secondary checks on the network fail.'
    )
  })
  it('should render a Notification with intent Danger when data.valid is false', async () => {
    mockResult({
      loading: false,
      error: null,
      data: {
        valid: false,
        error: 'Error message'
      },
      loaderFunction: jest.fn()
    })
    renderComponent()
    expect(screen.getByTestId(locators.checkTransactionFailed)).toHaveTextContent('Error message')
    fireEvent.pointerMove(screen.getByTestId(locators.checkTransactionFailed))
    const [tooltip] = await screen.findAllByTestId(locators.checkTransactionFailedTooltip)
    expect(tooltip).toHaveTextContent('You can still send this transaction but it may be rejected by the network.')
  })
})
