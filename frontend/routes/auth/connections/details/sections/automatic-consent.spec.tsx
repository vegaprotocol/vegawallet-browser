import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { locators as vegaSubHeaderLocators } from '@/components/sub-header'
import { useAsyncAction } from '@/hooks/async-action'
import { RpcMethods } from '@/lib/client-rpc-methods'
import { silenceErrors } from '@/test-helpers/silence-errors'

import { AutomaticConsentSection } from './automatic-consent'

const request = jest.fn()
jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request })
}))
jest.mock('@/hooks/async-action')

const renderComponent = () => {
  const connection = {
    origin: 'http://foo.com',
    accessedAt: 0,
    chainId: 'chainId',
    networkId: 'networkId',
    allowList: {
      publicKeys: [],
      wallets: []
    },
    autoConsent: false
  }
  return render(<AutomaticConsentSection connection={connection} />)
}

describe('AutomaticConsent', () => {
  it('renders title and checkbox', () => {
    ;(useAsyncAction as jest.Mock).mockImplementation((function_: any) => ({
      error: null,
      data: null,
      loading: false,
      loaderFunction: function_
    }))
    renderComponent()
    expect(screen.getByTestId(vegaSubHeaderLocators.subHeader)).toHaveTextContent('Automatic consent')
    expect(
      screen.getByLabelText(
        'Allow this site to automatically approve order and vote transactions. This can be turned off in "Connections".'
      )
    ).toBeVisible()
  })

  it('calls update connection if checkbox is clicked', async () => {
    ;(useAsyncAction as jest.Mock).mockImplementation((function_: any) => ({
      error: null,
      data: null,
      loading: false,
      loaderFunction: function_
    }))
    renderComponent()
    fireEvent.click(
      screen.getByLabelText(
        'Allow this site to automatically approve order and vote transactions. This can be turned off in "Connections".'
      )
    )
    await waitFor(() =>
      expect(request).toHaveBeenCalledWith(RpcMethods.UpdateConnection, {
        origin: 'http://foo.com',
        autoConsent: true
      })
    )
  })

  it('throws error if there is an error', () => {
    silenceErrors()
    ;(useAsyncAction as jest.Mock).mockImplementation((function_: any) => ({
      error: new Error('Err'),
      data: null,
      loading: false,
      loaderFunction: function_
    }))
    expect(() => renderComponent()).toThrow('Err')
  })
})
