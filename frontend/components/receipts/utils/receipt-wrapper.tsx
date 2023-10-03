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
  children: ReactNode,
  errors: Error[]
) => {
  if (loading) return <>{loadingState}</>
  if (hasError)
    return (
      <>
        {unenrichedState}
        <div className="mt-4">
          <Notification
            intent={Intent.Danger}
            title="Error loading data"
            message="An error ocurred when trying to load additional data to display your transaction. The transaction can still be sent, but old trascation data can be shown."
            buttonProps={{
              action: () => navigator.clipboard.writeText(errors.map(e => e.stack).join('. \n')),
              text: 'Copy error message(s)'
            }}
          />
        </div>
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
  const { loading: walletsLoading } = useWalletStore((state) => ({ loading: state.loading }))
  const isLoading = [assetsLoading, marketsLoading, walletsLoading].some(Boolean)
  const errors = [assetsError, marketsError].filter(Boolean)
  const hasError = errors.some(Boolean)
  const content = getContent(loadingState, isLoading, hasError, unenrichedState, children, errors)
  return (
    <VegaSection>
      <section data-testid={locators.receiptWrapper}>{content}</section>
    </VegaSection>
  )
}
