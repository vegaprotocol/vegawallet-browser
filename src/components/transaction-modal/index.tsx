import { useCallback, useMemo, useState } from 'react'
import { useModalStore } from '../../lib/modal-store'
import { Splash } from '../splash'
import { CodeWindow } from '../code-window'
import { Button, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { CollapsiblePanel } from '../collapsible-panel'
import locators from '../locators'
import { PageHeader } from '../page-header'
import { HostImage } from '../host-image'
import { KeyIcon } from '../key-icon'
import { TRANSACTION_TITLES, TransactionKeys } from '../../lib/transactions'
import ReactTimeAgo from 'react-time-ago'

const transaction = {
  orderSubmission: {
    marketId: '10c7d40afd910eeac0c2cad186d79cb194090d5d5f13bd31e14c49fd1bded7e2',
    price: '0',
    size: '64',
    side: 'SIDE_SELL',
    timeInForce: 'TIME_IN_FORCE_GTT',
    expiresAt: '1678959957494396062',
    type: 'TYPE_LIMIT',
    reference: 'traderbot',
    peggedOrder: {
      reference: 'PEGGED_REFERENCE_BEST_ASK',
      offset: '15'
    }
  }
}

const data = {
  keyName: 'Key 1',
  hostname: 'https://www.google.com',
  wallet: 'test-wallet',
  publicKey: '3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80',
  transaction: transaction,
  receivedAt: '2021-01-01T00:00:00.000Z'
}

export const TransactionModal = () => {
  const { isOpen, setIsOpen } = useModalStore((store) => ({
    isOpen: store.transactionModalOpen,
    setIsOpen: store.setTransactionModalOpen
  }))
  const [isLoading, setIsLoading] = useState(false)
  const handleDecision = useCallback(
    (decision: boolean) => {
      setIsLoading(true)
      setIsOpen(false)
    },
    [setIsOpen]
  )
  const transactionTitle = useMemo(() => {
    return TRANSACTION_TITLES[Object.keys(transaction)[0] as TransactionKeys]
  }, [])
  const date = useMemo(() => new Date(data.receivedAt), [])
  if (!isOpen) return null
  return (
    <>
      <Splash data-testid={locators.transactionWrapper}>
        <section className="pb-4">
          <PageHeader />
          <h1 data-testid={locators.transactionType} className="flex justify-center flex-col text-2xl text-white">
            {transactionTitle}
          </h1>
          <div className="flex items-center mt-6">
            <HostImage size={9} hostname={data.hostname} />
            <div data-testid={locators.transactionRequest} className="ml-4">
              <span className="text-vega-dark-300">Request from</span> {data.hostname}
            </div>
          </div>
          <div className="flex items-center mb-8">
            <KeyIcon publicKey={data.publicKey} />
            <div className="ml-4" data-testid={locators.transactionKey}>
              <div className="text-vega-dark-300">Signing with</div>
              <p>
                {data.keyName}: <span className="text-vega-dark-300">{truncateMiddle(data.publicKey)}</span>
              </p>
            </div>
          </div>
          <CollapsiblePanel
            title="View raw Transaction"
            initiallyOpen={true}
            panelContent={
              <CodeWindow
                text={JSON.stringify(data.transaction, null, '  ')}
                content={JSON.stringify(data.transaction, null, '  ')}
              />
            }
          />
          <div data-testid={locators.transactionTimeAgo} className="text-sm text-vega-dark-300 mt-3 mb-20">
            Received <ReactTimeAgo timeStyle="round" date={date} locale="en-US" />
          </div>
        </section>
      </Splash>
      <div className="fixed bottom-0 grid grid-cols-[1fr_1fr] justify-between gap-4 py-4 bg-black z-20 px-5 border-t border-vega-dark-200">
        <Button
          data-testid={locators.transactionModalDenyButton}
          disabled={!!isLoading}
          onClick={() => handleDecision(false)}
        >
          Reject
        </Button>
        <Button
          data-testid={locators.transactionModalApproveButton}
          variant="primary"
          disabled={!!isLoading}
          onClick={() => handleDecision(true)}
        >
          Confirm
        </Button>
      </div>
    </>
  )
}
