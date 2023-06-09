import { fireEvent, render, screen } from '@testing-library/react'
import { HostImage } from '.'
import locators from '../locators'

describe('HostImage', () => {
  it('render host image at size specified', () => {
    render(<HostImage hostname="https://www.google.com" size={1} />)
    const img = screen.getByTestId(locators.hostImage)
    expect(img).toHaveStyle('width: 4px; height: 4px;')
  })

  it('falls back to a question mark if URL does not exist', () => {
    render(<HostImage hostname="f" />)
    const img = screen.getByTestId(locators.hostImage)
    fireEvent.error(img)
    expect(img).toHaveAttribute('src', './question-mark.png')
  })
})
