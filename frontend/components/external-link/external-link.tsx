import { Link, VegaIcon, VegaIconNames, ExternalLink as ExLink } from '@vegaprotocol/ui-toolkit'
import classNames from 'classnames'
import { AnchorHTMLAttributes, ReactNode } from 'react'
import { useGlobalsStore } from '../../stores/globals'
import { getExtensionApi } from '../../lib/extension-apis'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children?: ReactNode
}

const MobileLink = ({ children, className, href, ...props }: LinkProps) => {
  const openInNewTab = () => {
    const api = getExtensionApi()
    api.tabs.create({ url: href })
    window.history.back()
  }
  return (
    <Link
      onClick={openInNewTab}
      className={classNames('inline-flex items-center gap-1 underline-offset-4', className)}
      {...props}
    >
      {typeof children === 'string' ? (
        <>
          <span className={classNames({ underline: typeof children === 'string' })}>{children}</span>
          <VegaIcon name={VegaIconNames.OPEN_EXTERNAL} size={13} />
        </>
      ) : (
        children
      )}
    </Link>
  )
}

export const ExternalLink = ({ children, className, ...props }: LinkProps) => {
  const isMobile = useGlobalsStore((state) => state.isMobile)
  return isMobile ? (
    <MobileLink className={className} {...props}>
      {children}
    </MobileLink>
  ) : (
    <ExLink className={className} {...props}>
      {children}
    </ExLink>
  )
}
