import { ReactNode, useCallback, useState } from 'react'
import { useModalStore } from '../../lib/modal-store'
import { Splash } from '../splash'
import { CodeWindow } from '../code-window'
import { Button, truncateMiddle } from '@vegaprotocol/ui-toolkit'
import { ListItem } from '../list'
import { CollapsiblePanel } from '../collapsible-panel'
import { formatDate } from '../../lib/date'
import locators from '../locators'
import { PageHeader } from '../page-header'

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
  hostname: 'vega.xyz',
  wallet: 'test-wallet',
  publicKey: '3fd42fd5ceb22d99ac45086f1d82d516118a5cb7ad9a2e096cd78ca2c8960c80',
  transaction: JSON.stringify(transaction),
  receivedAt: new Date().toISOString()
}

const TransactionDetailsItem = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <div>
      <div className="text-dark-300 uppercase">{title}</div>
      <div>{children}</div>
    </div>
  )
}

export const TransactionModal = () => {
  const hostname = 'https://www.google.com'
  const { isOpen, setIsOpen } = useModalStore((store) => ({
    isOpen: store.transactionModalOpen,
    setIsOpen: store.setTransactionModalOpen
  }))
  const [isLoading, setIsLoading] = useState(false)
  const handleDecision = useCallback(
    (decision: boolean) => {
      if (decision) {
        setIsLoading(true)
      }
      setIsOpen(false)
    },
    [setIsOpen]
  )

  if (!isOpen) return null
  return (
    <Splash data-testid={locators.transactionWrapper}>
      <section className="pb-4">
        <PageHeader />
        <p className="text-center text-lg">
          Signing with key {data.wallet} ({truncateMiddle(data.publicKey)})
        </p>
        <ul>
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <CollapsiblePanel
                title="Details"
                initiallyOpen={true}
                panelContent={
                  <CodeWindow
                    text={JSON.stringify(JSON.parse(data.transaction), null, '  ')}
                    content={JSON.stringify(JSON.parse(data.transaction), null, '  ')}
                  />
                }
              />
            )}
          />
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <TransactionDetailsItem title="Received At">
                {formatDate(new Date(data.receivedAt))}
              </TransactionDetailsItem>
            )}
          />
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <TransactionDetailsItem title="Received At">
                {formatDate(new Date(data.receivedAt))}
              </TransactionDetailsItem>
            )}
          />
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <TransactionDetailsItem title="Received At">
                {formatDate(new Date(data.receivedAt))}
              </TransactionDetailsItem>
            )}
          />
        </ul>
        <div className="grid grid-cols-[1fr_1fr] justify-between gap-4 mt-5">
          <Button
            data-testid={locators.transactionModalApproveButton}
            disabled={!!isLoading}
            onClick={() => handleDecision(false)}
          >
            Deny
          </Button>
          <Button
            data-testid={locators.transactionModalDenyButton}
            variant="primary"
            disabled={!!isLoading}
            onClick={() => handleDecision(true)}
          >
            Approve
          </Button>
        </div>
      </section>
    </Splash>
  )
}
