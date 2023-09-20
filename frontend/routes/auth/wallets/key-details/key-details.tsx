import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { ReactNode, useEffect, useState } from 'react'
import { useAccountsStore } from './accounts-store'
import { CollapsiblePanel } from '../../../../components/collapsible-panel'
import { DataTable } from '../../../../components/data-table/data-table'
import { AccountType } from '@vegaprotocol/types'
import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { addDecimalsFormatNumber, toBigNum, formatNumber } from '@vegaprotocol/utils'
import { Key, useWalletStore } from '../../../../stores/wallets'
import { VegaAccount } from '../../../../types/rest-api'
import { useAssetsStore } from '../../../../stores/assets-store'
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

const AccountList = ({ accounts }: { accounts: VegaAccount[] }) => {
  const items: [ReactNode, ReactNode][] = accounts.map(({ type, balance, decimals }) => [
    ACCOUNT_TYPE_MAP[type] || type,
    addDecimalsFormatNumber(balance, decimals)
  ])
  return (
    <div>
      <DataTable items={items} />
    </div>
  )
}

const AssetHeader = ({
  symbol,
  name,
  accounts,
  decimals
}: {
  symbol: string
  name: string
  accounts: VegaAccount[]
  decimals: number
}) => {
  const total = accounts.reduce((acc, { balance }) => acc.plus(toBigNum(balance ?? '0', decimals)), new BigNumber(0))

  return (
    <div>
      <div>
        <div>{symbol}</div>
        <div>{name}</div>
      </div>
      <div>
        {formatNumber(total)} {symbol}
      </div>
    </div>
  )
}

const CurrentMarkets = ({ assetId }: { assetId: string }) => {
  const { marekts } = useMarketsStore()
  return (
    <div>
      <Lozenge />
    </div>
  )
}

const AssetCard = ({ accounts, assetId }: { accounts: VegaAccount[]; assetId: string }) => {
  const { getAssetById } = useAssetsStore()
  const { symbol, name, decimals } = getAssetById(assetId)
  return (
    <CollapsiblePanel
      title={<AssetHeader symbol={symbol} name={name} decimals={decimals} accounts={accounts} />}
      panelContent={
        <div>
          <ul>
            <li></li>
            <li></li>
          </ul>
        </div>
      }
    />
  )
}

const useAccounts = (id: string) => {
  const { request } = useJsonRpcClient()
  const { startPoll, stopPoll, reset, fetchAccounts: fetchParty, accountsByAsset } = useAccountsStore()
  const { getKeyById } = useWalletStore()
  const [key, setKey] = useState<Key>()
  useEffect(() => {
    if (id) {
      fetchParty(id, request)
      startPoll(id, request)
      const key = getKeyById(id)
      setKey(key)
      return () => {
        stopPoll()
        reset()
      }
    }
  }, [fetchParty, getKeyById, id, request, reset, startPoll, stopPoll])
  return {
    accountsByAsset,
    key
  }
}

export const KeyDetails = () => {
  const id = 'cccc705061cfbc53ad32fe495d25897f5bb8a6a857eab2366e268c0d6f56cb0a'
  const { accountsByAsset, key } = useAccounts(id)
  if (!id) throw new Error('Id not found')

  return (
    <div>
      <h1>{key?.name || 'Unknown key'}</h1>
      {Object.entries(accountsByAsset).map(([assetId, val]) => (
        <AssetCard key={assetId} accounts={val} assetId={assetId} />
      ))}
    </div>
  )
}
