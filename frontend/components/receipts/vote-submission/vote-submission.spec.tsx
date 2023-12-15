import { render, screen } from '@testing-library/react'
import { vegaVoteValue } from '@vegaprotocol/rest-clients/dist/trading-data'

import config from '!/config'
import { locators as dataTableLocators } from '@/components/data-table/data-table'

import { locators } from '../utils/vega-entities/proposal-link'
import { VoteSubmission } from './vote-submission'

jest.mock('../utils/receipt-wrapper', () => ({
  ReceiptWrapper: ({ children }: { children: React.ReactNode }) => {
    return <div data-testid="receipt-wrapper">{children}</div>
  }
}))

describe('VoteSubmission', () => {
  it('renders proposalId with link and value', () => {
    render(
      <VoteSubmission
        transaction={{
          voteSubmission: {
            proposalId: '1'.repeat(64),
            value: vegaVoteValue.VALUE_YES
          }
        }}
      />
    )
    const rows = screen.getAllByTestId(dataTableLocators.dataRow)
    expect(rows[0]).toHaveTextContent('111111…1111')
    expect(rows[0]).toHaveTextContent('Proposal Id')
    expect(rows[1]).toHaveTextContent('Value')
    expect(rows[1]).toHaveTextContent('For')

    expect(screen.getByTestId(locators.proposalLink)).toHaveAttribute(
      'href',
      `${config.network.governance}/proposals/${'1'.repeat(64)}`
    )
  })
})
