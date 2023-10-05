import { render, screen } from '@testing-library/react'
import { LoaderBone, locators } from './loader-bone'

describe('LoaderBone', () => {
  it('should have tests render a row for each row of width passed in', () => {
    render(<LoaderBone width={2} height={1} />)
    expect(screen.getAllByTestId(locators.boneCol)).toHaveLength(2)
  })
  it('should render a square for each row of width*height passed in', () => {
    render(<LoaderBone width={2} height={2} />)
    expect(screen.getAllByTestId(locators.boneSquare)).toHaveLength(4)
  })
})
