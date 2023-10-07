import { render, screen, fireEvent } from '@testing-library/react'
import { HiddenContainer, HiddenContainerProps } from './hidden-container'
import locators from '../locators'

jest.mock('../copy-with-check', () => ({
  CopyWithCheckmark: () => <div data-testid="copy" />
}))

const renderComponent = (props: HiddenContainerProps) => {
  return render(<HiddenContainer {...props} />)
}

describe('HiddenContainer', () => {
  it('displays the mnemonic when the "Reveal" button is clicked', () => {
    const hiddenInformation = 'test mnemonic'
    renderComponent({
      hiddenInformation,
      onChange: jest.fn(),
      text: 'Reveal'
    })
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    const mnemonicElement = screen.getByTestId(locators.mnemonicContainerMnemonic)
    expect(mnemonicElement).toHaveTextContent(hiddenInformation)
  })

  it('hides the mnemonic when the "Hide" button is clicked', () => {
    const hiddenInformation = 'test mnemonic'
    renderComponent({
      hiddenInformation,
      onChange: jest.fn(),
      text: 'Reveal'
    })
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    const hideButton = screen.getByTestId(locators.hideIcon)
    fireEvent.click(hideButton)
    const mnemonicElement = screen.queryByText(hiddenInformation)
    expect(mnemonicElement).not.toBeInTheDocument()
  })

  it('renders a copy button', async () => {
    const hiddenInformation = 'test mnemonic'
    renderComponent({
      hiddenInformation,
      onChange: jest.fn(),
      text: 'Reveal'
    })
    fireEvent.click(screen.getByTestId(locators.mnemonicContainerHidden))
    expect(screen.getByTestId('copy')).toBeInTheDocument()
  })
})
