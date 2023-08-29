import { ComponentType } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'

export interface RouterProps {
  navigate: NavigateFunction
}

export function withRouter<P extends RouterProps>(Component: ComponentType<P>) {
  const Wrapper = (props: Omit<P, keyof RouterProps>) => {
    const navigate = useNavigate()
    const routerProps = { navigate }

    return <Component {...routerProps} {...(props as P)} />
  }

  return Wrapper
}
