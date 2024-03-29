import { render, screen } from '@testing-library/react'

import { locators as dataTableLocators } from '../../../data-table'
import { locators, Submission, SubmissionView } from '.'

describe('SubmissionReceipt', () => {
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
    // 1118-ORDS-001 I can see the order table
    // 1118-ORDS-002 I can see any relevant order badges
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
    const [referenceRow] = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(referenceRow).toHaveTextContent('foo')
    expect(screen.getByText('Post only')).toBeVisible()
  })
  it('submission view renders iceberg message if order type is iceberg', () => {
    render(
      <SubmissionView
        orderSubmission={{
          icebergOpts: {
            displayQty: '1',
            totalQty: '2'
          }
        }}
      />
    )
    expect(screen.getByTestId(locators.icebergMessage)).toHaveTextContent(
      'Iceberg Order, see raw JSON for more information'
    )
  })
})
