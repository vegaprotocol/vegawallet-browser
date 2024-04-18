import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, useParams } from 'react-router-dom'

import { useAsyncAction } from '@/hooks/async-action'
import { useConnectionStore } from '@/stores/connections'
import { mockStore } from '@/test-helpers/mock-store'
import { silenceErrors } from '@/test-helpers/silence-errors'

import { ConnectionDetails, locators } from './details'

const request = jest.fn()
jest.mock('@/contexts/json-rpc/json-rpc-context', () => ({
  useJsonRpcClient: () => ({ request })
}))

jest.mock('@/hooks/async-action')

jest.mock('@/stores/connections')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}))

const defaultImplementation = (function_: any) => ({
  error: null,
  loading: false,
  data: null,
  loaderFunction: function_
})

const renderComponent = (async: typeof useAsyncAction = defaultImplementation) => {
  ;(useAsyncAction as jest.Mock).mockImplementation(async)
  return render(
    <MemoryRouter>
      <ConnectionDetails />
    </MemoryRouter>
  )
}

describe('ConnectionDetails', () => {
  it('throws error if id parameter is not defined', () => {
    silenceErrors()
    ;(useParams as jest.Mock).mockReturnValue({ id: undefined })
    expect(() => renderComponent()).toThrow('Id param not provided to connection details')
  })
  it('throws error if connection could not be found', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: encodeURI('test') })
    mockStore(useConnectionStore, { connections: [] })
    expect(() => renderComponent()).toThrow('Could not find connection with origin test')
  })
  it('returns null while loading', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: encodeURI('test') })
    mockStore(useConnectionStore, { connections: [], loading: true })
    const { container } = renderComponent()
    expect(container).toBeEmptyDOMElement()
  })
})
