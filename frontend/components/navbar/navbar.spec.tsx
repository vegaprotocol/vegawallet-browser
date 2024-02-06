import { render, screen } from '@testing-library/react'
import type { HTMLAttributes } from 'react'
import { MemoryRouter } from 'react-router-dom'

import type { NavButtonProperties } from '.'
import { NavBar, NavButton } from '.'

jest.mock('@vegaprotocol/ui-toolkit', () => ({
  Button: (properties: HTMLAttributes<HTMLButtonElement>) => <button {...properties} />
}))

const renderNavButton = (properties: NavButtonProperties, initialEntries: string[] = []) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <NavButton {...properties} />
    </MemoryRouter>
  )

const renderNav = ({ isFairground }: { isFairground: boolean }) =>
  render(
    <MemoryRouter>
      <NavBar isFairground={isFairground} />
    </MemoryRouter>
  )

describe('NavButton', () => {
  it('renders with text and icon', () => {
    const icon = <svg data-testid="test-icon" />
    renderNavButton(
      {
        icon: icon,
        text: 'Test Button',
        to: '/',
        isFairground: false
      },
      ['/foo']
    )

    expect(screen.getByTestId('nav-button')).toBeInTheDocument()
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
    expect(screen.getByText('Test Button')).toBeInTheDocument()
    expect(screen.getByTestId('link-active')).not.toHaveClass('bg-vega-yellow')
  })

  it('renders with active link styles when active', () => {
    const icon = <svg data-testid="test-icon" />
    renderNavButton(
      {
        icon: icon,
        text: 'Test Button',
        to: '/settings',
        isFairground: false
      },
      ['/settings']
    )

    expect(screen.getByTestId('link-active')).toHaveClass('bg-vega-yellow')
  })

  it('changes style when in fairground mode', () => {
    const icon = <svg data-testid="test-icon" />
    renderNavButton(
      {
        icon: icon,
        text: 'Test Button',
        to: '/settings',
        isFairground: true
      },
      ['/settings']
    )

    expect(screen.getByTestId('link-active')).toHaveClass('bg-black')
  })
})

describe('NavBar', () => {
  it('renders with all three NavButtons', () => {
    renderNav({ isFairground: false })
    expect(screen.getByTestId('nav-bar')).toBeInTheDocument()
    expect(screen.getByTestId('nav-bar')).toHaveClass('bg-black')
    expect(screen.getAllByTestId('nav-button')).toHaveLength(3)
    const [wallets, connections, settings] = screen.getAllByTestId('nav-button')
    expect(wallets).toHaveTextContent('Wallets')
    expect(connections).toHaveTextContent('Connections')
    expect(settings).toHaveTextContent('Settings')
  })

  it('changes color if in fairground mode', () => {
    renderNav({ isFairground: true })
    expect(screen.getByTestId('nav-bar')).toHaveClass('bg-vega-yellow-500')
  })
})
