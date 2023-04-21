import classnames from 'classnames'

import { className as defaultClassName } from './style'

export function Copy({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 11 11"
      className={classnames(defaultClassName, className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z"
      />
    </svg>
  )
}
