export enum TransactionKeys {
  UNKNOWN = 'unknown',
  ORDER_SUBMISSION = 'orderSubmission',
  ORDER_CANCELLATION = 'orderCancellation',
  ORDER_AMENDMENT = 'orderAmendment',
  WITHDRAW_SUBMISSION = 'withdrawSubmission',
  PROPOSAL_SUBMISSION = 'proposalSubmission',
  VOTE_SUBMISSION = 'voteSubmission',
  LIQUIDITY_PROVISION_SUBMISSION = 'liquidityProvisionSubmission',
  DELEGATE_SUBMISSION = 'delegateSubmission',
  UNDELEGATE_SUBMISSION = 'undelegateSubmission',
  LIQUIDITY_PROVISION_CANCELLATION = 'liquidityProvisionCancellation',
  LIQUIDITY_PROVISION_AMENDMENT = 'liquidityProvisionAmendment',
  TRANSFER = 'transfer',
  CANCEL_TRANSFER = 'cancelTransfer',
  ANNOUNCE_NODE = 'announceNode',
  BATCH_MARKET_INSTRUCTIONS = 'batchMarketInstructions',
  STOP_ORDERS_SUBMISSION = 'stopOrdersSubmission',
  STOP_ORDERS_CANCELLATION = 'stopOrdersCancellation',
  NODE_VOTE = 'nodeVote',
  NODE_SIGNATURE = 'nodeSignature',
  CHAIN_EVENT = 'chainEvent',
  KEY_ROTATE_SUBMISSION = 'keyRotateSubmission',
  STATE_VARIABLE_PROPOSAL = 'stateVariableProposal',
  VALIDATOR_HEARTBEAT = 'validatorHeartbeat',
  ETHEREUM_KEY_ROTATE_SUBMISSION = 'ethereumKeyRotateSubmission',
  PROTOCOL_UPGRADE_PROPOSAL = 'protocolUpgradeProposal',
  ISSUE_SIGNATURES = 'issueSignatures',
  ORACLE_DATA_SUBMISSION = 'oracleDataSubmission'
}

export const TRANSACTION_TITLES: Record<TransactionKeys, string> = {
  [TransactionKeys.UNKNOWN]: 'Unknown',
  [TransactionKeys.ORDER_SUBMISSION]: 'Order submission',
  [TransactionKeys.ORDER_CANCELLATION]: 'Order cancellation',
  [TransactionKeys.ORDER_AMENDMENT]: 'Order amendment',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'Withdraw submission',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'Proposal submission',
  [TransactionKeys.VOTE_SUBMISSION]: 'Vote submission',
  [TransactionKeys.LIQUIDITY_PROVISION_SUBMISSION]: 'Liquidity provision submission',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'Delegate submission',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'Undelegate submission',
  [TransactionKeys.LIQUIDITY_PROVISION_CANCELLATION]: 'Liquidity provision cancellation',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]: 'Liquidity provision amendment',
  [TransactionKeys.TRANSFER]: 'Transfer',
  [TransactionKeys.CANCEL_TRANSFER]: 'Cancel transfer',
  [TransactionKeys.ANNOUNCE_NODE]: 'Announce node',
  [TransactionKeys.BATCH_MARKET_INSTRUCTIONS]: 'Batch market instructions',
  [TransactionKeys.STOP_ORDERS_SUBMISSION]: 'Stop orders submission',
  [TransactionKeys.STOP_ORDERS_CANCELLATION]: 'Stop orders cancellation',
  [TransactionKeys.NODE_VOTE]: 'Node vote',
  [TransactionKeys.NODE_SIGNATURE]: 'Node signature',
  [TransactionKeys.CHAIN_EVENT]: 'Chain event',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'Key rotate submission',
  [TransactionKeys.STATE_VARIABLE_PROPOSAL]: 'State variable proposal',
  [TransactionKeys.VALIDATOR_HEARTBEAT]: 'Validator heartbeat',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]: 'Ethereum key rotate submission',
  [TransactionKeys.PROTOCOL_UPGRADE_PROPOSAL]: 'Protocol upgrade proposal',
  [TransactionKeys.ISSUE_SIGNATURES]: 'Issue signatures',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'Oracle data submission'
}

type TransactionData = Record<string, any>

export type Transaction = {
  [key in TransactionKeys]: TransactionData
}

export enum SendingMode {
  ASYNC = 'TYPE_ASYNC',
  SYNC = 'TYPE_SYNC',
  COMMIT = 'TYPE_COMMIT'
}

export interface TransactionMessage {
  transaction: Transaction
  publicKey: string
  name: string
  wallet: string
  sendingMode: string
  origin: string
  receivedAt: string
}
