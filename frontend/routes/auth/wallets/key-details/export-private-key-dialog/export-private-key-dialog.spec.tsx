import { fireEvent, render, screen } from '@testing-library/react'
import { ExportPrivateKeysDialog, locators } from './export-private-key-dialog'
import { ExportPrivateKeyFormProps } from './export-private-key-form'

jest.mock('./export-private-key-form', () => ({
  ExportPrivateKeyForm: (props: ExportPrivateKeyFormProps) => (
    <button onClick={() => props.onSuccess('0x1')} data-testid="export-private-key-form" />
  )
}))

jest.mock('./view-private-key', () => ({
  ViewPrivateKey: () => <div data-testid="view-private-key" />
}))

describe('ExportPrivateKeyDialog', () => {
  it('renders export button', () => {
    render(<ExportPrivateKeysDialog />)
    expect(screen.getByTestId(locators.privateKeyTrigger)).toBeInTheDocument()
    expect(screen.getByTestId(locators.privateKeyTrigger)).toHaveTextContent('Export private key')
  })
  it('open dialog when export button is pressed with title', async () => {
    render(<ExportPrivateKeysDialog />)
    fireEvent.click(screen.getByTestId(locators.privateKeyTrigger))
    await screen.findByTestId(locators.privateKeyTitle)
    expect(screen.getByTestId(locators.privateKeyTitle)).toHaveTextContent('Export private key')
  })
  it('renders form when private key has yet to be loaded', async () => {
    render(<ExportPrivateKeysDialog />)
    fireEvent.click(screen.getByTestId(locators.privateKeyTrigger))
    await screen.findByTestId(locators.privateKeyTitle)
    expect(screen.getByTestId('export-private-key-form')).toBeInTheDocument()
  })
  it('renders private key view when private key is loaded', async () => {
    render(<ExportPrivateKeysDialog />)
    fireEvent.click(screen.getByTestId(locators.privateKeyTrigger))
    await screen.findByTestId(locators.privateKeyTitle)
    fireEvent.click(screen.getByTestId('export-private-key-form'))
    await screen.findByTestId('view-private-key')
    expect(screen.getByTestId('view-private-key')).toBeInTheDocument()
  })
})
