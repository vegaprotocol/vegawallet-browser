import { ComponentType } from 'react'
import { useErrorStore } from '../../stores/error'

export interface ErrorProps {
  error: Error | null
  setError: (error: Error | null) => void
}

export function withErrorStore<P extends ErrorProps>(Component: ComponentType<P>) {
  const Wrapper = (props: Omit<P, keyof ErrorProps>) => {
    const errorProps = useErrorStore((state) => ({
      setError: state.setError,
      error: state.error
    }))

    return <Component {...errorProps} {...(props as P)} />
  }

  return Wrapper
}
