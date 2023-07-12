import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PopoverOpenModal, locators } from '.'
import { usePopoverStore } from '../../../stores/popover-store'

jest.mock('../../../stores/popover-store')

describe('PopoverOpenModal', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('renders correctly when popoverOpen is false', () => {
    ;(usePopoverStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        popoverOpen: false,
        focusPopover: jest.fn(),
        isPopoverInstance: false
      })
    )

    const { container } = render(<PopoverOpenModal />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly when popoverOpen is true and isPopoverInstance is true', () => {
    ;(usePopoverStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        popoverOpen: true,
        focusPopover: jest.fn(),
        isPopoverInstance: true
      })
    )

    const { container } = render(<PopoverOpenModal />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders correctly when popoverOpen is true and isPopoverInstance is false', () => {
    const mockFocusPopover = jest.fn()
    ;(usePopoverStore as unknown as jest.Mock).mockImplementation((fn) =>
      fn({
        popoverOpen: true,
        focusPopover: mockFocusPopover,
        isPopoverInstance: false
      })
    )

    render(<PopoverOpenModal />)

    expect(screen.getByTestId(locators.popoverModal)).toBeInTheDocument()
    expect(screen.getByText("You're viewing your wallet in another window")).toBeInTheDocument()

    const continueButton = screen.getByRole('button', { name: /Continue here/i })
    fireEvent.click(continueButton)

    expect(mockFocusPopover).toHaveBeenCalledTimes(1)
  })
})
