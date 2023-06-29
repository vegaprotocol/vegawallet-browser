import { Component, ComponentType, ErrorInfo, ReactNode } from 'react'
import { ErrorModal } from '../error-modal'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { FULL_ROUTES } from '../../routes/route-names'
import { useErrorStore } from '../../stores/error'

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
    const setError = useErrorStore((state) => ({
      setError: state.setError
    }))
    const errorProps = { setError }

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
    // TODO log to sentry!!
  }

  public render() {
    // This error is caught by the boundary
    const { error } = this.state
    // This error is reported from backend interactions, which are async
    // and as such not caught by the global error boundary
    const { error: storeError } = this.props
    if (error || storeError) {
      const err = error || storeError
      // If this is a reported error then ensure this component is also aware of it
      this.setState({ error: err })
      this.props.setError(err)
      return (
        <ErrorModal
          error={err}
          onClose={() => {
            this.setState({ error: null })
            this.props.setError(null)
            this.props.navigate(FULL_ROUTES.home)
          }}
        />
      )
    }

    return this.props.children
  }
}

export default withErrorStore(withRouter(GlobalErrorBoundary))
