import { render, screen } from '@testing-library/react'
import { ComingSoon } from '.'

describe('ComingSoon', () => {
  it('should render coming soon message', () => {
    render(<ComingSoon />)
    expect(
      screen.getByText("We're working on it! Coming soon.")
    ).toBeInTheDocument()
  })
})
