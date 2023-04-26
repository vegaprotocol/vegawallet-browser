import { useState } from 'react'
import { Show } from '../icons/show'
import { CopyWithCheckmark } from '../copy-with-check'
import { Hide } from '../icons/hide'
import locators from '../locators'

export const MnemonicContainer = ({ mnemonic }: { mnemonic: string }) => {
  const [showMnemonic, setShowMnemonic] = useState(false)
  return showMnemonic ? (
    <div data-testid={locators.mnemonicContainer}>
      <code className="flex justify-center items-center w-full border border-vega-dark-200 rounded-md p-6 text-left overflow-y-scroll overflow-x-scroll w-full scrollbar-hide">
        {mnemonic}
      </code>
      <div className="text-vega-dark-300 flex justify-between">
        <CopyWithCheckmark text={mnemonic} iconSide="left">
          Copy to clipboard
        </CopyWithCheckmark>
        <div
          role="button"
          onClick={() => setShowMnemonic(false)}
          className="flex justify-between items-center"
        >
          <Hide />
          <span className="ml-3">Hide</span>
        </div>
      </div>
    </div>
  ) : (
    <div
      role="button"
      onClick={() => setShowMnemonic(true)}
      className="flex justify-center items-center w-full border border-vega-dark-200 rounded-md p-6"
    >
      <div className="flex flex-col items-center">
        <Show />
        Reveal recovery phrase
      </div>
    </div>
  )
}
