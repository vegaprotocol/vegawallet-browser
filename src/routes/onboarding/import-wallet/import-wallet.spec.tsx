import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ImportWallet } from '.'
import { importMnemonic, importMnemonicDescription, importMnemonicSubmit } from '../../../locator-ids'

const mockedUsedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockedUsedNavigate
}))

describe('ImportWallet', () => {
  it('renders description, input and submit button', () => {
    render(
      <MemoryRouter>
        <ImportWallet />
      </MemoryRouter>
    )
    expect(screen.getByTestId(importMnemonicDescription)).toHaveTextContent(
      "Enter or paste in your Vega wallet's recovery phrase."
    )
    expect(screen.getByTestId(importMnemonic)).toBeInTheDocument()
    expect(screen.getByTestId(importMnemonicSubmit)).toHaveTextContent('Import wallet')
  })

  it('after successfully importing a wallet it redirects to wallets page', () => {
    render(
      <MemoryRouter>
        <ImportWallet />
      </MemoryRouter>
    )
    expect(screen.getByTestId(importMnemonicDescription)).toHaveTextContent(
      "Enter or paste in your Vega wallet's recovery phrase."
    )
    expect(screen.getByTestId(importMnemonic)).toBeInTheDocument()
    expect(screen.getByTestId(importMnemonicSubmit)).toHaveTextContent('Import wallet')
  })
})
