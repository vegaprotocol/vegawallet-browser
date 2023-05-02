import { render, screen, fireEvent } from '@testing-library/react'
import { MnemonicContainer } from '.'
import locators from '../locators'

jest.mock('../copy-with-check', () => ({
  CopyWithCheckmark: () => <div data-testid="copy" />
}))

describe('MnemonicContainer', () => {
  it('displays the mnemonic when the "Reveal recovery phrase" button is clicked', () => {
    const mnemonic = 'test mnemonic'
    render(<MnemonicContainer mnemonic={mnemonic} onChange={() => {}} />)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    const mnemonicElement = screen.getByTestId(locators.mnemonicContainerMnemonic)
    expect(mnemonicElement).toHaveTextContent(mnemonic)
  })

  it('hides the mnemonic when the "Hide" button is clicked', () => {
    const mnemonic = 'test mnemonic'
    render(<MnemonicContainer mnemonic={mnemonic} onChange={() => {}} />)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    const hideButton = screen.getByTestId(locators.hideIcon)
    fireEvent.click(hideButton)
    const mnemonicElement = screen.queryByText(mnemonic)
    expect(mnemonicElement).not.toBeInTheDocument()
  })

  it('renders a copy button', async () => {
    const mnemonic = 'test mnemonic'
    render(<MnemonicContainer mnemonic={mnemonic} onChange={() => {}} />)
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    expect(screen.getByTestId('copy')).toBeInTheDocument()
  })
})
