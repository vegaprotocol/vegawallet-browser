import { BasePage } from '@/components/pages/page'
import { PartyLink } from '@/components/vega-entities/party-link'
import { useWalletStore } from '@/stores/wallets'

export const locators = {
  transactions: 'transactions',
  transactionsDescription: 'transactions-description'
}

export const Transactions = () => {
  const { wallets } = useWalletStore((state) => ({ wallets: state.wallets }))
  const keys = wallets.flatMap((wallet) => wallet.keys)
  return (
    <BasePage dataTestId={locators.transactions} title="Transactions">
      <div className="mt-6">
        <p data-testid={locators.transactionsDescription}>View your historical transactions on the block explorer.</p>

        <div className="mt-6">
          {keys.map((key) => (
            <PartyLink key={key.publicKey} publicKey={key.publicKey} text={`View ${key.name} on explorer`} />
          ))}
        </div>
      </div>
    </BasePage>
  )
}
