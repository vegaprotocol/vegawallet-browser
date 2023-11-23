import { screen, render } from '@testing-library/react'
import { KeyDetails } from './key-details'
import { useParams } from 'react-router-dom'
import { silenceErrors } from '../../../../test-helpers/silence-errors'

jest.mock('./key-details-page', () => ({
  KeyDetailsPage: () => <div data-testid="key-details-page" />
}))

jest.mock('react-router-dom')

describe('KeyDetails', () => {
  it('throws an error if no id is provided', () => {
    silenceErrors()
    ;(useParams as unknown as jest.Mock).mockReturnValue({
      id: undefined
    })
    expect(() => render(<KeyDetails />)).toThrow('Id param not provided')
  })
  it('renders the KeyDetailsPage', () => {
    ;(useParams as unknown as jest.Mock).mockReturnValue({
      id: '1'
    })
    render(<KeyDetails />)
    expect(screen.getByTestId('key-details-page')).toBeInTheDocument()
  })
})
