import { screen, render } from '@testing-library/react'
import { KeyDetails } from './key-details'
import { useParams } from 'react-router-dom'
import { silenceErrors } from '../../../../test-helpers/silence-errors'
import { locators } from '../../../../components/keys/vega-key/index'

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
    expect(() => render(<KeyDetails />)).toThrowError('Id param not provided')
  })
  it('renders the KeyDetailsPage', () => {
    // 1125-KEYD-007 In the key details screen I can see my currently selected key and associated info
    ;(useParams as unknown as jest.Mock).mockReturnValue({
      id: '1'
    })
    render(<KeyDetails />)
    expect(screen.getByTestId('key-details-page')).toBeInTheDocument()
    expect(screen.getByTestId(locators.keyName)).toBeInTheDocument() // smoke to check VegaKey rendered, VegaKey testing checks correct info displayed
  })
})
