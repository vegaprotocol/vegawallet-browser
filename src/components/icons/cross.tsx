import classnames from 'classnames'

import { className as defaultClassName } from './style'

export function Cross({ className }: { className?: string }) {
  return (
    <svg
      className={classnames(defaultClassName, className)}
      viewBox="0 0 45 45"
    >
      <path d="M14 14L30 30" stroke="currentColor" strokeWidth="1.3"></path>
      <path d="M30 14L14 30" stroke="currentColor" strokeWidth="1.3"></path>
    </svg>
  )
}
