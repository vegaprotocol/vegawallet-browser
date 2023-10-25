import { captureException } from '@sentry/browser'
import { Component, ReactNode } from 'react'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { CodeWindow } from '../../code-window'
import { VegaSection } from '../../vega-section'
import { CollapsiblePanel } from '../../collapsible-panel'

interface State {
  error: Error | null
}

interface Props {
  children?: ReactNode
}

export class ReceiptViewErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  public componentDidCatch(error: Error) {
    captureException(error)
  }

  public render() {
    // This error is caught by the boundary
    const { error } = this.state

    if (error) {
      return (
        <VegaSection>
          <Notification
            intent={Intent.Danger}
            message={
              'An unexpected error occurred when rendering transaction receipt view. Please check your transaction has a valid format and data.'
            }
          />
          <div className="mt-6">
            <CollapsiblePanel
              title="Error details"
              panelContent={<CodeWindow content={error.stack} text={error.stack ?? ''} />}
            />
          </div>
        </VegaSection>
      )
    }

    return this.props.children
  }
}
