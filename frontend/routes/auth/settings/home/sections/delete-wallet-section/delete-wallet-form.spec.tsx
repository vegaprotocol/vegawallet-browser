import { render, screen } from '@testing-library/react'

import { DeleteWalletForm } from './delete-wallet-form'

describe('DeleteWalletForm', () => {
  it('should render the component', () => {
    render(<DeleteWalletForm />)
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
  })
})
