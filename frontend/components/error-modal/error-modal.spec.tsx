import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorModal } from '.'
import locators from '../locators'

describe('ErrorModal', () => {
  const error = new Error('Test error')
  const onCloseMock = jest.fn()

  it('renders error message', () => {
    render(<ErrorModal error={error} onClose={onCloseMock} />)
    const errorMessage = screen.getByTestId(locators.codeWindowContent)
    expect(errorMessage).toBeInTheDocument()
    const title = screen.getByText("Something's gone wrong 🙃")
    expect(title).toBeInTheDocument()
  })

  it('calls onClose when Close button is clicked', () => {
    render(<ErrorModal error={error} onClose={onCloseMock} />)
    const closeButton = screen.getByTestId(locators.errorModalClose)
    fireEvent.click(closeButton)
    expect(onCloseMock).toHaveBeenCalled()
  })
})
