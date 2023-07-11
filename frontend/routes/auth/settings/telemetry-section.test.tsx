import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TelemetrySection } from './telemetry-section'
import { mockClient } from '../../../test-helpers/mock-client'
import { JsonRPCProvider } from '../../../contexts/json-rpc/json-rpc-provider'
import { useGlobalsStore } from '../../../stores/globals'
import { ReactElement, useEffect } from 'react'
import { useJsonRpcClient } from '../../../contexts/json-rpc/json-rpc-context'

const Wrapper = ({ children }: { children: ReactElement }) => {
  const { loading, loadGlobals } = useGlobalsStore((state) => ({
    loading: state.loading,
    loadGlobals: state.loadGlobals
  }))
  const { request } = useJsonRpcClient()
  useEffect(() => {
    loadGlobals(request)
  }, [request, loadGlobals])
  if (loading) return null
  return children
}

describe('TelemetrySection', () => {
  it('checks the correct options when changed', async () => {
    mockClient([], [], { settings: { telemetry: true } })
    render(
      <JsonRPCProvider>
        <Wrapper>
          <TelemetrySection />
        </Wrapper>
      </JsonRPCProvider>
    )
    await screen.findByLabelText('Yes')
    const telemetryNoOption = screen.getByLabelText('No')
    expect(screen.getByLabelText('Yes')).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByLabelText('No')).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(telemetryNoOption)

    await waitFor(() => expect(screen.getByLabelText('No')).toHaveAttribute('aria-checked', 'true'))
    expect(screen.getByLabelText('Yes')).toHaveAttribute('aria-checked', 'false')
  })
})
