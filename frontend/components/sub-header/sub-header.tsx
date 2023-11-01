import classNames from 'classnames'
import { HTMLAttributes, ReactNode } from 'react'

export const locators = {
  subHeader: 'sub-header'
}

interface SubHeaderProps extends HTMLAttributes<HTMLHeadingElement> {
  content: ReactNode
}

export const SubHeader = ({ content, className, ...rest }: SubHeaderProps) => {
  return (
    <h1
      data-testid={locators.subHeader}
      {...rest}
      className={classNames('text-vega-dark-300 text-sm uppercase', className)}
    >
      {content}
    </h1>
  )
}
