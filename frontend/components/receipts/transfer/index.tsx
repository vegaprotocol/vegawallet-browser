import { truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { CopyWithCheckmark } from '../../copy-with-check'
import { KeyIcon } from '../../key-icon'

export const Transfer = ({ transaction }: { transaction: any }) => {
  // Not supporting recurring transfers yet
  if (transaction.transfer.recurring) return null
  return (
    <section>
      <h1 className="text-vega-dark-300">Transfer</h1>
      <div className="flex text-lg mb-4">
        <div className="mr-2">0.0182199822</div>
        <div className="text-vega-dark-300">tDAI</div>
      </div>
      <h1 className="text-vega-dark-300">To</h1>
      <div className="flex items-center mb-4">
        <KeyIcon publicKey={transaction.transfer.to} />
        <div className="ml-4">
          <div>Receiving Key</div>
          <p>
            <CopyWithCheckmark text={transaction.transfer.to}>
              <span className="underline text-vega-dark-400">{truncateMiddle(transaction.transfer.to)}</span>
            </CopyWithCheckmark>
          </p>
        </div>
      </div>
      <h1 className="text-vega-dark-300">When</h1>
      <p>Now</p>
    </section>
  )
}
