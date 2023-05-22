export enum TransactionStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum TransactionKeys {
  UNKNOWN = 'unknown',
  ORDER_SUBMISSION = 'orderSubmission',
  ORDER_CANCELLATION = 'orderCancellation',
  ORDER_AMENDMENT = 'orderAmendment',
  VOTE_SUBMISSION = 'voteSubmission',
  WITHDRAW_SUBMISSION = 'withdrawSubmission',
  LIQUIDTY_PROVISION_SUBMISSION = 'liquidityProvisionSubmission',
  LIQUIDTY_PROVISION_CANCELLATION = 'liquidityProvisionCancellation',
  LIQUIDITY_PROVISION_AMENDMENT = 'liquidityProvisionAmendment',
  PROPOSAL_SUBMISSION = 'proposalSubmission',
  ANNOUNCE_NODE = 'announceNode',
  NODE_VOTE = 'nodeVote',
  NODE_SIGNATURE = 'nodeSignature',
  CHAIN_EVENT = 'chainEvent',
  ORACLE_DATA_SUBMISSION = 'oracleDataSubmission',
  UNDELEGATE_SUBMISSION = 'undelegateSubmission',
  DELEGATE_SUBMISSION = 'delegateSubmission',
  TRANSFER = 'transfer',
  CANCEL_TRANSFER = 'cancelTransfer',
  KEY_ROTATE_SUBMISSION = 'keyRotateSubmission',
  ETHEREUM_KEY_ROTATE_SUBMISSION = 'ethereumKeyRotateSubmission'
}

export const TRANSACTION_TITLES: Record<TransactionKeys, string> = {
  [TransactionKeys.UNKNOWN]: 'Unknown transaction',
  [TransactionKeys.ORDER_SUBMISSION]: 'Order submission',
  [TransactionKeys.ORDER_CANCELLATION]: 'Order cancellation',
  [TransactionKeys.ORDER_AMENDMENT]: 'Order amendment',
  [TransactionKeys.VOTE_SUBMISSION]: 'Vote submission',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'Withdraw submission',
  [TransactionKeys.LIQUIDTY_PROVISION_SUBMISSION]: 'Liquidity provision',
  [TransactionKeys.LIQUIDTY_PROVISION_CANCELLATION]: 'Liquidity provision cancellation',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]: 'Liquidity provision amendment',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'Proposal submission',
  [TransactionKeys.ANNOUNCE_NODE]: 'Announce node',
  [TransactionKeys.NODE_VOTE]: 'Node vote',
  [TransactionKeys.NODE_SIGNATURE]: 'Node signature',
  [TransactionKeys.CHAIN_EVENT]: 'Chain event',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'Oracle data submission',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'Undelegate submission',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'Delegate submission',
  [TransactionKeys.TRANSFER]: 'Transfer',
  [TransactionKeys.CANCEL_TRANSFER]: 'Cancel transfer',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'Key rotation submission',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]: 'Ethereum key rotation submission'
}

export const TRANSACTION_DESCRIPTIONS: Record<TransactionKeys, string> = {
  [TransactionKeys.UNKNOWN]: 'submit an unknown transaction',
  [TransactionKeys.ORDER_SUBMISSION]: 'submit an order',
  [TransactionKeys.ORDER_CANCELLATION]: 'cancel an order',
  [TransactionKeys.ORDER_AMENDMENT]: 'amend an order',
  [TransactionKeys.VOTE_SUBMISSION]: 'submit a vote for a governance proposal',
  [TransactionKeys.WITHDRAW_SUBMISSION]: 'withdraw funds',
  [TransactionKeys.LIQUIDTY_PROVISION_SUBMISSION]: 'provide liquidity',
  [TransactionKeys.LIQUIDTY_PROVISION_CANCELLATION]: 'cancel a liquidity provision',
  [TransactionKeys.LIQUIDITY_PROVISION_AMENDMENT]: 'amend a liquidity provision',
  [TransactionKeys.PROPOSAL_SUBMISSION]: 'submit a governance proposal',
  [TransactionKeys.ANNOUNCE_NODE]: 'announce a node',
  [TransactionKeys.NODE_VOTE]: 'submit a node vote',
  [TransactionKeys.NODE_SIGNATURE]: 'submit a node signature',
  [TransactionKeys.CHAIN_EVENT]: 'submit a chain event',
  [TransactionKeys.ORACLE_DATA_SUBMISSION]: 'submit oracle data',
  [TransactionKeys.UNDELEGATE_SUBMISSION]: 'undelegate stake to a node',
  [TransactionKeys.DELEGATE_SUBMISSION]: 'delegate stake to a node',
  [TransactionKeys.TRANSFER]: 'transfer assets',
  [TransactionKeys.CANCEL_TRANSFER]: 'cancel a recurring transfer',
  [TransactionKeys.KEY_ROTATE_SUBMISSION]: 'submit a key rotation',
  [TransactionKeys.ETHEREUM_KEY_ROTATE_SUBMISSION]: 'submit an Ethereum key rotation'
}

type TransactionData = object

export type Transaction = {
  id: string
  type: TransactionKeys
  hostname: string
  wallet: string
  publicKey: string
  payload: TransactionData
  status: TransactionStatus
  receivedAt: Date
  txHash?: null | string
  blockHeight?: number
  signature?: string
  error?: string
}
