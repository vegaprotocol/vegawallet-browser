import { VegaSection } from '../../vega-section'
import { CodeWindow } from '../../code-window'
import { Transaction } from '../../../lib/transactions'
import { CollapsiblePanel } from '../../collapsible-panel'

export const RawTransaction = ({ transaction }: { transaction: Transaction }) => {
  return (
    <VegaSection>
      <CollapsiblePanel
        title="View raw Transaction"
        initiallyOpen={true}
        panelContent={
          <CodeWindow
            text={JSON.stringify(transaction, null, '  ')}
            content={JSON.stringify(transaction, null, '  ')}
          />
        }
      />
    </VegaSection>
  )
}
