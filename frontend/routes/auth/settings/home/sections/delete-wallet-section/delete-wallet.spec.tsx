import { render, screen } from '@testing-library/react'

import { DeleteWallet } from './delete-wallet'

describe('DeleteWallet', () => {
  it('should render the component', () => {
    render(<DeleteWallet />)
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
  })
})
