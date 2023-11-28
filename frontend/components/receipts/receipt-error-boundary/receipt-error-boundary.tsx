import { captureException } from '@sentry/browser'
import { Intent, Notification } from '@vegaprotocol/ui-toolkit'
import { Component, ReactNode } from 'react'

import { CodeWindow } from '../../code-window'
import { CollapsiblePanel } from '../../collapsible-panel'
import { VegaSection } from '../../vega-section'

interface State {
  error: Error | null
}

interface Properties {
  children?: ReactNode
}

export class ReceiptViewErrorBoundary extends Component<Properties, State> {
  constructor(properties: Properties) {
    super(properties)
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
              "Your transaction receipt can't be shown. View the raw transaction to verify that you want to send this transaction."
            }
          />
          <div className="mt-6">
            <CollapsiblePanel
              title="Error details"
              panelContent={<CodeWindow content={error.stack ?? error.message} text={error.stack ?? error.message} />}
            />
          </div>
        </VegaSection>
      )
    }

    return this.props.children
  }
}
