import { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorModal } from '../modals/error-modal'
import { FULL_ROUTES } from '../../routes/route-names'
import { captureException } from '@sentry/react'
import { RouterProps, withRouter } from './with-router'
import { ErrorProps, withErrorStore } from './with-error-store'

interface Props extends RouterProps, ErrorProps {
  children?: ReactNode
}

interface State {
  error: Error | null
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error)
  }

  public render() {
    // This error is caught by the boundary
    const { error } = this.state
    // This error is reported from backend interactions, which are async
    // and as such not caught by the global error boundary
    const { error: storeError } = this.props
    const err = error || storeError

    if (err) {
      // If this is a reported error then ensure this component is also aware of it
      if (!error) this.setState({ error: err })
      if (!storeError) this.props.setError(err)
      return (
        <ErrorModal
          error={err}
          onClose={() => {
            this.setState({ error: null })
            this.props.setError(null)
            this.props.navigate(FULL_ROUTES.wallets)
          }}
        />
      )
    }

    return this.props.children
  }
}

export default withErrorStore(withRouter(GlobalErrorBoundary))
