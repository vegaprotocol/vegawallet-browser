import { render, screen } from '@testing-library/react'
import { Withdraw } from '.'

jest.mock('../../keys/ethereum-key', () => ({
  EthereumKey: () => <div data-testid="ethereum-key" />
}))

describe('Withdrawal', () => {
  it('renders nothing if withdrawal is not of type erc20', () => {
    const { container } = render(
      <Withdraw
        transaction={{
          withdrawSubmission: {}
        }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
  it('renders ethereum address', () => {
    // 1123-WITH-001 I can see the Ethereum key I am withdrawing the assets to
    render(
      <Withdraw
        transaction={{
          withdrawSubmission: {
            ext: {
              erc20: {
                receiverAddress: '0x1111111111111111111111111111111111111111'
              }
            }
          }
        }}
      />
    )
    expect(screen.getByTestId('ethereum-key')).toBeVisible()
  })
})
