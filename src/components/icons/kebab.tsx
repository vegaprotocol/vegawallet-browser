import classnames from 'classnames'

import { className as defaultClassName } from './style'

export function Kebab({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={classnames(defaultClassName, className)}
    >
      <g id="more_3_">
        <circle cx="2" cy="8.03" r="2" />
        <circle cx="14" cy="8.03" r="2" />
        <circle cx="8" cy="8.03" r="2" />
      </g>
    </svg>
  )
}
