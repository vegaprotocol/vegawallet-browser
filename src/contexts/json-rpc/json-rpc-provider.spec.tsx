import { render, screen } from '@testing-library/react'
import { JsonRPCProvider } from './json-rpc-provider'
import { useJsonRpcClient } from './json-rpc-context'

const TestComponent = ({ expect }: { expect: jest.Expect }) => {
  const { client } = useJsonRpcClient()
  expect(client).not.toBeNull()
  return <div>Content</div>
}

describe('JsonRpcProvider', () => {
  it('renders and provides client', () => {
    // @ts-ignore
    global.browser = {
      runtime: {
        connect: () => ({
          postMessage: () => {},
          onmessage: () => {},
          onMessage: {
            addListener: () => {}
          }
        })
      }
    }
    render(
      <JsonRPCProvider>
        <TestComponent expect={expect} />
      </JsonRPCProvider>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('throws error if hook is called outside context', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => render(<TestComponent expect={expect} />)).toThrow(
      'useJsonRpcClient must be used within JsonRPCProvider'
    )
  })
})
