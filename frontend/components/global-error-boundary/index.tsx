import { Component, ComponentType, ErrorInfo, ReactNode } from 'react'
import { ErrorModal } from '../modals/error-modal'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes/route-names'
import { useErrorStore } from '../../stores/error'
import { captureException } from '@sentry/react'

interface RouterProps {
  navigate: NavigateFunction
}

interface ErrorProps {
  error: Error | null
  setError: (error: Error | null) => void
}

function withRouter<P extends RouterProps>(Component: ComponentType<P>) {
  const Wrapper = (props: Omit<P, keyof RouterProps>) => {
    const navigate = useNavigate()
    const routerProps = { navigate }

    return <Component {...routerProps} {...(props as P)} />
  }

  return Wrapper
}

function withErrorStore<P extends ErrorProps>(Component: ComponentType<P>) {
  const Wrapper = (props: Omit<P, keyof ErrorProps>) => {
    const errorProps = useErrorStore((state) => ({
      setError: state.setError,
      error: state.error
    }))

    return <Component {...errorProps} {...(props as P)} />
  }

  return Wrapper
}

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
