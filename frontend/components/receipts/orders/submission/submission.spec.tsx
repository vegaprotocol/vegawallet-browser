import { render, screen } from '@testing-library/react'
import { Submission } from '.'
import { locators } from '../../../data-table/data-table'

describe('SubmissionReceipt', () => {
  it('renders nothing if the transaction is a pegged order', () => {
    const { container } = render(
      <Submission
        transaction={{
          orderSubmission: {
            peggedOrder: {}
          }
        }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
  it('renders nothing if the transaction is an iceberg order', () => {
    const { container } = render(
      <Submission
        transaction={{
          orderSubmission: {
            icebergOpts: {}
          }
        }}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
  it('renders order table and badges', () => {
    // 1114-RCPT-012 I can see the market id of the order I am submitting
    // 1114-RCPT-013 I can see the direction of order I am submitting
    // 1114-RCPT-014 I can see the type of the order I am submitting
    // 1114-RCPT-015 I can see the reference of the order I am submitting
    // 1114-RCPT-016 I can see any relevant order badges
    render(
      <Submission
        transaction={{
          orderSubmission: {
            reference: 'foo',
            postOnly: true
          }
        }}
      />
    )
    const [referenceRow] = screen.getAllByTestId(locators.dataRow)
    expect(referenceRow).toHaveTextContent('foo')
    expect(screen.getByText('Post only')).toBeVisible()
  })
})
