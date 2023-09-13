import { useJsonRpcClient } from '../../../../contexts/json-rpc/json-rpc-context'
import { ReactNode, useEffect } from 'react'
import { usePartyStore } from './party-store'
import { CollapsiblePanel } from '../../../../components/collapsible-panel'
import { DataTable } from '../../../../components/data-table/data-table'
import { AccountType } from '@vegaprotocol/types'
import { Lozenge } from '@vegaprotocol/ui-toolkit'
import { useParams } from 'react-router-dom'

interface Account {
  type: AccountType
  balance: string
  decimals: number
}

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

const AccountList = ({ accounts }: { accounts: Account[] }) => {
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
  balance,
  decimals
}: {
  symbol: string
  name: string
  balance: string
  decimals: number
}) => {
  return (
    <div>
      <div>
        <div>{symbol}</div>
        <div>{name}</div>
      </div>
      <div>
        {addDecimalsFormatNumber(balance, decimals)} {symbol}
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

const AssetCard = () => {
  return <CollapsiblePanel title={<div></div>}>foo</CollapsiblePanel>
}

export const Key = () => {
  let { id } = useParams()
  const { request } = useJsonRpcClient()
  const { startPoll, stopPoll, reset, fetchParty } = usePartyStore()
  useEffect(() => {
    if (id) {
      fetchParty(id, request)
      startPoll(id, request)
      return () => {
        stopPoll()
        reset()
      }
    }
  }, [fetchParty, id, request, reset, startPoll, stopPoll])
  if (!id) throw new Error('Id not found')
  return (
    <div>
      <h1>{id}</h1>
    </div>
  )
}
function addDecimalsFormatNumber(balance: string, decimals: number): any {
  throw new Error('Function not implemented.')
}
