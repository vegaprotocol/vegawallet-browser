import { useState } from 'react'
import { Show } from '../icons/show'
import { CopyWithCheckmark } from '../copy-with-check'
import { Hide } from '../icons/hide'
import locators from '../locators'

export const MnemonicContainer = ({ mnemonic, onChange }: { mnemonic: string; onChange: (show: boolean) => void }) => {
  const [showMnemonic, setShowMnemonic] = useState(false)
  return showMnemonic ? (
    <div data-testid={locators.mnemonicContainerShown}>
      <code
        data-testid={locators.mnemonicContainerMnemonic}
        className="flex justify-center items-center w-full border border-vega-dark-200 rounded-md p-6 text-left overflow-y-auto overflow-x-auto w-full scrollbar-hide"
      >
        {mnemonic}
      </code>
      <div className="text-vega-dark-300 flex justify-between">
        <CopyWithCheckmark text={mnemonic} iconSide="left">
          Copy to clipboard
        </CopyWithCheckmark>
        <button
          onClick={() => {
            setShowMnemonic(false)
            onChange(false)
          }}
          className="flex justify-between items-center"
        >
          <Hide />
          <span className="ml-3">Hide</span>
        </button>
      </div>
    </div>
  ) : (
    <button
      autoFocus
      data-testid={locators.mnemonicContainerHidden}
      onClick={() => {
        setShowMnemonic(true)
        onChange(true)
      }}
      className="flex justify-center items-center w-full border border-vega-dark-200 rounded-md p-6"
    >
      <div className="flex flex-col items-center">
        <Show />
        Reveal recovery phrase
      </div>
    </button>
  )
}
