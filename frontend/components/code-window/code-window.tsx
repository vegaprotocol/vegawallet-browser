import type { ReactNode } from 'react'
import { CopyWithCheckmark } from '../copy-with-check'
import locators from '../locators'

export const CodeWindow = ({ content, text }: { content: ReactNode; text: string }) => {
  return (
    <div
      data-testid={locators.codeWindow}
      className="mt-3 whitespace-pre max-h-60 flex p-4 rounded-md w-full border bg-black border-vega-dark-200"
    >
      <code
        data-testid={locators.codeWindowContent}
        className="text-left overflow-y-scroll overflow-x-scroll w-full scrollbar-hide"
      >
        {content}
      </code>
      <CopyWithCheckmark text={text} />
    </div>
  )
}
