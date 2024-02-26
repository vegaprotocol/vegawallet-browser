import { fireEvent, render, screen } from '@testing-library/react'

import { DeleteWallet, locators } from './delete-wallet'

jest.mock('./delete-wallet-warning', () => ({
  DeleteWalletWarning: () => <div data-testid="delete-wallet-warning" />
}))

describe('DeleteWallet', () => {
  it('should render trigger, title and component', async () => {
    render(<DeleteWallet />)
    expect(screen.getByTestId(locators.deleteWalletTrigger)).toBeInTheDocument()
    fireEvent.click(screen.getByTestId(locators.deleteWalletTrigger))
    await screen.findByTestId('delete-wallet-warning')
    expect(screen.getByTestId(locators.deleteWalletTitle)).toHaveTextContent('Delete Wallet')
  })
})
