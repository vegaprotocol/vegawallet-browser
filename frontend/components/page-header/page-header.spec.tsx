import { render, screen } from '@testing-library/react'

import { PageHeader } from './page-header'

jest.mock('../icons/vega-icon', () => ({
  VegaIcon: () => <div data-testid="vega-icon" />
}))
jest.mock('./network-switcher', () => ({
  NetworkSwitcher: () => <div data-testid="network-switcher" />
}))
jest.mock('./popout-button', () => ({
  PopoutButton: () => <div data-testid="popout-button" />
}))

const renderComponent = () => render(<PageHeader />)

describe('PageHeader', () => {
  it('renders the VegaIcon component', () => {
    renderComponent()
    const vegaIconElement = screen.getByTestId('vega-icon')
    expect(vegaIconElement).toBeVisible()
  })

  it('renders the PopoutButton', () => {
    renderComponent()
    const popout = screen.getByTestId('popout-button')
    expect(popout).toBeVisible()
  })

  it('renders the network indicator correctly', () => {
    renderComponent()

    expect(screen.getByTestId('network-switcher')).toBeVisible()
  })
})
