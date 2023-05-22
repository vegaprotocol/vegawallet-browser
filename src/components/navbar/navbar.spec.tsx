import { render, screen } from '@testing-library/react'
import type { NavButtonProps } from '.'
import { NavButton, NavBar } from '.'
import { MemoryRouter } from 'react-router-dom'
import type { HTMLAttributes } from 'react'

jest.mock('@vegaprotocol/ui-toolkit', () => ({
  Button: (props: HTMLAttributes<HTMLButtonElement>) => <button {...props} />
}))

const renderNavButton = (props: NavButtonProps, initialEntries: string[] = []) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <NavButton {...props} />
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
        end: false,
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
        end: false,
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
        end: false,
        isFairground: true
      },
      ['/settings']
    )

    expect(screen.getByTestId('link-active')).toHaveClass('bg-black')
  })
})

describe('NavBar', () => {
  it('renders with all two NavButtons', () => {
    renderNav({ isFairground: false })
    expect(screen.getByTestId('nav-bar')).toBeInTheDocument()
    expect(screen.getByTestId('nav-bar')).toHaveClass('bg-black')
    expect(screen.getAllByTestId('nav-button')).toHaveLength(2)
    const [wallets, settings] = screen.getAllByTestId('nav-button')
    expect(wallets).toHaveTextContent('Wallets')
    expect(settings).toHaveTextContent('Settings')
  })

  it('changes color if in fairground mode', () => {
    renderNav({ isFairground: true })
    expect(screen.getByTestId('nav-bar')).toHaveClass('bg-vega-yellow-500')
  })
})
