import { render, screen } from '@testing-library/react'
import { ReceiptWrapper, locators } from './receipt-wrapper'
import { mockStore } from '../../../test-helpers/mock-store'
import { useAssetsStore } from '../../../stores/assets-store'
import { useMarketsStore } from '../../../stores/markets-store'

jest.mock('../../../stores/assets-store')
jest.mock('../../../stores/markets-store')

describe('ReceiptView', () => {
  it('should render vega section, title and children', () => {
    mockStore(useAssetsStore, {})
    mockStore(useMarketsStore, {})
    render(
      <ReceiptWrapper>
        <div>Child</div>
      </ReceiptWrapper>
    )
    expect(screen.getByTestId(locators.receiptWrapper)).toBeInTheDocument()
    expect(screen.getByText('Child')).toBeInTheDocument()
  })

  it('should render notification when an error is passed in', () => {
    mockStore(useAssetsStore, {})
    mockStore(useMarketsStore, {})
    render(
      <ReceiptWrapper errors={[new Error('Some error')]}>
        <div>Child</div>
      </ReceiptWrapper>
    )
    expect(screen.getByTestId(locators.receiptWrapperError)).toBeInTheDocument()
    expect(screen.getByTestId(locators.receiptWrapperError)).toHaveTextContent('Error loading data')
    expect(screen.getByTestId(locators.receiptWrapperError)).toHaveTextContent(
      'Additional data to display your transaction could not be loaded. The transaction can still be sent, but only transaction data can be shown.'
    )
    expect(screen.getByTestId(locators.receiptWrapperError)).toHaveTextContent('Copy error message(s)')
  })

  it('should render notification if there was a problem loading assets', () => {
    mockStore(useAssetsStore, { error: new Error('Some error') })
    mockStore(useMarketsStore, { error: null })
    render(
      <ReceiptWrapper errors={[]}>
        <div>Child</div>
      </ReceiptWrapper>
    )
    expect(screen.getByTestId(locators.receiptWrapperError)).toBeInTheDocument()
  })

  it('should render notification if there was a problem loading markets', () => {
    mockStore(useAssetsStore, { error: null })
    mockStore(useMarketsStore, { error: new Error('Some error') })
    render(
      <ReceiptWrapper errors={[]}>
        <div>Child</div>
      </ReceiptWrapper>
    )
    expect(screen.getByTestId(locators.receiptWrapperError)).toBeInTheDocument()
  })
})
