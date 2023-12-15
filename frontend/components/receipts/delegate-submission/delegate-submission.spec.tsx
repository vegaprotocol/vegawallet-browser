import { render, screen } from '@testing-library/react'

import config from '!/config'
import { locators as dataTableLocators } from '@/components/data-table/data-table'

import { locators } from '../utils/vega-entities/proposal-link'
import { DelegateSubmission } from './delegate-submission'

jest.mock('../utils/receipt-wrapper', () => ({
  ReceiptWrapper: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="receipt-wrapper">{children}</div>
  }
}))

describe('DelegateSubmission', () => {
  it('render nodeId and', () => {
    render(
      <DelegateSubmission
        transaction={{
          delegateSubmission: {
            nodeId: '1'.repeat(64),
            amount: '1' + '0'.repeat(18)
          }
        }}
      />
    )
    const rows = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(rows[0]).toHaveTextContent('111111…1111')
    expect(rows[0]).toHaveTextContent('Node Id')

    expect(rows[1]).toHaveTextContent('Amount')
    expect(rows[1]).toHaveTextContent('1')
    expect(rows[1]).toHaveTextContent('VEGA')

    expect(screen.getByTestId(locators.proposalLink)).toHaveAttribute(
      'href',
      `${config.network.governance}/validators/${'1'.repeat(64)}`
    )
  })
})
