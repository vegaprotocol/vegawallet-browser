import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
// @ts-ignore
import CopyToClipboard from 'react-copy-to-clipboard'

import { Copy } from '../icons/copy'
import { Tick } from '../icons/tick'
import locators from '../locators'

interface CopyWithCheckmarkProps {
  children?: ReactNode
  text: string
  iconSide?: 'left' | 'right'
}

export function CopyWithCheckmark({ text, children, iconSide = 'right' }: CopyWithCheckmarkProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false)
      }, 800)
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [copied])

  const content =
    iconSide === 'right' ? (
      <>
        {children}
        {copied ? <Tick className="w-4 ml-3 text-vega-green-550" /> : <Copy className="w-4 ml-3" />}
      </>
    ) : (
      <>
        {copied ? <Tick className="w-4 text-vega-green-550" /> : <Copy className="w-4" />}
        <span className="ml-3">{children}</span>
      </>
    )

  return (
    <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
      <span data-testid={locators.copyWithCheck} className="cursor-pointer">
        {content}
      </span>
    </CopyToClipboard>
  )
}
