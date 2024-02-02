import {
  OrderTimeInForce,
  StopOrderExpiryStrategy,
  vegaAccountType,
  vegaVoteValue
} from '@vegaprotocol/rest-clients/dist/trading-data'
import { v1UndelegateSubmissionMethod as UndelegateSubmissionMethod } from '@vegaprotocol/rest-clients/dist/trading-data'

export const EXPIRY_STRATEGY_MAP: Record<StopOrderExpiryStrategy, string> = {
  [StopOrderExpiryStrategy.EXPIRY_STRATEGY_UNSPECIFIED]: 'Unspecified',
  [StopOrderExpiryStrategy.EXPIRY_STRATEGY_CANCELS]: 'Cancels',
  [StopOrderExpiryStrategy.EXPIRY_STRATEGY_SUBMIT]: 'Submit'
}

export const UNDELEGATE_METHOD_MAP: Record<UndelegateSubmissionMethod, string> = {
  [UndelegateSubmissionMethod.METHOD_AT_END_OF_EPOCH]: 'End of epoch',
  [UndelegateSubmissionMethod.METHOD_NOW]: 'Now',
  [UndelegateSubmissionMethod.METHOD_UNSPECIFIED]: 'Unspecified'
}

export const TIF_MAP: { [key in OrderTimeInForce]: string } = {
  [OrderTimeInForce.TIME_IN_FORCE_GTC]: 'GTC',
  [OrderTimeInForce.TIME_IN_FORCE_GTT]: 'GTT',
  [OrderTimeInForce.TIME_IN_FORCE_IOC]: 'IOC',
  [OrderTimeInForce.TIME_IN_FORCE_FOK]: 'FOK',
  [OrderTimeInForce.TIME_IN_FORCE_GFA]: 'GFA',
  [OrderTimeInForce.TIME_IN_FORCE_GFN]: 'GFN',
  [OrderTimeInForce.TIME_IN_FORCE_UNSPECIFIED]: 'Unspecified'
}

export const VOTE_VALUE_MAP = {
  [vegaVoteValue.VALUE_YES]: 'For',
  [vegaVoteValue.VALUE_NO]: 'Against',
  [vegaVoteValue.VALUE_UNSPECIFIED]: 'Unspecified'
}

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
  [vegaAccountType.ACCOUNT_TYPE_PENDING_FEE_REFERRAL_REWARD]: 'Pending fee referral rewards',
  [vegaAccountType.ACCOUNT_TYPE_ORDER_MARGIN]: 'Order Margin'
}
