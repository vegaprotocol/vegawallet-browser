import { render, screen } from '@testing-library/react'
import { EthereumKey, locators } from '.'

jest.mock('../../copy-with-check', () => ({
  CopyWithCheckmark: () => <div data-testid="copy-with-checkmark" />
}))

const address = '0x1234567890abcdef'

describe('EthereumKey', () => {
  test('renders Ethereum address correctly', () => {
    // 1115-EXPL-001 When I see the Ethereum key I can see a link to an Ethereum block explorer based on that address
    render(<EthereumKey address={address} />)

    const explorerLink = screen.getByTestId(locators.explorerLink)
    expect(screen.getByTestId(locators.title)).toHaveTextContent('Ethereum Address')
    expect(explorerLink).toHaveAttribute('href', `https://sepolia.etherscan.io/address/${address}`)
    expect(explorerLink).toHaveTextContent('0x1234…cdef')
  })

  test('renders the CopyWithCheckmark components', () => {
    render(<EthereumKey address={address} />)
    expect(screen.getByTestId('copy-with-checkmark')).toBeInTheDocument()
  })
})
