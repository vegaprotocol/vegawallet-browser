import { AccountType } from '@vegaprotocol/types'
import { useAssetsStore } from '../../../../stores/assets-store'
import { Apiv1Account } from '../../../../types/rest-api'
import { addDecimalsFormatNumber, formatNumber, toBigNum } from '@vegaprotocol/utils'
import { DataTable } from '../../../../components/data-table/data-table'
import BigNumber from 'bignumber.js'
import { CollapsibleCard } from '../../../../components/collapsible-card'
import { MarketLozenges } from './markets-lozenges'

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

export const locators = {
  assetHeaderSymbol: 'asset-header-symbol',
  assetHeaderName: 'asset-header-name',
  assetHeaderTotal: 'asset-header-total'
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
  accounts: Apiv1Account[]
  decimals: number
  assetId: string
}) => {
  const total = accounts.reduce((acc, { balance }) => acc.plus(toBigNum(balance ?? '0', decimals)), new BigNumber(0))
  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full">
        <div className="text-left">
          <div data-testid={locators.assetHeaderSymbol} className="text-white">
            {symbol}
          </div>
          <div data-testid={locators.assetHeaderName} className="text-sm">
            {name}
          </div>
        </div>
        <div data-testid={locators.assetHeaderTotal} className="text-right text-white">
          {formatNumber(total, decimals)}
        </div>
      </div>
      <MarketLozenges assetId={assetId} />
    </div>
  )
}

export const AssetCard = ({ accounts, assetId }: { accounts: Apiv1Account[]; assetId: string }) => {
  const { getAssetById } = useAssetsStore((state) => ({
    getAssetById: state.getAssetById
  }))
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
      <CollapsibleCard
        title={<AssetHeader assetId={assetId} symbol={symbol} name={name} decimals={+decimals} accounts={accounts} />}
        cardContent={<DataTable items={filteredAccounts} />}
      />
    </div>
  )
}
