import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { BasicTransferView, locators as basicLocators } from './basic-transfer-view'
import { locators as vegaKeyLocators } from '../../keys/vega-key'
import { locators as amountWithTooltipLocators } from '../utils/string-amounts/amount-with-tooltip'
import { AccountType } from '@vegaprotocol/protos/vega/AccountType'

const mockTransaction = {
  transfer: {
    amount: '10',
    asset: '0'.repeat(64),
    to: '1'.repeat(64),
    fromAccountType: AccountType.ACCOUNT_TYPE_BOND,
    toAccountType: AccountType.ACCOUNT_TYPE_BOND,
    reference: 'reference',
    kind: null
  }
}

describe('BasicTransferView', () => {
  it('renders correctly', () => {
    render(<BasicTransferView transaction={mockTransaction} />)

    expect(screen.getByTestId(basicLocators.basicTransferView)).toBeInTheDocument()
    expect(screen.getByTestId(amountWithTooltipLocators.amountWithTooltip)).toBeInTheDocument()
    expect(screen.getByTestId(amountWithTooltipLocators.amount)).toHaveTextContent('10')
    expect(screen.getByTestId(amountWithTooltipLocators.assetExplorerLink)).toHaveTextContent('000000…0000')
    expect(screen.getByTestId(vegaKeyLocators.keyName)).toHaveTextContent('Receiving Key')
  })
})
