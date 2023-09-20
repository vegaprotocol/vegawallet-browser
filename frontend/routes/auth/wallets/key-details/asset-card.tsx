import { AccountType } from '@vegaprotocol/types'
import { useAssetsStore } from '../../../../stores/assets-store'
import { VegaAccount } from '../../../../types/rest-api'
import { addDecimalsFormatNumber, formatNumber, toBigNum } from '@vegaprotocol/utils'
import { CollapsiblePanel } from '../../../../components/collapsible-panel'
import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { useMarketsStore } from '../../../../stores/markets-store'
import { DataTable } from '../../../../components/data-table/data-table'
import BigNumber from 'bignumber.js'

export const ACCOUNT_TYPE_MAP = {
  [AccountType.ACCOUNT_TYPE_INSURANCE]: 'Insurance',
  [AccountType.ACCOUNT_TYPE_SETTLEMENT]: 'Settlement',
  [AccountType.ACCOUNT_TYPE_MARGIN]: 'Margin',
  [AccountType.ACCOUNT_TYPE_GENERAL]: 'General',
  [AccountType.ACCOUNT_TYPE_FEES_INFRASTRUCTURE]: 'Fees (infra)',
  [AccountType.ACCOUNT_TYPE_FEES_LIQUIDITY]: 'Fees (liquidity)',
  [AccountType.ACCOUNT_TYPE_FEES_MAKER]: 'Fees (maker)',
  [AccountType.ACCOUNT_TYPE_BOND]: 'Bond',
  [AccountType.ACCOUNT_TYPE_EXTERNAL]: 'External',
  [AccountType.ACCOUNT_TYPE_GLOBAL_INSURANCE]: 'Global insurance',
  [AccountType.ACCOUNT_TYPE_GLOBAL_REWARD]: 'Global reward',
  [AccountType.ACCOUNT_TYPE_PENDING_TRANSFERS]: 'Pending transfers',
  [AccountType.ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES]: 'Maker paid fees',
  [AccountType.ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES]: 'Maker received fees',
  [AccountType.ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES]: 'LP received fees',
  [AccountType.ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS]: 'Market proposers'
}

const CurrentMarkets = ({ assetId }: { assetId: string }) => {
  const { getMarketsByAssetId, markets: m } = useMarketsStore((state) => ({
    getMarketsByAssetId: state.getMarketsByAssetId,
    markets: state.markets
  }))
  const markets = getMarketsByAssetId(assetId)

  const top5Markets = markets.slice(0, 5)
  return (
    <div className="text-left">
      <p className="mb-1 text-sm">Currently traded in:</p>
      {top5Markets.map((m) => (
        <span key={m.id} className="text-xs">
          <Lozenge>{m.tradableInstrument?.instrument?.name}</Lozenge>
        </span>
      ))}
    </div>
  )
}

const AssetHeader = ({
  symbol,
  name,
  accounts,
  decimals,
  assetId
}: {
  symbol: string
  name: string
  accounts: VegaAccount[]
  decimals: number
  assetId: string
}) => {
  const total = accounts.reduce((acc, { balance }) => acc.plus(toBigNum(balance ?? '0', decimals)), new BigNumber(0))

  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between w-full">
        <div className="text-left">
          <div className="text-white">{symbol}</div>
          <div>{name}</div>
        </div>
        <div className="text-right text-white">{formatNumber(total)}</div>
      </div>
      <CurrentMarkets assetId={assetId} />
    </div>
  )
}

export const AssetCard = ({ accounts, assetId }: { accounts: VegaAccount[]; assetId: string }) => {
  const { getAssetById } = useAssetsStore()
  const asset = getAssetById(assetId)
  const { details: { decimals, symbol, name } = {} } = asset
  if (!decimals || !symbol || !name) throw new Error('Asset details not populated')
  const filteredAccounts = accounts
    .filter((a) => !!a.balance && toBigNum(a.balance, +decimals).gt(0))
    .map((a) => [
      // TODO how do we handle differences between VegaTypes (from FE mono) and the VegaTypes from REST?
      ACCOUNT_TYPE_MAP[a.type as unknown as AccountType],
      addDecimalsFormatNumber(a.balance ?? 0, +decimals)
    ]) as [string, string][]
  return (
    <div className="border border-vega-dark-150 mb-4">
      <CollapsiblePanel
        title={<AssetHeader assetId={assetId} symbol={symbol} name={name} decimals={+decimals} accounts={accounts} />}
        panelContent={
          <div>
            <DataTable items={filteredAccounts} />
          </div>
        }
      />
    </div>
  )
}
