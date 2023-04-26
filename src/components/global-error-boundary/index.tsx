import { Component, ComponentType, ErrorInfo, ReactNode } from "react";
import { ErrorModal } from "../error-modal";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { FULL_ROUTES } from "../../routes";

interface ExtendedProps {
  navigate: NavigateFunction;
}

function withRouter<P extends ExtendedProps>(Component: ComponentType<P>) {
  const Wrapper = (props: Omit<P, keyof ExtendedProps>) => {
    const navigate = useNavigate();
    const routerProps = { navigate };

    return <Component {...routerProps} {...(props as P)} />;
  };

  return Wrapper;
}

interface Props extends ExtendedProps {
  children?: ReactNode;
}

interface State {
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  public static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // TODO log to sentry!!
  }

  public render() {
    const { error } = this.state;
    if (error) {
      // You can render any custom fallback UI
      return (
        <ErrorModal
          error={error}
          onClose={() => {
            this.setState({ error: null });
            this.props.navigate(FULL_ROUTES.home);
          }}
        />
      );
    }

    return this.props.children;
  }
}

export default withRouter(GlobalErrorBoundary);
