import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorModal } from '.'

describe('ErrorModal', () => {
  const error = new Error('Test error')
  const onCloseMock = jest.fn()

  it('renders error message', () => {
    render(<ErrorModal error={error} onClose={onCloseMock} />)
    const errorMessage = screen.getByText(error.message)
    expect(errorMessage).toBeInTheDocument()
    const title = screen.getByText("Something's gone wrong 🙃")
    expect(title).toBeInTheDocument()
  })

  it('calls onClose when Close button is clicked', () => {
    render(<ErrorModal error={error} onClose={onCloseMock} />)
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    expect(onCloseMock).toHaveBeenCalled()
  })
})
