import { ReactNode } from 'react'
import { VegaSection } from '../../vega-section'
import { useAssetsStore } from '../../../stores/assets-store'
import { useWalletStore } from '../../../stores/wallets'
import { useMarketsStore } from '../../../stores/markets-store'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'

export const locators = {
  receiptWrapper: 'receipt-wrapper'
}

const getContent = (
  loadingState: ReactNode,
  loading: boolean,
  hasError: boolean,
  unenrichedState: ReactNode,
  children: ReactNode
) => {
  if (loading) return <>{loadingState}</>
  if (hasError)
    return (
      <>
        {unenrichedState}
        <Notification
          intent={Intent.Danger}
          title="Error loading data"
          message="An error ocurred when trying to load additional data to display your transaction. The transaction can still be sent, but additional data cannot be shown."
          buttonProps={{
            action: () => console.log('Copy errors'),
            text: 'Copy error message(s)'
          }}
        />
      </>
    )
  return <>{children}</>
}

export const ReceiptWrapper = ({
  children,
  loadingState,
  unenrichedState
}: {
  children: ReactNode
  loadingState?: ReactNode
  unenrichedState?: ReactNode
}) => {
  const { loading: assetsLoading, error: assetsError } = useAssetsStore((state) => ({
    loading: state.loading,
    error: state.error
  }))
  const { loading: marketsLoading, error: marketsError } = useMarketsStore((state) => ({
    loading: state.loading,
    error: state.error
  }))
  // We check whether wallets are loading as wallet data is used to enrich the transfer view
  const { loading: walletsLoading } = useWalletStore((state) => ({ loading: state.loading }))
  const isLoading = [assetsLoading, marketsLoading, walletsLoading].some(Boolean)
  const errors = [assetsError, marketsError].filter(Boolean)
  const hasError = errors.some(Boolean)
  const content = getContent(loadingState, isLoading, hasError, unenrichedState, children)

  return (
    <VegaSection>
      <section data-testid={locators.receiptWrapper}>{content}</section>
    </VegaSection>
  )
}
