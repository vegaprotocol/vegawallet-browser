export const enum ExpiryStrategy {
  EXPIRY_STRATEGY_UNSPECIFIED = 'EXPIRY_STRATEGY_UNSPECIFIED',
  EXPIRY_STRATEGY_CANCELS = 'EXPIRY_STRATEGY_CANCELS',
  EXPIRY_STRATEGY_SUBMIT = 'EXPIRY_STRATEGY_SUBMIT'
}

const EXPIRY_STRATEGY_MAP: Record<ExpiryStrategy, string> = {
  [ExpiryStrategy.EXPIRY_STRATEGY_UNSPECIFIED]: 'Unspecified',
  [ExpiryStrategy.EXPIRY_STRATEGY_CANCELS]: 'Cancels',
  [ExpiryStrategy.EXPIRY_STRATEGY_SUBMIT]: 'Submit'
}

export const ExpiryStrategyComponent = ({ expiryStrategy }: { expiryStrategy: ExpiryStrategy }) => {
  return <>{EXPIRY_STRATEGY_MAP[expiryStrategy]}</>
}
