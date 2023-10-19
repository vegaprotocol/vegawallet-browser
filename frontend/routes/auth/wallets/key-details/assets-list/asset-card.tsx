import { useAssetsStore } from '../../../../../stores/assets-store'
import { addDecimalsFormatNumber, formatNumber, toBigNum } from '@vegaprotocol/utils'
import { DataTable } from '../../../../../components/data-table/data-table'
import BigNumber from 'bignumber.js'
import { CollapsibleCard } from '../../../../../components/collapsible-card'
import { MarketLozenges } from './markets-lozenges'
import { vegaAccount, vegaAccountType } from '@vegaprotocol/rest-clients/dist/trading-data'
import get from 'lodash/get'

export const ACCOUNT_TYPE_MAP: Record<vegaAccountType, string> = {
  [vegaAccountType.ACCOUNT_TYPE_INSURANCE]: 'Insurance',
  [vegaAccountType.ACCOUNT_TYPE_SETTLEMENT]: 'Settlement',
  [vegaAccountType.ACCOUNT_TYPE_MARGIN]: 'Margin',
  [vegaAccountType.ACCOUNT_TYPE_GENERAL]: 'General',
  [vegaAccountType.ACCOUNT_TYPE_FEES_INFRASTRUCTURE]: 'Fees (infra)',
  [vegaAccountType.ACCOUNT_TYPE_FEES_LIQUIDITY]: 'Fees (liquidity)',
  [vegaAccountType.ACCOUNT_TYPE_FEES_MAKER]: 'Fees (maker)',
  [vegaAccountType.ACCOUNT_TYPE_BOND]: 'Bond',
  [vegaAccountType.ACCOUNT_TYPE_EXTERNAL]: 'External',
  [vegaAccountType.ACCOUNT_TYPE_GLOBAL_INSURANCE]: 'Global insurance',
  [vegaAccountType.ACCOUNT_TYPE_GLOBAL_REWARD]: 'Global reward',
  [vegaAccountType.ACCOUNT_TYPE_PENDING_TRANSFERS]: 'Pending transfers',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES]: 'Maker paid fees',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES]: 'Maker received fees',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES]: 'LP received fees',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS]: 'Market proposers',
  [vegaAccountType.ACCOUNT_TYPE_UNSPECIFIED]: 'Unspecified',
  [vegaAccountType.ACCOUNT_TYPE_HOLDING]: 'Holding',
  [vegaAccountType.ACCOUNT_TYPE_LP_LIQUIDITY_FEES]: 'LP liquidity fees',
  [vegaAccountType.ACCOUNT_TYPE_LIQUIDITY_FEES_BONUS_DISTRIBUTION]: '',
  [vegaAccountType.ACCOUNT_TYPE_NETWORK_TREASURY]: 'Network treasury',
  [vegaAccountType.ACCOUNT_TYPE_VESTING_REWARDS]: 'Vesting rewards',
  [vegaAccountType.ACCOUNT_TYPE_VESTED_REWARDS]: 'Vested rewards',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_AVERAGE_POSITION]: 'Average position rewards',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_RELATIVE_RETURN]: 'Relative return rewards',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_RETURN_VOLATILITY]: 'Volatility rewards',
  [vegaAccountType.ACCOUNT_TYPE_REWARD_VALIDATOR_RANKING]: 'Validator ranking rewards',
  [vegaAccountType.ACCOUNT_TYPE_PENDING_FEE_REFERRAL_REWARD]: 'Pending fee referral rewards'
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
  decimals
}: {
  symbol: string
  name: string
  accounts: vegaAccount[]
  decimals: number
}) => {
  const total = accounts.reduce((acc, { balance }) => acc.plus(toBigNum(balance ?? '0', decimals)), new BigNumber(0))
  return (
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
  )
}

export const AssetCard = ({
  accounts,
  assetId,
  allowZeroAccounts = false
}: {
  accounts: vegaAccount[]
  assetId: string
  allowZeroAccounts?: boolean
}) => {
  const { getAssetById } = useAssetsStore((state) => ({
    getAssetById: state.getAssetById
  }))
  const asset = getAssetById(assetId)
  const symbol = get(asset, 'details.symbol')
  const name = get(asset, 'details.name')
  const decimals = get(asset, 'details.decimals')

  if (!decimals || !symbol || !name) throw new Error('Asset details not populated')
  const filteredAccounts = accounts
    .filter((a) => allowZeroAccounts || (!!a.balance && toBigNum(a.balance, +decimals).gt(0)))
    .map((a) => [
      a.type ? ACCOUNT_TYPE_MAP[a.type] : 'Unknown',
      addDecimalsFormatNumber(a.balance ?? 0, +decimals)
    ]) as [string, string][]
  return (
    <div className="border border-vega-dark-150 mb-4">
      <CollapsibleCard
        title={<AssetHeader symbol={symbol} name={name} decimals={+decimals} accounts={accounts} />}
        cardContent={
          <div className="overflow-hidden">
            <DataTable items={filteredAccounts} />
            <MarketLozenges assetId={assetId} />
          </div>
        }
      />
    </div>
  )
}
