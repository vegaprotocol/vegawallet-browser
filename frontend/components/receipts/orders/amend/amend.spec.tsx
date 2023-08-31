import { render, screen } from '@testing-library/react'
import { Amendment } from '.'
import { locators } from '../../../data-table/data-table'

describe('Amend', () => {
  it('should render nothing if the order has pegged offset set', () => {
    const { container } = render(<Amendment transaction={{ orderAmendment: { pegged_offset: {} } }} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('should render nothing if the order has pegged reference set', () => {
    const { container } = render(<Amendment transaction={{ orderAmendment: { pegged_reference: {} } }} />)
    expect(container).toBeEmptyDOMElement()
  })
  it('should render badges and table data', () => {
    // 1114-RCPT-019 I can see the order id of the order I am amending
    // 1114-RCPT-020 I can see the market id relating to the order I am amending
    // 1114-RCPT-021 I can see any relevant order badges
    render(<Amendment transaction={{ orderAmendment: { reference: 'foo', postOnly: true } }} />)
    const [referenceRow] = screen.getAllByTestId(locators.dataRow)
    expect(referenceRow).toHaveTextContent('foo')
    expect(screen.getByText('Post only')).toBeVisible()
  })
})
