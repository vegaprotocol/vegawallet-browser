export enum TransactionKeys {
  UNKNOWN = 'unknown',
  ORDER_SUBMISSION = 'orderSubmission',
  ORDER_CANCELLATION = 'orderCancellation',
  MASS_ORDER_CANCELLATION = 'massOrderCancellation',
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
  [TransactionKeys.ORDER_SUBMISSION]: 'Order Submission',
  [TransactionKeys.ORDER_CANCELLATION]: 'Order Cancellation',
  [TransactionKeys.MASS_ORDER_CANCELLATION]: 'Mass Order Cancellation',
  [TransactionKeys.ORDER_AMENDMENT]: 'Order Amendment',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'Withdraw Submission',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'Proposal Submission',
  [TransactionKeys.VOTE_SUBMISSION]: 'Vote Submission',
  [TransactionKeys.LIQUIDITY_PROVISION_SUBMISSION]: 'Liquidity Provision Submission',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'Delegate Submission',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'Undelegate Submission',
  [TransactionKeys.LIQUIDITY_PROVISION_CANCELLATION]: 'Liquidity Provision Cancellation',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]: 'Liquidity Provision Amendment',
  [TransactionKeys.TRANSFER]: 'Transfer',
  [TransactionKeys.CANCEL_TRANSFER]: 'Cancel Transfer',
  [TransactionKeys.ANNOUNCE_NODE]: 'Announce Node',
  [TransactionKeys.BATCH_MARKET_INSTRUCTIONS]: 'Batch Market Instructions',
  [TransactionKeys.STOP_ORDERS_SUBMISSION]: 'Stop Orders Submission',
  [TransactionKeys.STOP_ORDERS_CANCELLATION]: 'Stop Orders Cancellation',
  [TransactionKeys.NODE_VOTE]: 'Node Vote',
  [TransactionKeys.NODE_SIGNATURE]: 'Node Signature',
  [TransactionKeys.CHAIN_EVENT]: 'Chain Event',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'Key Rotate Submission',
  [TransactionKeys.STATE_VARIABLE_PROPOSAL]: 'State Variable Proposal',
  [TransactionKeys.VALIDATOR_HEARTBEAT]: 'Validator Heartbeat',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]: 'Ethereum Key Rotate Submission',
  [TransactionKeys.PROTOCOL_UPGRADE_PROPOSAL]: 'Protocol Upgrade Proposal',
  [TransactionKeys.ISSUE_SIGNATURES]: 'Issue Signatures',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'Oracle Data Submission'
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
