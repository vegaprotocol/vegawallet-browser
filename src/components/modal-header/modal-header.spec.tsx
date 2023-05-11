import { render, screen } from '@testing-library/react'
import locators from '../locators'
import { ModalHeader } from '.'

jest.mock('../host-image', () => ({
  HostImage: () => <div data-testid="host-image"></div>
}))
jest.mock('../icons/vega-icon', () => ({
  VegaIcon: () => <div data-testid="vega-icon"></div>
}))

describe('ModalHeader', () => {
  it('renders title, image and vega icon', () => {
    render(<ModalHeader hostname="https://www.google.com" title="title" />)
    expect(screen.getByTestId('host-image')).toBeInTheDocument()
    expect(screen.getByTestId('vega-icon')).toBeInTheDocument()
    expect(screen.getByTestId(locators.modalHeaderTitle)).toHaveTextContent('title')
    expect(screen.getByTestId(locators.dAppHostname)).toHaveTextContent('https://www.google.com')
  })
})
