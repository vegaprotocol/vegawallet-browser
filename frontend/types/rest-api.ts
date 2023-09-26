/**
 * Operator describes the type of comparison.   - OPERATOR_UNSPECIFIED: The default value  - OPERATOR_EQUALS: Verify if the property values are strictly equal or not.  - OPERATOR_GREATER_THAN: Verify if the data source data value is greater than the Condition value.  - OPERATOR_GREATER_THAN_OR_EQUAL: Verify if the data source data value is greater than or equal to the Condition value.  - OPERATOR_LESS_THAN: Verify if the data source data value is less than the Condition value.  - OPERATOR_LESS_THAN_OR_EQUAL: Verify if the data source data value is less or equal to than the Condition value.
 * @export
 * @enum {string}
 */
export enum ConditionOperator {
  UNSPECIFIED = 'OPERATOR_UNSPECIFIED' as any,
  EQUALS = 'OPERATOR_EQUALS' as any,
  GREATERTHAN = 'OPERATOR_GREATER_THAN' as any,
  GREATERTHANOREQUAL = 'OPERATOR_GREATER_THAN_OR_EQUAL' as any,
  LESSTHAN = 'OPERATOR_LESS_THAN' as any,
  LESSTHANOREQUAL = 'OPERATOR_LESS_THAN_OR_EQUAL' as any
}

/**
 * - TRADING_MODE_UNSPECIFIED: Default value, this is invalid  - TRADING_MODE_CONTINUOUS: Normal trading  - TRADING_MODE_BATCH_AUCTION: Auction trading (FBA)  - TRADING_MODE_OPENING_AUCTION: Opening auction  - TRADING_MODE_MONITORING_AUCTION: Auction triggered by monitoring  - TRADING_MODE_NO_TRADING: No trading is allowed
 * @export
 * @enum {string}
 */
export enum MarketTradingMode {
  UNSPECIFIED = 'TRADING_MODE_UNSPECIFIED' as any,
  CONTINUOUS = 'TRADING_MODE_CONTINUOUS' as any,
  BATCHAUCTION = 'TRADING_MODE_BATCH_AUCTION' as any,
  OPENINGAUCTION = 'TRADING_MODE_OPENING_AUCTION' as any,
  MONITORINGAUCTION = 'TRADING_MODE_MONITORING_AUCTION' as any,
  NOTRADING = 'TRADING_MODE_NO_TRADING' as any
}

/**
 * - ORACLE_SOURCE_UNSPECIFIED: Default value  - ORACLE_SOURCE_OPEN_ORACLE: Specifies that the payload will be base64 encoded JSON conforming to the Open Oracle standard  - ORACLE_SOURCE_JSON: Specifies that the payload will be base64 encoded JSON, but does not specify the shape of the data
 * @export
 * @enum {string}
 */
export enum OracleDataSubmissionOracleSource {
  UNSPECIFIED = 'ORACLE_SOURCE_UNSPECIFIED' as any,
  OPENORACLE = 'ORACLE_SOURCE_OPEN_ORACLE' as any,
  JSON = 'ORACLE_SOURCE_JSON' as any
}

/**
 * - TIME_IN_FORCE_UNSPECIFIED: Default value for TimeInForce, can be valid for an amend  - TIME_IN_FORCE_GTC: Good until cancelled, the order trades any amount and as much as possible and remains on the book until it either trades completely or is cancelled  - TIME_IN_FORCE_GTT: Good until specified time, this order type trades any amount and as much as possible and remains on the book until it either trades completely, is cancelled, or expires at a set time NOTE: this may in future be multiple types or have sub types for orders that provide different ways of specifying expiry  - TIME_IN_FORCE_IOC: Immediate or cancel, the order trades any amount and as much as possible but does not remain on the book (whether it trades or not)  - TIME_IN_FORCE_FOK: Fill or kill, the order either trades completely i.e. remainingSize == 0 after adding, or not at all, and does not remain on the book if it doesn't trade  - TIME_IN_FORCE_GFA: Good for auction, this order is only accepted during an auction period  - TIME_IN_FORCE_GFN: Good for normal, this order is only accepted during normal trading (that can be continuous trading or frequent batched auctions)
 * @export
 * @enum {string}
 */
export enum OrderTimeInForce {
  UNSPECIFIED = 'TIME_IN_FORCE_UNSPECIFIED' as any,
  GTC = 'TIME_IN_FORCE_GTC' as any,
  GTT = 'TIME_IN_FORCE_GTT' as any,
  IOC = 'TIME_IN_FORCE_IOC' as any,
  FOK = 'TIME_IN_FORCE_FOK' as any,
  GFA = 'TIME_IN_FORCE_GFA' as any,
  GFN = 'TIME_IN_FORCE_GFN' as any
}

/**
 *
 * @export
 * @interface TransactionResultFailureDetails
 */
export interface TransactionResultFailureDetails {
  /**
   *
   * @type {string}
   * @memberof TransactionResultFailureDetails
   */
  error?: string
}

/**
 *
 * @export
 * @interface TransactionResultSuccessDetails
 */
export interface TransactionResultSuccessDetails {}

/**
 *
 * @export
 * @enum {string}
 */
export enum UndelegateSubmissionMethod {
  UNSPECIFIED = 'METHOD_UNSPECIFIED' as any,
  NOW = 'METHOD_NOW' as any,
  ATENDOFEPOCH = 'METHOD_AT_END_OF_EPOCH' as any
}

/**
 *
 * @export
 * @interface V1AnnounceNode
 */
export interface V1AnnounceNode {
  /**
   * AvatarURL of the validator.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  avatarUrl?: string
  /**
   * Public key for the blockchain, required field.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  chainPubKey?: string
  /**
   * Country code (ISO 3166-1 alpha-2) for the location of the node.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  country?: string
  /**
   * Ethereum public key, required field.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  ethereumAddress?: string
  /**
   *
   * @type {V1Signature}
   * @memberof V1AnnounceNode
   */
  ethereumSignature?: V1Signature
  /**
   * Epoch from which the validator is expected to be ready to validate blocks.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  fromEpoch?: string
  /**
   * Node ID of the validator, i.e. the node's public master key.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  id?: string
  /**
   * URL with more info on the node.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  infoUrl?: string
  /**
   * Name of the validator.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  name?: string
  /**
   * Ethereum public key to use as a submitter to allow automatic signature generation.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  submitterAddress?: string
  /**
   * Vega public key, required field.
   * @type {string}
   * @memberof V1AnnounceNode
   */
  vegaPubKey?: string
  /**
   * Vega public key derivation index.
   * @type {number}
   * @memberof V1AnnounceNode
   */
  vegaPubKeyIndex?: number
  /**
   *
   * @type {V1Signature}
   * @memberof V1AnnounceNode
   */
  vegaSignature?: V1Signature
}

/**
 *
 * @export
 * @interface V1AuctionEvent
 */
export interface V1AuctionEvent {
  /**
   *
   * @type {string}
   * @memberof V1AuctionEvent
   */
  end?: string
  /**
   *
   * @type {VegaAuctionTrigger}
   * @memberof V1AuctionEvent
   */
  extensionTrigger?: VegaAuctionTrigger
  /**
   *
   * @type {boolean}
   * @memberof V1AuctionEvent
   */
  leave?: boolean
  /**
   *
   * @type {string}
   * @memberof V1AuctionEvent
   */
  marketId?: string
  /**
   *
   * @type {boolean}
   * @memberof V1AuctionEvent
   */
  openingAuction?: boolean
  /**
   *
   * @type {string}
   * @memberof V1AuctionEvent
   */
  start?: string
  /**
   *
   * @type {VegaAuctionTrigger}
   * @memberof V1AuctionEvent
   */
  trigger?: VegaAuctionTrigger
}

/**
 *
 * @export
 * @interface V1BatchMarketInstructions
 */
export interface V1BatchMarketInstructions {
  /**
   * List of order amendments to be processed sequentially.
   * @type {Array<V1OrderAmendment>}
   * @memberof V1BatchMarketInstructions
   */
  amendments?: Array<V1OrderAmendment>
  /**
   * List of order cancellations to be processed sequentially.
   * @type {Array<V1OrderCancellation>}
   * @memberof V1BatchMarketInstructions
   */
  cancellations?: Array<V1OrderCancellation>
  /**
   * List of order submissions to be processed sequentially.
   * @type {Array<V1OrderSubmission>}
   * @memberof V1BatchMarketInstructions
   */
  submissions?: Array<V1OrderSubmission>
}

/**
 *
 * @export
 * @interface V1BeginBlock
 */
export interface V1BeginBlock {
  /**
   *
   * @type {string}
   * @memberof V1BeginBlock
   */
  hash?: string
  /**
   *
   * @type {string}
   * @memberof V1BeginBlock
   */
  height?: string
  /**
   *
   * @type {string}
   * @memberof V1BeginBlock
   */
  timestamp?: string
}

/**
 *
 * @export
 * @interface V1BusEvent
 */
export interface V1BusEvent {
  /**
   *
   * @type {VegaAccount}
   * @memberof V1BusEvent
   */
  account?: VegaAccount
  /**
   *
   * @type {VegaAsset}
   * @memberof V1BusEvent
   */
  asset?: VegaAsset
  /**
   *
   * @type {V1AuctionEvent}
   * @memberof V1BusEvent
   */
  auction?: V1AuctionEvent
  /**
   *
   * @type {V1BeginBlock}
   * @memberof V1BusEvent
   */
  beginBlock?: V1BeginBlock
  /**
   *
   * @type {string}
   * @memberof V1BusEvent
   */
  block?: string
  /**
   *
   * @type {string}
   * @memberof V1BusEvent
   */
  chainId?: string
  /**
   *
   * @type {V1CheckpointEvent}
   * @memberof V1BusEvent
   */
  checkpoint?: V1CheckpointEvent
  /**
   *
   * @type {V1CoreSnapshotData}
   * @memberof V1BusEvent
   */
  coreSnapshotEvent?: V1CoreSnapshotData
  /**
   *
   * @type {V1DelegationBalanceEvent}
   * @memberof V1BusEvent
   */
  delegationBalance?: V1DelegationBalanceEvent
  /**
   *
   * @type {VegaDeposit}
   * @memberof V1BusEvent
   */
  deposit?: VegaDeposit
  /**
   *
   * @type {V1DistressedOrders}
   * @memberof V1BusEvent
   */
  distressedOrders?: V1DistressedOrders
  /**
   *
   * @type {V1DistressedPositions}
   * @memberof V1BusEvent
   */
  distressedPositions?: V1DistressedPositions
  /**
   *
   * @type {V1EndBlock}
   * @memberof V1BusEvent
   */
  endBlock?: V1EndBlock
  /**
   *
   * @type {V1EpochEvent}
   * @memberof V1BusEvent
   */
  epochEvent?: V1EpochEvent
  /**
   *
   * @type {V1ERC20MultiSigThresholdSetEvent}
   * @memberof V1BusEvent
   */
  erc20MultisigSetThresholdEvent?: V1ERC20MultiSigThresholdSetEvent
  /**
   *
   * @type {V1ERC20MultiSigSignerAdded}
   * @memberof V1BusEvent
   */
  erc20MultisigSignerAdded?: V1ERC20MultiSigSignerAdded
  /**
   *
   * @type {V1ERC20MultiSigSignerEvent}
   * @memberof V1BusEvent
   */
  erc20MultisigSignerEvent?: V1ERC20MultiSigSignerEvent
  /**
   *
   * @type {V1ERC20MultiSigSignerRemoved}
   * @memberof V1BusEvent
   */
  erc20MultisigSignerRemoved?: V1ERC20MultiSigSignerRemoved
  /**
   *
   * @type {V1EthereumKeyRotation}
   * @memberof V1BusEvent
   */
  ethereumKeyRotation?: V1EthereumKeyRotation
  /**
   *
   * @type {V1ExpiredOrders}
   * @memberof V1BusEvent
   */
  expiredOrders?: V1ExpiredOrders
  /**
   *
   * @type {string}
   * @memberof V1BusEvent
   */
  id?: string
  /**
   *
   * @type {V1KeyRotation}
   * @memberof V1BusEvent
   */
  keyRotation?: V1KeyRotation
  /**
   *
   * @type {V1LedgerMovements}
   * @memberof V1BusEvent
   */
  ledgerMovements?: V1LedgerMovements
  /**
   *
   * @type {VegaLiquidityProvision}
   * @memberof V1BusEvent
   */
  liquidityProvision?: VegaLiquidityProvision
  /**
   *
   * @type {V1LossSocialization}
   * @memberof V1BusEvent
   */
  lossSocialization?: V1LossSocialization
  /**
   *
   * @type {VegaMarginLevels}
   * @memberof V1BusEvent
   */
  marginLevels?: VegaMarginLevels
  /**
   *
   * @type {V1MarketEvent}
   * @memberof V1BusEvent
   */
  market?: V1MarketEvent
  /**
   *
   * @type {VegaMarket}
   * @memberof V1BusEvent
   */
  marketCreated?: VegaMarket
  /**
   *
   * @type {VegaMarketData}
   * @memberof V1BusEvent
   */
  marketData?: VegaMarketData
  /**
   *
   * @type {V1MarketTick}
   * @memberof V1BusEvent
   */
  marketTick?: V1MarketTick
  /**
   *
   * @type {VegaMarket}
   * @memberof V1BusEvent
   */
  marketUpdated?: VegaMarket
  /**
   *
   * @type {VegaNetworkLimits}
   * @memberof V1BusEvent
   */
  networkLimits?: VegaNetworkLimits
  /**
   *
   * @type {VegaNetworkParameter}
   * @memberof V1BusEvent
   */
  networkParameter?: VegaNetworkParameter
  /**
   *
   * @type {V1NodeSignature}
   * @memberof V1BusEvent
   */
  nodeSignature?: V1NodeSignature
  /**
   *
   * @type {VegaOracleData}
   * @memberof V1BusEvent
   */
  oracleData?: VegaOracleData
  /**
   *
   * @type {VegaOracleSpec}
   * @memberof V1BusEvent
   */
  oracleSpec?: VegaOracleSpec
  /**
   *
   * @type {VegaOrder}
   * @memberof V1BusEvent
   */
  order?: VegaOrder
  /**
   *
   * @type {VegaParty}
   * @memberof V1BusEvent
   */
  party?: VegaParty
  /**
   *
   * @type {V1PositionResolution}
   * @memberof V1BusEvent
   */
  positionResolution?: V1PositionResolution
  /**
   *
   * @type {V1PositionStateEvent}
   * @memberof V1BusEvent
   */
  positionStateEvent?: V1PositionStateEvent
  /**
   *
   * @type {VegaProposal}
   * @memberof V1BusEvent
   */
  proposal?: VegaProposal
  /**
   *
   * @type {V1ProtocolUpgradeDataNodeReady}
   * @memberof V1BusEvent
   */
  protocolUpgradeDataNodeReady?: V1ProtocolUpgradeDataNodeReady
  /**
   *
   * @type {V1ProtocolUpgradeEvent}
   * @memberof V1BusEvent
   */
  protocolUpgradeEvent?: V1ProtocolUpgradeEvent
  /**
   *
   * @type {V1ProtocolUpgradeStarted}
   * @memberof V1BusEvent
   */
  protocolUpgradeStarted?: V1ProtocolUpgradeStarted
  /**
   *
   * @type {V1ValidatorRankingEvent}
   * @memberof V1BusEvent
   */
  rankingEvent?: V1ValidatorRankingEvent
  /**
   *
   * @type {V1RewardPayoutEvent}
   * @memberof V1BusEvent
   */
  rewardPayout?: V1RewardPayoutEvent
  /**
   *
   * @type {VegaRiskFactor}
   * @memberof V1BusEvent
   */
  riskFactor?: VegaRiskFactor
  /**
   *
   * @type {V1SettleDistressed}
   * @memberof V1BusEvent
   */
  settleDistressed?: V1SettleDistressed
  /**
   *
   * @type {V1SettleMarket}
   * @memberof V1BusEvent
   */
  settleMarket?: V1SettleMarket
  /**
   *
   * @type {V1SettlePosition}
   * @memberof V1BusEvent
   */
  settlePosition?: V1SettlePosition
  /**
   *
   * @type {V1StakeLinking}
   * @memberof V1BusEvent
   */
  stakeLinking?: V1StakeLinking
  /**
   *
   * @type {V1StateVar}
   * @memberof V1BusEvent
   */
  stateVar?: V1StateVar
  /**
   *
   * @type {V1TimeUpdate}
   * @memberof V1BusEvent
   */
  timeUpdate?: V1TimeUpdate
  /**
   *
   * @type {VegaTrade}
   * @memberof V1BusEvent
   */
  trade?: VegaTrade
  /**
   *
   * @type {V1TransactionResult}
   * @memberof V1BusEvent
   */
  transactionResult?: V1TransactionResult
  /**
   *
   * @type {Vegaeventsv1Transfer}
   * @memberof V1BusEvent
   */
  transfer?: Vegaeventsv1Transfer
  /**
   *
   * @type {V1TxErrorEvent}
   * @memberof V1BusEvent
   */
  txErrEvent?: V1TxErrorEvent
  /**
   *
   * @type {string}
   * @memberof V1BusEvent
   */
  txHash?: string
  /**
   *
   * @type {V1BusEventType}
   * @memberof V1BusEvent
   */
  type?: V1BusEventType
  /**
   *
   * @type {V1ValidatorScoreEvent}
   * @memberof V1BusEvent
   */
  validatorScore?: V1ValidatorScoreEvent
  /**
   *
   * @type {V1ValidatorUpdate}
   * @memberof V1BusEvent
   */
  validatorUpdate?: V1ValidatorUpdate
  /**
   *
   * @type {number}
   * @memberof V1BusEvent
   */
  version?: number
  /**
   *
   * @type {VegaVote}
   * @memberof V1BusEvent
   */
  vote?: VegaVote
  /**
   *
   * @type {VegaWithdrawal}
   * @memberof V1BusEvent
   */
  withdrawal?: VegaWithdrawal
}

/**
 * - BUS_EVENT_TYPE_UNSPECIFIED: Default value, always invalid  - BUS_EVENT_TYPE_ALL: Events of ALL event types, used when filtering stream from event bus  - BUS_EVENT_TYPE_TIME_UPDATE: Event for blockchain time updates  - BUS_EVENT_TYPE_LEDGER_MOVEMENTS: Event for when a transfer happens internally, contains the transfer information  - BUS_EVENT_TYPE_POSITION_RESOLUTION: Event indicating position resolution has occurred  - BUS_EVENT_TYPE_ORDER: Event for order updates, both new and existing orders  - BUS_EVENT_TYPE_ACCOUNT: Event for account updates  - BUS_EVENT_TYPE_PARTY: Event for party updates  - BUS_EVENT_TYPE_TRADE: Event indicating a new trade has occurred  - BUS_EVENT_TYPE_MARGIN_LEVELS: Event indicating margin levels have changed for a party  - BUS_EVENT_TYPE_PROPOSAL: Event for proposal updates (for governance)  - BUS_EVENT_TYPE_VOTE: Event indicating a new vote has occurred (for governance)  - BUS_EVENT_TYPE_MARKET_DATA: Event for market data updates  - BUS_EVENT_TYPE_NODE_SIGNATURE: Event for a new signature for a Vega node  - BUS_EVENT_TYPE_LOSS_SOCIALIZATION: Event indicating loss socialisation occurred for a party  - BUS_EVENT_TYPE_SETTLE_POSITION: Event for when a position is being settled  - BUS_EVENT_TYPE_SETTLE_DISTRESSED: Event for when a position is distressed  - BUS_EVENT_TYPE_MARKET_CREATED: Event indicating a new market was created  - BUS_EVENT_TYPE_ASSET: Event for when an asset is added to Vega  - BUS_EVENT_TYPE_MARKET_TICK: Event indicating a market tick event  - BUS_EVENT_TYPE_WITHDRAWAL: Event for when a withdrawal occurs  - BUS_EVENT_TYPE_DEPOSIT: Event for when a deposit occurs  - BUS_EVENT_TYPE_AUCTION: Event indicating a change in auction state, for example starting or ending an auction  - BUS_EVENT_TYPE_RISK_FACTOR: Event indicating a risk factor has been updated  - BUS_EVENT_TYPE_NETWORK_PARAMETER: Event indicating a network parameter has been added or updated  - BUS_EVENT_TYPE_LIQUIDITY_PROVISION: Event indicating a liquidity provision has been created or updated  - BUS_EVENT_TYPE_MARKET_UPDATED: Event indicating a new market was created  - BUS_EVENT_TYPE_ORACLE_SPEC: Event indicating an oracle spec has been created or updated  - BUS_EVENT_TYPE_ORACLE_DATA: Event indicating that an oracle data has been broadcast  - BUS_EVENT_TYPE_DELEGATION_BALANCE: Event indicating that an delegation balance of a party to a node for current epoch has changed  - BUS_EVENT_TYPE_VALIDATOR_SCORE: Event indicating the validator score for the given epoch  - BUS_EVENT_TYPE_EPOCH_UPDATE: Event indicating the start or end of an epoch  - BUS_EVENT_TYPE_VALIDATOR_UPDATE: Event indicating that validator node has been updated  - BUS_EVENT_TYPE_STAKE_LINKING: Event indicating a new staking event have been processed by the network  - BUS_EVENT_TYPE_REWARD_PAYOUT_EVENT: Event indicating the payout of a reward has been initiated  - BUS_EVENT_TYPE_CHECKPOINT: Event indicating a new checkpoint was created  - BUS_EVENT_TYPE_STREAM_START: Event indicating stream is starting  - BUS_EVENT_TYPE_KEY_ROTATION: Event indicating key rotation took place  - BUS_EVENT_TYPE_STATE_VAR: Event indicating state transitions in state variable consensus  - BUS_EVENT_TYPE_NETWORK_LIMITS: Event indicating network limits set or updated  - BUS_EVENT_TYPE_TRANSFER: Event indicating a update for a transfer  - BUS_EVENT_TYPE_VALIDATOR_RANKING: Event indicating the ranking of validator and their status in Vega  - BUS_EVENT_TYPE_ERC20_MULTI_SIG_SIGNER_EVENT: Event indicating a new multi sig signer event have been processed  - BUS_EVENT_TYPE_ERC20_MULTI_SIG_SET_THRESHOLD: Event indicating the erc20 multi sig threshold have been updated  - BUS_EVENT_TYPE_ERC20_MULTI_SIG_SIGNER_ADDED: Event indicating a new signer has been added to the ERC-20 multisig  - BUS_EVENT_TYPE_ERC20_MULTI_SIG_SIGNER_REMOVED: Event indicating a signer has been removed from the ERC-20 multisig  - BUS_EVENT_TYPE_POSITION_STATE: Event indicating that a party's position has changed  - BUS_EVENT_TYPE_ETHEREUM_KEY_ROTATION: Event indicating Ethereum key rotation took place  - BUS_EVENT_TYPE_PROTOCOL_UPGRADE_PROPOSAL: Event indicating protocol upgrade proposal updates  - BUS_EVENT_TYPE_BEGIN_BLOCK: Event indicating the core is starting to process a new block  - BUS_EVENT_TYPE_END_BLOCK: Event indicating the core finished to process a block  - BUS_EVENT_TYPE_PROTOCOL_UPGRADE_STARTED: Event indicating the core is starting a protocol upgrade  - BUS_EVENT_TYPE_SETTLE_MARKET: Event indicating the market has stopped and settled  - BUS_EVENT_TYPE_TRANSACTION_RESULT: Event indicating the result of a transaction processed by the network  - BUS_EVENT_TYPE_SNAPSHOT_TAKEN: Event indicating a snapshot was taken at this block height  - BUS_EVENT_TYPE_PROTOCOL_UPGRADE_DATA_NODE_READY: Event data node uses to notify that it is ready to upgrade  - BUS_EVENT_TYPE_DISTRESSED_ORDERS_CLOSED: Event indicating parties had orders closed because they were distressed, but were not closed out.  - BUS_EVENT_TYPE_EXPIRED_ORDERS: Event indicating parties had orders closed because they were distressed, but were not closed out.  - BUS_EVENT_TYPE_DISTRESSED_POSITIONS: Event indicating parties have become, or were, distressed but still have an active position.  - BUS_EVENT_TYPE_MARKET: Event indicating a market related event, for example when a market opens  - BUS_EVENT_TYPE_TX_ERROR: Event used to report failed transactions back to a user, this is excluded from the ALL type
 * @export
 * @enum {string}
 */
export enum V1BusEventType {
  UNSPECIFIED = 'BUS_EVENT_TYPE_UNSPECIFIED' as any,
  ALL = 'BUS_EVENT_TYPE_ALL' as any,
  TIMEUPDATE = 'BUS_EVENT_TYPE_TIME_UPDATE' as any,
  LEDGERMOVEMENTS = 'BUS_EVENT_TYPE_LEDGER_MOVEMENTS' as any,
  POSITIONRESOLUTION = 'BUS_EVENT_TYPE_POSITION_RESOLUTION' as any,
  ORDER = 'BUS_EVENT_TYPE_ORDER' as any,
  ACCOUNT = 'BUS_EVENT_TYPE_ACCOUNT' as any,
  PARTY = 'BUS_EVENT_TYPE_PARTY' as any,
  TRADE = 'BUS_EVENT_TYPE_TRADE' as any,
  MARGINLEVELS = 'BUS_EVENT_TYPE_MARGIN_LEVELS' as any,
  PROPOSAL = 'BUS_EVENT_TYPE_PROPOSAL' as any,
  VOTE = 'BUS_EVENT_TYPE_VOTE' as any,
  MARKETDATA = 'BUS_EVENT_TYPE_MARKET_DATA' as any,
  NODESIGNATURE = 'BUS_EVENT_TYPE_NODE_SIGNATURE' as any,
  LOSSSOCIALIZATION = 'BUS_EVENT_TYPE_LOSS_SOCIALIZATION' as any,
  SETTLEPOSITION = 'BUS_EVENT_TYPE_SETTLE_POSITION' as any,
  SETTLEDISTRESSED = 'BUS_EVENT_TYPE_SETTLE_DISTRESSED' as any,
  MARKETCREATED = 'BUS_EVENT_TYPE_MARKET_CREATED' as any,
  ASSET = 'BUS_EVENT_TYPE_ASSET' as any,
  MARKETTICK = 'BUS_EVENT_TYPE_MARKET_TICK' as any,
  WITHDRAWAL = 'BUS_EVENT_TYPE_WITHDRAWAL' as any,
  DEPOSIT = 'BUS_EVENT_TYPE_DEPOSIT' as any,
  AUCTION = 'BUS_EVENT_TYPE_AUCTION' as any,
  RISKFACTOR = 'BUS_EVENT_TYPE_RISK_FACTOR' as any,
  NETWORKPARAMETER = 'BUS_EVENT_TYPE_NETWORK_PARAMETER' as any,
  LIQUIDITYPROVISION = 'BUS_EVENT_TYPE_LIQUIDITY_PROVISION' as any,
  MARKETUPDATED = 'BUS_EVENT_TYPE_MARKET_UPDATED' as any,
  ORACLESPEC = 'BUS_EVENT_TYPE_ORACLE_SPEC' as any,
  ORACLEDATA = 'BUS_EVENT_TYPE_ORACLE_DATA' as any,
  DELEGATIONBALANCE = 'BUS_EVENT_TYPE_DELEGATION_BALANCE' as any,
  VALIDATORSCORE = 'BUS_EVENT_TYPE_VALIDATOR_SCORE' as any,
  EPOCHUPDATE = 'BUS_EVENT_TYPE_EPOCH_UPDATE' as any,
  VALIDATORUPDATE = 'BUS_EVENT_TYPE_VALIDATOR_UPDATE' as any,
  STAKELINKING = 'BUS_EVENT_TYPE_STAKE_LINKING' as any,
  REWARDPAYOUTEVENT = 'BUS_EVENT_TYPE_REWARD_PAYOUT_EVENT' as any,
  CHECKPOINT = 'BUS_EVENT_TYPE_CHECKPOINT' as any,
  STREAMSTART = 'BUS_EVENT_TYPE_STREAM_START' as any,
  KEYROTATION = 'BUS_EVENT_TYPE_KEY_ROTATION' as any,
  STATEVAR = 'BUS_EVENT_TYPE_STATE_VAR' as any,
  NETWORKLIMITS = 'BUS_EVENT_TYPE_NETWORK_LIMITS' as any,
  TRANSFER = 'BUS_EVENT_TYPE_TRANSFER' as any,
  VALIDATORRANKING = 'BUS_EVENT_TYPE_VALIDATOR_RANKING' as any,
  ERC20MULTISIGSIGNEREVENT = 'BUS_EVENT_TYPE_ERC20_MULTI_SIG_SIGNER_EVENT' as any,
  ERC20MULTISIGSETTHRESHOLD = 'BUS_EVENT_TYPE_ERC20_MULTI_SIG_SET_THRESHOLD' as any,
  ERC20MULTISIGSIGNERADDED = 'BUS_EVENT_TYPE_ERC20_MULTI_SIG_SIGNER_ADDED' as any,
  ERC20MULTISIGSIGNERREMOVED = 'BUS_EVENT_TYPE_ERC20_MULTI_SIG_SIGNER_REMOVED' as any,
  POSITIONSTATE = 'BUS_EVENT_TYPE_POSITION_STATE' as any,
  ETHEREUMKEYROTATION = 'BUS_EVENT_TYPE_ETHEREUM_KEY_ROTATION' as any,
  PROTOCOLUPGRADEPROPOSAL = 'BUS_EVENT_TYPE_PROTOCOL_UPGRADE_PROPOSAL' as any,
  BEGINBLOCK = 'BUS_EVENT_TYPE_BEGIN_BLOCK' as any,
  ENDBLOCK = 'BUS_EVENT_TYPE_END_BLOCK' as any,
  PROTOCOLUPGRADESTARTED = 'BUS_EVENT_TYPE_PROTOCOL_UPGRADE_STARTED' as any,
  SETTLEMARKET = 'BUS_EVENT_TYPE_SETTLE_MARKET' as any,
  TRANSACTIONRESULT = 'BUS_EVENT_TYPE_TRANSACTION_RESULT' as any,
  SNAPSHOTTAKEN = 'BUS_EVENT_TYPE_SNAPSHOT_TAKEN' as any,
  PROTOCOLUPGRADEDATANODEREADY = 'BUS_EVENT_TYPE_PROTOCOL_UPGRADE_DATA_NODE_READY' as any,
  DISTRESSEDORDERSCLOSED = 'BUS_EVENT_TYPE_DISTRESSED_ORDERS_CLOSED' as any,
  EXPIREDORDERS = 'BUS_EVENT_TYPE_EXPIRED_ORDERS' as any,
  DISTRESSEDPOSITIONS = 'BUS_EVENT_TYPE_DISTRESSED_POSITIONS' as any,
  MARKET = 'BUS_EVENT_TYPE_MARKET' as any,
  TXERROR = 'BUS_EVENT_TYPE_TX_ERROR' as any
}

/**
 *
 * @export
 * @interface V1CancelTransfer
 */
export interface V1CancelTransfer {
  /**
   * Transfer ID of the transfer to cancel.
   * @type {string}
   * @memberof V1CancelTransfer
   */
  transferId?: string
}

/**
 *
 * @export
 * @interface V1CheckRawTransactionRequest
 */
export interface V1CheckRawTransactionRequest {
  /**
   *
   * @type {string}
   * @memberof V1CheckRawTransactionRequest
   */
  tx: string
}

/**
 *
 * @export
 * @interface V1CheckRawTransactionResponse
 */
export interface V1CheckRawTransactionResponse {
  /**
   *
   * @type {string}
   * @memberof V1CheckRawTransactionResponse
   */
  info?: string
  /**
   *
   * @type {number}
   * @memberof V1CheckRawTransactionResponse
   */
  code?: number
  /**
   *
   * @type {string}
   * @memberof V1CheckRawTransactionResponse
   */
  data?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckRawTransactionResponse
   */
  gasUsed?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckRawTransactionResponse
   */
  gasWanted?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckRawTransactionResponse
   */
  log?: string
  /**
   *
   * @type {boolean}
   * @memberof V1CheckRawTransactionResponse
   */
  success?: boolean
}

/**
 *
 * @export
 * @interface V1CheckTransactionRequest
 */
export interface V1CheckTransactionRequest {
  /**
   *
   * @type {V1Transaction}
   * @memberof V1CheckTransactionRequest
   */
  tx?: V1Transaction
}

/**
 *
 * @export
 * @interface V1CheckTransactionResponse
 */
export interface V1CheckTransactionResponse {
  /**
   *
   * @type {string}
   * @memberof V1CheckTransactionResponse
   */
  info?: string
  /**
   *
   * @type {number}
   * @memberof V1CheckTransactionResponse
   */
  code?: number
  /**
   *
   * @type {string}
   * @memberof V1CheckTransactionResponse
   */
  data?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckTransactionResponse
   */
  gasUsed?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckTransactionResponse
   */
  gasWanted?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckTransactionResponse
   */
  log?: string
  /**
   *
   * @type {boolean}
   * @memberof V1CheckTransactionResponse
   */
  success?: boolean
}

/**
 *
 * @export
 * @interface V1CheckpointEvent
 */
export interface V1CheckpointEvent {
  /**
   *
   * @type {string}
   * @memberof V1CheckpointEvent
   */
  blockHash?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckpointEvent
   */
  blockHeight?: string
  /**
   *
   * @type {string}
   * @memberof V1CheckpointEvent
   */
  hash?: string
}

/**
 *
 * @export
 * @interface V1Condition
 */
export interface V1Condition {
  /**
   *
   * @type {ConditionOperator}
   * @memberof V1Condition
   */
  operator?: ConditionOperator
  /**
   * Value to be compared with by the operator.
   * @type {string}
   * @memberof V1Condition
   */
  value?: string
}

/**
 * CoreSnapshotData represents the core snapshot data.
 * @export
 * @interface V1CoreSnapshotData
 */
export interface V1CoreSnapshotData {
  /**
   *
   * @type {string}
   * @memberof V1CoreSnapshotData
   */
  blockHash?: string
  /**
   *
   * @type {string}
   * @memberof V1CoreSnapshotData
   */
  blockHeight?: string
  /**
   * Semver version number of the core.
   * @type {string}
   * @memberof V1CoreSnapshotData
   */
  coreVersion?: string
  /**
   *
   * @type {boolean}
   * @memberof V1CoreSnapshotData
   */
  protocolUpgradeBlock?: boolean
}

/**
 * Data describes valid source data that has been received by the node. It represents both matched and unmatched data.
 * @export
 * @interface V1Data
 */
export interface V1Data {
  /**
   * `broadcast_at` is the time at which the data was broadcast to the markets with a matching spec. It has no value when the date did not match any spec. The value is a Unix timestamp in nanoseconds.
   * @type {string}
   * @memberof V1Data
   */
  broadcastAt?: string
  /**
   *
   * @type {Array<V1Property>}
   * @memberof V1Data
   */
  data?: Array<V1Property>
  /**
   * `matched_specs_ids` lists all the specs that matched this data. When the array is empty, it means no spec matched this data.
   * @type {Array<string>}
   * @memberof V1Data
   */
  matchedSpecIds?: Array<string>
  /**
   *
   * @type {Array<V1Signer>}
   * @memberof V1Data
   */
  signers?: Array<V1Signer>
}

/**
 *
 * @export
 * @interface V1DelegateSubmission
 */
export interface V1DelegateSubmission {
  /**
   * Amount of stake to delegate. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof V1DelegateSubmission
   */
  amount?: string
  /**
   * Delegate to the specified node ID.
   * @type {string}
   * @memberof V1DelegateSubmission
   */
  nodeId?: string
}

/**
 *
 * @export
 * @interface V1DelegationBalanceEvent
 */
export interface V1DelegationBalanceEvent {
  /**
   *
   * @type {string}
   * @memberof V1DelegationBalanceEvent
   */
  amount?: string
  /**
   *
   * @type {string}
   * @memberof V1DelegationBalanceEvent
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1DelegationBalanceEvent
   */
  nodeId?: string
  /**
   *
   * @type {string}
   * @memberof V1DelegationBalanceEvent
   */
  party?: string
}

/**
 *
 * @export
 * @interface V1DistressedOrders
 */
export interface V1DistressedOrders {
  /**
   *
   * @type {string}
   * @memberof V1DistressedOrders
   */
  marketId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof V1DistressedOrders
   */
  parties?: Array<string>
}

/**
 * Distressed positions event contains the party IDs for all parties that were distressed, had their orders closed but because of insufficient volume on the book could not be fully closed out. These parties are distressed, but still hold an active position on the book as a result. Once enough volume is on the book to close them out, a SettleDistressed event will be sent. In case they manage to reduce their position, or meet the margin requirements, this status will be updated. Parties that are no longer distressed but active will be listed in the safe_parties field.
 * @export
 * @interface V1DistressedPositions
 */
export interface V1DistressedPositions {
  /**
   *
   * @type {Array<string>}
   * @memberof V1DistressedPositions
   */
  distressedParties?: Array<string>
  /**
   *
   * @type {string}
   * @memberof V1DistressedPositions
   */
  marketId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof V1DistressedPositions
   */
  safeParties?: Array<string>
}

/**
 *
 * @export
 * @interface V1ERC20MultiSigSignerAdded
 */
export interface V1ERC20MultiSigSignerAdded {
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  newSigner?: string
  /**
   * Nonce used.
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  nonce?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  signatureId?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  submitter?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  timestamp?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerAdded
   */
  validatorId?: string
}

/**
 *
 * @export
 * @interface V1ERC20MultiSigSignerEvent
 */
export interface V1ERC20MultiSigSignerEvent {
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  blockNumber?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  blockTime?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  logIndex?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  nonce?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  signer?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  txHash?: string
  /**
   *
   * @type {V1ERC20MultiSigSignerEventType}
   * @memberof V1ERC20MultiSigSignerEvent
   */
  type?: V1ERC20MultiSigSignerEventType
}

/**
 *
 * @export
 * @enum {string}
 */
export enum V1ERC20MultiSigSignerEventType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  ADDED = 'TYPE_ADDED' as any,
  REMOVED = 'TYPE_REMOVED' as any
}

/**
 *
 * @export
 * @interface V1ERC20MultiSigSignerRemoved
 */
export interface V1ERC20MultiSigSignerRemoved {
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemoved
   */
  epochSeq?: string
  /**
   * Nonce used.
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemoved
   */
  nonce?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemoved
   */
  oldSigner?: string
  /**
   *
   * @type {Array<V1ERC20MultiSigSignerRemovedSubmitter>}
   * @memberof V1ERC20MultiSigSignerRemoved
   */
  signatureSubmitters?: Array<V1ERC20MultiSigSignerRemovedSubmitter>
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemoved
   */
  timestamp?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemoved
   */
  validatorId?: string
}

/**
 *
 * @export
 * @interface V1ERC20MultiSigSignerRemovedSubmitter
 */
export interface V1ERC20MultiSigSignerRemovedSubmitter {
  /**
   * Signature ID of the signer removed.
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemovedSubmitter
   */
  signatureId?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigSignerRemovedSubmitter
   */
  submitter?: string
}

/**
 *
 * @export
 * @interface V1ERC20MultiSigThresholdSetEvent
 */
export interface V1ERC20MultiSigThresholdSetEvent {
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  blockNumber?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  blockTime?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  logIndex?: string
  /**
   *
   * @type {number}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  newThreshold?: number
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  nonce?: string
  /**
   *
   * @type {string}
   * @memberof V1ERC20MultiSigThresholdSetEvent
   */
  txHash?: string
}

/**
 *
 * @export
 * @interface V1ETHAddress
 */
export interface V1ETHAddress {
  /**
   *
   * @type {string}
   * @memberof V1ETHAddress
   */
  address?: string
}

/**
 *
 * @export
 * @interface V1EndBlock
 */
export interface V1EndBlock {
  /**
   *
   * @type {string}
   * @memberof V1EndBlock
   */
  height?: string
}

/**
 *
 * @export
 * @interface V1EpochEvent
 */
export interface V1EpochEvent {
  /**
   *
   * @type {VegaEpochAction}
   * @memberof V1EpochEvent
   */
  action?: VegaEpochAction
  /**
   *
   * @type {string}
   * @memberof V1EpochEvent
   */
  endTime?: string
  /**
   *
   * @type {string}
   * @memberof V1EpochEvent
   */
  expireTime?: string
  /**
   *
   * @type {string}
   * @memberof V1EpochEvent
   */
  seq?: string
  /**
   *
   * @type {string}
   * @memberof V1EpochEvent
   */
  startTime?: string
}

/**
 *
 * @export
 * @interface V1EthereumKeyRotateSubmission
 */
export interface V1EthereumKeyRotateSubmission {
  /**
   * Currently used public address.
   * @type {string}
   * @memberof V1EthereumKeyRotateSubmission
   */
  currentAddress?: string
  /**
   *
   * @type {V1Signature}
   * @memberof V1EthereumKeyRotateSubmission
   */
  ethereumSignature?: V1Signature
  /**
   * New address to rotate to.
   * @type {string}
   * @memberof V1EthereumKeyRotateSubmission
   */
  newAddress?: string
  /**
   * Ethereum public key to use as a submitter to allow automatic signature generation.
   * @type {string}
   * @memberof V1EthereumKeyRotateSubmission
   */
  submitterAddress?: string
  /**
   * Target block at which the key rotation will take effect on.
   * @type {string}
   * @memberof V1EthereumKeyRotateSubmission
   */
  targetBlock?: string
}

/**
 *
 * @export
 * @interface V1EthereumKeyRotation
 */
export interface V1EthereumKeyRotation {
  /**
   *
   * @type {string}
   * @memberof V1EthereumKeyRotation
   */
  blockHeight?: string
  /**
   *
   * @type {string}
   * @memberof V1EthereumKeyRotation
   */
  newAddress?: string
  /**
   *
   * @type {string}
   * @memberof V1EthereumKeyRotation
   */
  nodeId?: string
  /**
   *
   * @type {string}
   * @memberof V1EthereumKeyRotation
   */
  oldAddress?: string
}

/**
 *
 * @export
 * @interface V1ExpiredOrders
 */
export interface V1ExpiredOrders {
  /**
   *
   * @type {string}
   * @memberof V1ExpiredOrders
   */
  marketId?: string
  /**
   *
   * @type {Array<string>}
   * @memberof V1ExpiredOrders
   */
  orderIds?: Array<string>
}

/**
 *
 * @export
 * @interface V1ExternalData
 */
export interface V1ExternalData {
  /**
   *
   * @type {V1Data}
   * @memberof V1ExternalData
   */
  data?: V1Data
}

/**
 * Filter describes the conditions under which a data source data is considered of interest or not.
 * @export
 * @interface V1Filter
 */
export interface V1Filter {
  /**
   * Conditions that should be matched by the data to be considered of interest.
   * @type {Array<V1Condition>}
   * @memberof V1Filter
   */
  conditions?: Array<V1Condition>
  /**
   *
   * @type {V1PropertyKey}
   * @memberof V1Filter
   */
  key?: V1PropertyKey
}

/**
 *
 * @export
 * @interface V1GetSpamStatisticsResponse
 */
export interface V1GetSpamStatisticsResponse {
  /**
   * Chain ID for which the statistics are captured.
   * @type {string}
   * @memberof V1GetSpamStatisticsResponse
   */
  chainId?: string
  /**
   *
   * @type {V1SpamStatistics}
   * @memberof V1GetSpamStatisticsResponse
   */
  statistics?: V1SpamStatistics
}

/**
 *
 * @export
 * @interface V1GetVegaTimeResponse
 */
export interface V1GetVegaTimeResponse {
  /**
   *
   * @type {string}
   * @memberof V1GetVegaTimeResponse
   */
  timestamp?: string
}

/**
 *
 * @export
 * @interface V1IssueSignatures
 */
export interface V1IssueSignatures {
  /**
   *
   * @type {V1NodeSignatureKind}
   * @memberof V1IssueSignatures
   */
  kind?: V1NodeSignatureKind
  /**
   * Ethereum address which will submit the signatures to the smart contract.
   * @type {string}
   * @memberof V1IssueSignatures
   */
  submitter?: string
  /**
   * Node ID of the validator node that will be signed in or out of the smart contract.
   * @type {string}
   * @memberof V1IssueSignatures
   */
  validatorNodeId?: string
}

/**
 *
 * @export
 * @interface V1KeyRotateSubmission
 */
export interface V1KeyRotateSubmission {
  /**
   * Hash of currently used public key.
   * @type {string}
   * @memberof V1KeyRotateSubmission
   */
  currentPubKeyHash?: string
  /**
   * New public key to rotate to.
   * @type {string}
   * @memberof V1KeyRotateSubmission
   */
  newPubKey?: string
  /**
   * New Vega public key derivation index.
   * @type {number}
   * @memberof V1KeyRotateSubmission
   */
  newPubKeyIndex?: number
  /**
   * Target block at which the key rotation will take effect on.
   * @type {string}
   * @memberof V1KeyRotateSubmission
   */
  targetBlock?: string
}

/**
 *
 * @export
 * @interface V1KeyRotation
 */
export interface V1KeyRotation {
  /**
   *
   * @type {string}
   * @memberof V1KeyRotation
   */
  blockHeight?: string
  /**
   *
   * @type {string}
   * @memberof V1KeyRotation
   */
  newPubKey?: string
  /**
   *
   * @type {string}
   * @memberof V1KeyRotation
   */
  nodeId?: string
  /**
   *
   * @type {string}
   * @memberof V1KeyRotation
   */
  oldPubKey?: string
}

/**
 *
 * @export
 * @interface V1LastBlockHeightResponse
 */
export interface V1LastBlockHeightResponse {
  /**
   *
   * @type {string}
   * @memberof V1LastBlockHeightResponse
   */
  chainId?: string
  /**
   *
   * @type {string}
   * @memberof V1LastBlockHeightResponse
   */
  hash?: string
  /**
   *
   * @type {string}
   * @memberof V1LastBlockHeightResponse
   */
  height?: string
  /**
   *
   * @type {number}
   * @memberof V1LastBlockHeightResponse
   */
  spamPowDifficulty?: number
  /**
   *
   * @type {string}
   * @memberof V1LastBlockHeightResponse
   */
  spamPowHashFunction?: string
  /**
   *
   * @type {boolean}
   * @memberof V1LastBlockHeightResponse
   */
  spamPowIncreasingDifficulty?: boolean
  /**
   *
   * @type {number}
   * @memberof V1LastBlockHeightResponse
   */
  spamPowNumberOfPastBlocks?: number
  /**
   *
   * @type {number}
   * @memberof V1LastBlockHeightResponse
   */
  spamPowNumberOfTxPerBlock?: number
}

/**
 *
 * @export
 * @interface V1LedgerMovements
 */
export interface V1LedgerMovements {
  /**
   *
   * @type {Array<VegaLedgerMovement>}
   * @memberof V1LedgerMovements
   */
  ledgerMovements?: Array<VegaLedgerMovement>
}

/**
 *
 * @export
 * @interface V1LiquidityProvisionAmendment
 */
export interface V1LiquidityProvisionAmendment {
  /**
   *
   * @type {Array<VegaLiquidityOrder>}
   * @memberof V1LiquidityProvisionAmendment
   */
  buys?: Array<VegaLiquidityOrder>
  /**
   * From here at least one of the following is required to consider the command valid.
   * @type {string}
   * @memberof V1LiquidityProvisionAmendment
   */
  commitmentAmount?: string
  /**
   *
   * @type {string}
   * @memberof V1LiquidityProvisionAmendment
   */
  fee?: string
  /**
   * Unique ID for the market with the liquidity provision to be amended.
   * @type {string}
   * @memberof V1LiquidityProvisionAmendment
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1LiquidityProvisionAmendment
   */
  reference?: string
  /**
   *
   * @type {Array<VegaLiquidityOrder>}
   * @memberof V1LiquidityProvisionAmendment
   */
  sells?: Array<VegaLiquidityOrder>
}

/**
 *
 * @export
 * @interface V1LiquidityProvisionCancellation
 */
export interface V1LiquidityProvisionCancellation {
  /**
   * Unique ID for the market with the liquidity provision to be cancelled.
   * @type {string}
   * @memberof V1LiquidityProvisionCancellation
   */
  marketId?: string
}

/**
 *
 * @export
 * @interface V1LiquidityProvisionSubmission
 */
export interface V1LiquidityProvisionSubmission {
  /**
   * Set of liquidity buy orders to meet the liquidity provision obligation.
   * @type {Array<VegaLiquidityOrder>}
   * @memberof V1LiquidityProvisionSubmission
   */
  buys?: Array<VegaLiquidityOrder>
  /**
   * Specified as a unitless number that represents the amount of settlement asset of the market. This field is an unsigned integer scaled using the asset's decimal places.
   * @type {string}
   * @memberof V1LiquidityProvisionSubmission
   */
  commitmentAmount?: string
  /**
   * Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per setting fees and rewarding liquidity providers.
   * @type {string}
   * @memberof V1LiquidityProvisionSubmission
   */
  fee?: string
  /**
   * Market ID for the order, required field.
   * @type {string}
   * @memberof V1LiquidityProvisionSubmission
   */
  marketId?: string
  /**
   * Reference to be added to every order created out of this liquidityProvisionSubmission.
   * @type {string}
   * @memberof V1LiquidityProvisionSubmission
   */
  reference?: string
  /**
   * Set of liquidity sell orders to meet the liquidity provision obligation.
   * @type {Array<VegaLiquidityOrder>}
   * @memberof V1LiquidityProvisionSubmission
   */
  sells?: Array<VegaLiquidityOrder>
}

/**
 *
 * @export
 * @interface V1LossSocialization
 */
export interface V1LossSocialization {
  /**
   *
   * @type {string}
   * @memberof V1LossSocialization
   */
  amount?: string
  /**
   *
   * @type {string}
   * @memberof V1LossSocialization
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1LossSocialization
   */
  partyId?: string
}

/**
 *
 * @export
 * @interface V1MarketEvent
 */
export interface V1MarketEvent {
  /**
   *
   * @type {string}
   * @memberof V1MarketEvent
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1MarketEvent
   */
  payload?: string
}

/**
 *
 * @export
 * @interface V1MarketTick
 */
export interface V1MarketTick {
  /**
   *
   * @type {string}
   * @memberof V1MarketTick
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof V1MarketTick
   */
  time?: string
}

/**
 *
 * @export
 * @interface V1NodeSignature
 */
export interface V1NodeSignature {
  /**
   * ID of the resource being signed.
   * @type {string}
   * @memberof V1NodeSignature
   */
  id?: string
  /**
   *
   * @type {V1NodeSignatureKind}
   * @memberof V1NodeSignature
   */
  kind?: V1NodeSignatureKind
  /**
   * The signature generated by the signer.
   * @type {string}
   * @memberof V1NodeSignature
   */
  sig?: string
}

/**
 * - NODE_SIGNATURE_KIND_UNSPECIFIED: Represents an unspecified or missing value from the input  - NODE_SIGNATURE_KIND_ASSET_NEW: Represents a signature for a new asset allow-listing  - NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL: Represents a signature for an asset withdrawal  - NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED: Represents a signature for a new signer added to the erc20 multisig contract  - NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED: Represents a signature for a signer removed from the erc20 multisig contract  - NODE_SIGNATURE_KIND_ASSET_UPDATE: Represents a signature for an asset update allow-listing
 * @export
 * @enum {string}
 */
export enum V1NodeSignatureKind {
  UNSPECIFIED = 'NODE_SIGNATURE_KIND_UNSPECIFIED' as any,
  ASSETNEW = 'NODE_SIGNATURE_KIND_ASSET_NEW' as any,
  ASSETWITHDRAWAL = 'NODE_SIGNATURE_KIND_ASSET_WITHDRAWAL' as any,
  ERC20MULTISIGSIGNERADDED = 'NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_ADDED' as any,
  ERC20MULTISIGSIGNERREMOVED = 'NODE_SIGNATURE_KIND_ERC20_MULTISIG_SIGNER_REMOVED' as any,
  ASSETUPDATE = 'NODE_SIGNATURE_KIND_ASSET_UPDATE' as any
}

/**
 *
 * @export
 * @interface V1ObserveEventBusResponse
 */
export interface V1ObserveEventBusResponse {
  /**
   * One or more events that match the subscription request criteria.
   * @type {Array<V1BusEvent>}
   * @memberof V1ObserveEventBusResponse
   */
  events?: Array<V1BusEvent>
}

/**
 *
 * @export
 * @interface V1OracleDataSubmission
 */
export interface V1OracleDataSubmission {
  /**
   * Data provided by the data source In the case of Open Oracle - it will be the entire object - it will contain messages, signatures and price data.
   * @type {string}
   * @memberof V1OracleDataSubmission
   */
  payload?: string
  /**
   *
   * @type {OracleDataSubmissionOracleSource}
   * @memberof V1OracleDataSubmission
   */
  source?: OracleDataSubmissionOracleSource
}

/**
 *
 * @export
 * @interface V1OrderAmendment
 */
export interface V1OrderAmendment {
  /**
   * Amend the expiry time for the order, if the Timestamp value is set, otherwise expiry time will remain unchanged.
   * @type {string}
   * @memberof V1OrderAmendment
   */
  expiresAt?: string
  /**
   * Market ID, this is required to find the order and will not be updated.
   * @type {string}
   * @memberof V1OrderAmendment
   */
  marketId?: string
  /**
   * Order ID, this is required to find the order and will not be updated, required field.
   * @type {string}
   * @memberof V1OrderAmendment
   */
  orderId?: string
  /**
   * Amend the pegged order offset for the order. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof V1OrderAmendment
   */
  peggedOffset?: string
  /**
   *
   * @type {VegaPeggedReference}
   * @memberof V1OrderAmendment
   */
  peggedReference?: VegaPeggedReference
  /**
   * Amend the price for the order if the price value is set, otherwise price will remain unchanged. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof V1OrderAmendment
   */
  price?: string
  /**
   * Amend the size for the order by the delta specified: - To reduce the size from the current value set a negative integer value - To increase the size from the current value, set a positive integer value - To leave the size unchanged set a value of zero This field needs to be scaled using the market's position decimal places.
   * @type {string}
   * @memberof V1OrderAmendment
   */
  sizeDelta?: string
  /**
   *
   * @type {OrderTimeInForce}
   * @memberof V1OrderAmendment
   */
  timeInForce?: OrderTimeInForce
}

/**
 *
 * @export
 * @interface V1OrderCancellation
 */
export interface V1OrderCancellation {
  /**
   * Market ID for the order, required field.
   * @type {string}
   * @memberof V1OrderCancellation
   */
  marketId?: string
  /**
   * Unique ID for the order. This is set by the system after consensus. Required field.
   * @type {string}
   * @memberof V1OrderCancellation
   */
  orderId?: string
}

/**
 *
 * @export
 * @interface V1OrderSubmission
 */
export interface V1OrderSubmission {
  /**
   * Timestamp for when the order will expire, in nanoseconds, required field only for `Order.TimeInForce`.TIME_IN_FORCE_GTT`.
   * @type {string}
   * @memberof V1OrderSubmission
   */
  expiresAt?: string
  /**
   * Market ID for the order, required field.
   * @type {string}
   * @memberof V1OrderSubmission
   */
  marketId?: string
  /**
   *
   * @type {VegaPeggedOrder}
   * @memberof V1OrderSubmission
   */
  peggedOrder?: VegaPeggedOrder
  /**
   * Only valid for Limit orders. Cannot be True at the same time as Reduce-Only.
   * @type {boolean}
   * @memberof V1OrderSubmission
   */
  postOnly?: boolean
  /**
   * Price for the order, the price is an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places, required field for limit orders, however it is not required for market orders. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof V1OrderSubmission
   */
  price?: string
  /**
   * Only valid for Non-Persistent orders. Cannot be True at the same time as Post-Only. If set, order will only be executed if the outcome of the trade moves the trader's position closer to 0.
   * @type {boolean}
   * @memberof V1OrderSubmission
   */
  reduceOnly?: boolean
  /**
   * Reference given for the order, this is typically used to retrieve an order submitted through consensus, currently set internally by the node to return a unique reference ID for the order submission.
   * @type {string}
   * @memberof V1OrderSubmission
   */
  reference?: string
  /**
   *
   * @type {VegaSide}
   * @memberof V1OrderSubmission
   */
  side?: VegaSide
  /**
   * Size for the order, for example, in a futures market the size equals the number of units, cannot be negative.
   * @type {string}
   * @memberof V1OrderSubmission
   */
  size?: string
  /**
   *
   * @type {OrderTimeInForce}
   * @memberof V1OrderSubmission
   */
  timeInForce?: OrderTimeInForce
  /**
   *
   * @type {VegaOrderType}
   * @memberof V1OrderSubmission
   */
  type?: VegaOrderType
}

/**
 *
 * @export
 * @interface V1PoWBlockState
 */
export interface V1PoWBlockState {
  /**
   *
   * @type {string}
   * @memberof V1PoWBlockState
   */
  blockHash?: string
  /**
   *
   * @type {string}
   * @memberof V1PoWBlockState
   */
  blockHeight?: string
  /**
   *
   * @type {string}
   * @memberof V1PoWBlockState
   */
  difficulty?: string
  /**
   * This is the minimum required difficulty for the next transaction submitted on this block if it is possible to submit more transactions on this block, otherwise nil.
   * @type {string}
   * @memberof V1PoWBlockState
   */
  expectedDifficulty?: string
  /**
   *
   * @type {string}
   * @memberof V1PoWBlockState
   */
  hashFunction?: string
  /**
   *
   * @type {boolean}
   * @memberof V1PoWBlockState
   */
  increasingDifficulty?: boolean
  /**
   *
   * @type {string}
   * @memberof V1PoWBlockState
   */
  transactionsSeen?: string
  /**
   *
   * @type {string}
   * @memberof V1PoWBlockState
   */
  txPerBlock?: string
}

/**
 *
 * @export
 * @interface V1PoWStatistic
 */
export interface V1PoWStatistic {
  /**
   *
   * @type {string}
   * @memberof V1PoWStatistic
   */
  bannedUntil?: string
  /**
   *
   * @type {Array<V1PoWBlockState>}
   * @memberof V1PoWStatistic
   */
  blockStates?: Array<V1PoWBlockState>
  /**
   *
   * @type {string}
   * @memberof V1PoWStatistic
   */
  numberOfPastBlocks?: string
}

/**
 *
 * @export
 * @interface V1PositionResolution
 */
export interface V1PositionResolution {
  /**
   *
   * @type {string}
   * @memberof V1PositionResolution
   */
  closed?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionResolution
   */
  distressed?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionResolution
   */
  markPrice?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionResolution
   */
  marketId?: string
}

/**
 *
 * @export
 * @interface V1PositionStateEvent
 */
export interface V1PositionStateEvent {
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  partyId?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  potentialBuys?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  potentialSells?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  size?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  vwBuyPrice?: string
  /**
   *
   * @type {string}
   * @memberof V1PositionStateEvent
   */
  vwSellPrice?: string
}

/**
 *
 * @export
 * @interface V1ProofOfWork
 */
export interface V1ProofOfWork {
  /**
   * Number which, combined with the transaction identifier, will produce a hash with the required number of leading zeros to be accepted by the network.
   * @type {string}
   * @memberof V1ProofOfWork
   */
  nonce?: string
  /**
   * Unique transaction identifier used to seed the proof-of-work hash.
   * @type {string}
   * @memberof V1ProofOfWork
   */
  tid?: string
}

/**
 *
 * @export
 * @interface V1PropagateChainEventResponse
 */
export interface V1PropagateChainEventResponse {
  /**
   *
   * @type {boolean}
   * @memberof V1PropagateChainEventResponse
   */
  success?: boolean
}

/**
 * Property describes one property of data spec with a key with its value.
 * @export
 * @interface V1Property
 */
export interface V1Property {
  /**
   * Name of the property.
   * @type {string}
   * @memberof V1Property
   */
  name?: string
  /**
   * Value of the property.
   * @type {string}
   * @memberof V1Property
   */
  value?: string
}

/**
 * PropertyKey describes the property key contained in data source data.
 * @export
 * @interface V1PropertyKey
 */
export interface V1PropertyKey {
  /**
   * Name of the property.
   * @type {string}
   * @memberof V1PropertyKey
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof V1PropertyKey
   */
  numberDecimalPlaces?: string
  /**
   *
   * @type {V1PropertyKeyType}
   * @memberof V1PropertyKey
   */
  type?: V1PropertyKeyType
}

/**
 * Type describes the data type of properties that are supported by the data source engine.   - TYPE_UNSPECIFIED: The default value.  - TYPE_EMPTY: Any type.  - TYPE_INTEGER: Integer type.  - TYPE_STRING: String type.  - TYPE_BOOLEAN: Boolean type.  - TYPE_DECIMAL: Any floating point decimal type.  - TYPE_TIMESTAMP: Timestamp date type.
 * @export
 * @enum {string}
 */
export enum V1PropertyKeyType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  EMPTY = 'TYPE_EMPTY' as any,
  INTEGER = 'TYPE_INTEGER' as any,
  STRING = 'TYPE_STRING' as any,
  BOOLEAN = 'TYPE_BOOLEAN' as any,
  DECIMAL = 'TYPE_DECIMAL' as any,
  TIMESTAMP = 'TYPE_TIMESTAMP' as any
}

/**
 *
 * @export
 * @interface V1ProposalSubmission
 */
export interface V1ProposalSubmission {
  /**
   *
   * @type {VegaProposalRationale}
   * @memberof V1ProposalSubmission
   */
  rationale?: VegaProposalRationale
  /**
   * Reference identifying the proposal.
   * @type {string}
   * @memberof V1ProposalSubmission
   */
  reference?: string
  /**
   *
   * @type {VegaProposalTerms}
   * @memberof V1ProposalSubmission
   */
  terms?: VegaProposalTerms
}

/**
 *
 * @export
 * @interface V1ProtocolUpgradeDataNodeReady
 */
export interface V1ProtocolUpgradeDataNodeReady {
  /**
   *
   * @type {string}
   * @memberof V1ProtocolUpgradeDataNodeReady
   */
  lastBlockHeight?: string
}

/**
 *
 * @export
 * @interface V1ProtocolUpgradeEvent
 */
export interface V1ProtocolUpgradeEvent {
  /**
   *
   * @type {Array<string>}
   * @memberof V1ProtocolUpgradeEvent
   */
  approvers?: Array<string>
  /**
   *
   * @type {V1ProtocolUpgradeProposalStatus}
   * @memberof V1ProtocolUpgradeEvent
   */
  status?: V1ProtocolUpgradeProposalStatus
  /**
   *
   * @type {string}
   * @memberof V1ProtocolUpgradeEvent
   */
  upgradeBlockHeight?: string
  /**
   *
   * @type {string}
   * @memberof V1ProtocolUpgradeEvent
   */
  vegaReleaseTag?: string
}

/**
 *
 * @export
 * @interface V1ProtocolUpgradeProposal
 */
export interface V1ProtocolUpgradeProposal {
  /**
   * Block height at which to perform the upgrade.
   * @type {string}
   * @memberof V1ProtocolUpgradeProposal
   */
  upgradeBlockHeight?: string
  /**
   * Release tag for the Vega binary.
   * @type {string}
   * @memberof V1ProtocolUpgradeProposal
   */
  vegaReleaseTag?: string
}

/**
 *
 * @export
 * @enum {string}
 */
export enum V1ProtocolUpgradeProposalStatus {
  UNSPECIFIED = 'PROTOCOL_UPGRADE_PROPOSAL_STATUS_UNSPECIFIED' as any,
  PENDING = 'PROTOCOL_UPGRADE_PROPOSAL_STATUS_PENDING' as any,
  APPROVED = 'PROTOCOL_UPGRADE_PROPOSAL_STATUS_APPROVED' as any,
  REJECTED = 'PROTOCOL_UPGRADE_PROPOSAL_STATUS_REJECTED' as any
}

/**
 *
 * @export
 * @interface V1ProtocolUpgradeStarted
 */
export interface V1ProtocolUpgradeStarted {
  /**
   *
   * @type {string}
   * @memberof V1ProtocolUpgradeStarted
   */
  lastBlockHeight?: string
}

/**
 * PubKey is the public key that signed this data. Different public keys coming from different sources will be further separated.
 * @export
 * @interface V1PubKey
 */
export interface V1PubKey {
  /**
   *
   * @type {string}
   * @memberof V1PubKey
   */
  key?: string
}

/**
 *
 * @export
 * @interface V1RewardPayoutEvent
 */
export interface V1RewardPayoutEvent {
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  amount?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  asset?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  market?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  party?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  percentOfTotalReward?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  rewardType?: string
  /**
   *
   * @type {string}
   * @memberof V1RewardPayoutEvent
   */
  timestamp?: string
}

/**
 *
 * @export
 * @interface V1SettleDistressed
 */
export interface V1SettleDistressed {
  /**
   *
   * @type {string}
   * @memberof V1SettleDistressed
   */
  margin?: string
  /**
   *
   * @type {string}
   * @memberof V1SettleDistressed
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1SettleDistressed
   */
  partyId?: string
  /**
   *
   * @type {string}
   * @memberof V1SettleDistressed
   */
  price?: string
}

/**
 *
 * @export
 * @interface V1SettleMarket
 */
export interface V1SettleMarket {
  /**
   *
   * @type {string}
   * @memberof V1SettleMarket
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1SettleMarket
   */
  positionFactor?: string
  /**
   *
   * @type {string}
   * @memberof V1SettleMarket
   */
  price?: string
}

/**
 *
 * @export
 * @interface V1SettlePosition
 */
export interface V1SettlePosition {
  /**
   *
   * @type {string}
   * @memberof V1SettlePosition
   */
  marketId?: string
  /**
   *
   * @type {string}
   * @memberof V1SettlePosition
   */
  partyId?: string
  /**
   *
   * @type {string}
   * @memberof V1SettlePosition
   */
  positionFactor?: string
  /**
   *
   * @type {string}
   * @memberof V1SettlePosition
   */
  price?: string
  /**
   *
   * @type {Array<V1TradeSettlement>}
   * @memberof V1SettlePosition
   */
  tradeSettlements?: Array<V1TradeSettlement>
}

/**
 * Signature to authenticate a transaction and to be verified by the Vega network.
 * @export
 * @interface V1Signature
 */
export interface V1Signature {
  /**
   * Algorithm used to create the signature.
   * @type {string}
   * @memberof V1Signature
   */
  algo?: string
  /**
   * Hex encoded bytes of the signature.
   * @type {string}
   * @memberof V1Signature
   */
  value?: string
  /**
   * Version of the signature used to create the signature.
   * @type {number}
   * @memberof V1Signature
   */
  version?: number
}

/**
 *
 * @export
 * @interface V1Signer
 */
export interface V1Signer {
  /**
   *
   * @type {V1ETHAddress}
   * @memberof V1Signer
   */
  ethAddress?: V1ETHAddress
  /**
   *
   * @type {V1PubKey}
   * @memberof V1Signer
   */
  pubKey?: V1PubKey
}

/**
 *
 * @export
 * @interface V1SpamStatistic
 */
export interface V1SpamStatistic {
  /**
   *
   * @type {string}
   * @memberof V1SpamStatistic
   */
  bannedUntil?: string
  /**
   *
   * @type {string}
   * @memberof V1SpamStatistic
   */
  countForEpoch?: string
  /**
   *
   * @type {string}
   * @memberof V1SpamStatistic
   */
  maxForEpoch?: string
  /**
   *
   * @type {string}
   * @memberof V1SpamStatistic
   */
  minTokensRequired?: string
}

/**
 *
 * @export
 * @interface V1SpamStatistics
 */
export interface V1SpamStatistics {
  /**
   *
   * @type {V1SpamStatistic}
   * @memberof V1SpamStatistics
   */
  delegations?: V1SpamStatistic
  /**
   *
   * @type {string}
   * @memberof V1SpamStatistics
   */
  epochSeq?: string
  /**
   *
   * @type {V1SpamStatistic}
   * @memberof V1SpamStatistics
   */
  issueSignatures?: V1SpamStatistic
  /**
   *
   * @type {V1SpamStatistic}
   * @memberof V1SpamStatistics
   */
  nodeAnnouncements?: V1SpamStatistic
  /**
   *
   * @type {V1PoWStatistic}
   * @memberof V1SpamStatistics
   */
  pow?: V1PoWStatistic
  /**
   *
   * @type {V1SpamStatistic}
   * @memberof V1SpamStatistics
   */
  proposals?: V1SpamStatistic
  /**
   *
   * @type {V1SpamStatistic}
   * @memberof V1SpamStatistics
   */
  transfers?: V1SpamStatistic
  /**
   *
   * @type {V1VoteSpamStatistics}
   * @memberof V1SpamStatistics
   */
  votes?: V1VoteSpamStatistics
}

/**
 *
 * @export
 * @interface V1StakeLinking
 */
export interface V1StakeLinking {
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  amount?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  blockHeight?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  blockTime?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  ethereumAddress?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  finalizedAt?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  logIndex?: string
  /**
   * Party to whom the event is directed at.
   * @type {string}
   * @memberof V1StakeLinking
   */
  party?: string
  /**
   *
   * @type {V1StakeLinkingStatus}
   * @memberof V1StakeLinking
   */
  status?: V1StakeLinkingStatus
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  ts?: string
  /**
   *
   * @type {string}
   * @memberof V1StakeLinking
   */
  txHash?: string
  /**
   *
   * @type {V1StakeLinkingType}
   * @memberof V1StakeLinking
   */
  type?: V1StakeLinkingType
}

/**
 *
 * @export
 * @enum {string}
 */
export enum V1StakeLinkingStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  PENDING = 'STATUS_PENDING' as any,
  ACCEPTED = 'STATUS_ACCEPTED' as any,
  REJECTED = 'STATUS_REJECTED' as any
}

/**
 *
 * @export
 * @enum {string}
 */
export enum V1StakeLinkingType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  LINK = 'TYPE_LINK' as any,
  UNLINK = 'TYPE_UNLINK' as any
}

/**
 *
 * @export
 * @interface V1StateVar
 */
export interface V1StateVar {
  /**
   *
   * @type {string}
   * @memberof V1StateVar
   */
  eventId?: string
  /**
   *
   * @type {string}
   * @memberof V1StateVar
   */
  id?: string
  /**
   *
   * @type {string}
   * @memberof V1StateVar
   */
  state?: string
}

/**
 *
 * @export
 * @interface V1Statistics
 */
export interface V1Statistics {
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  accountSubscriptions?: number
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  appVersion?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  appVersionHash?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  averageOrdersPerBlock?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  averageTxBytes?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  backlogLength?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  blockDuration?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  blockHash?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  blockHeight?: string
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  candleSubscriptions?: number
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  chainId?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  chainVersion?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  currentTime?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  epochExpiryTime?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  epochStartTime?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  eventCount?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  eventsPerSecond?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  genesisTime?: string
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  marketDataSubscriptions?: number
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  marketDepthSubscriptions?: number
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  marketDepthUpdatesSubscriptions?: number
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  orderSubscriptions?: number
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  ordersPerSecond?: string
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  positionsSubscriptions?: number
  /**
   *
   * @type {VegaChainStatus}
   * @memberof V1Statistics
   */
  status?: VegaChainStatus
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalAmendOrder?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalCancelOrder?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalCreateOrder?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalMarkets?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalOrders?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalPeers?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  totalTrades?: string
  /**
   *
   * @type {number}
   * @memberof V1Statistics
   */
  tradeSubscriptions?: number
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  tradesPerSecond?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  txPerBlock?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  uptime?: string
  /**
   *
   * @type {string}
   * @memberof V1Statistics
   */
  vegaTime?: string
}

/**
 *
 * @export
 * @interface V1StatisticsResponse
 */
export interface V1StatisticsResponse {
  /**
   *
   * @type {V1Statistics}
   * @memberof V1StatisticsResponse
   */
  statistics?: V1Statistics
}

/**
 *
 * @export
 * @interface V1SubmitRawTransactionRequest
 */
export interface V1SubmitRawTransactionRequest {
  /**
   *
   * @type {string}
   * @memberof V1SubmitRawTransactionRequest
   */
  tx: string
  /**
   *
   * @type {V1SubmitRawTransactionRequestType}
   * @memberof V1SubmitRawTransactionRequest
   */
  type?: V1SubmitRawTransactionRequestType
}

/**
 * - TYPE_ASYNC: Transaction will be submitted without waiting for response  - TYPE_SYNC: Transaction will be submitted, and blocking until the tendermint mempool returns a response  - TYPE_COMMIT: Transaction will be submitted, and blocking until the tendermint network has committed it into a block. Used only for debugging, not for submitting transactions
 * @export
 * @enum {string}
 */
export enum V1SubmitRawTransactionRequestType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  ASYNC = 'TYPE_ASYNC' as any,
  SYNC = 'TYPE_SYNC' as any,
  COMMIT = 'TYPE_COMMIT' as any
}

/**
 *
 * @export
 * @interface V1SubmitRawTransactionResponse
 */
export interface V1SubmitRawTransactionResponse {
  /**
   *
   * @type {number}
   * @memberof V1SubmitRawTransactionResponse
   */
  code?: number
  /**
   *
   * @type {string}
   * @memberof V1SubmitRawTransactionResponse
   */
  data?: string
  /**
   *
   * @type {string}
   * @memberof V1SubmitRawTransactionResponse
   */
  height?: string
  /**
   *
   * @type {string}
   * @memberof V1SubmitRawTransactionResponse
   */
  log?: string
  /**
   *
   * @type {boolean}
   * @memberof V1SubmitRawTransactionResponse
   */
  success?: boolean
  /**
   *
   * @type {string}
   * @memberof V1SubmitRawTransactionResponse
   */
  txHash?: string
}

/**
 *
 * @export
 * @interface V1SubmitTransactionRequest
 */
export interface V1SubmitTransactionRequest {
  /**
   *
   * @type {V1Transaction}
   * @memberof V1SubmitTransactionRequest
   */
  tx?: V1Transaction
  /**
   *
   * @type {V1SubmitTransactionRequestType}
   * @memberof V1SubmitTransactionRequest
   */
  type?: V1SubmitTransactionRequestType
}

/**
 * - TYPE_ASYNC: Transaction will be submitted without waiting for response  - TYPE_SYNC: Transaction will be submitted, and blocking until the tendermint mempool returns a response  - TYPE_COMMIT: Transaction will be submitted, and blocking until the tendermint network has committed it into a block. Used only for debugging, not for submitting transactions
 * @export
 * @enum {string}
 */
export enum V1SubmitTransactionRequestType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  ASYNC = 'TYPE_ASYNC' as any,
  SYNC = 'TYPE_SYNC' as any,
  COMMIT = 'TYPE_COMMIT' as any
}

/**
 *
 * @export
 * @interface V1SubmitTransactionResponse
 */
export interface V1SubmitTransactionResponse {
  /**
   *
   * @type {number}
   * @memberof V1SubmitTransactionResponse
   */
  code?: number
  /**
   *
   * @type {string}
   * @memberof V1SubmitTransactionResponse
   */
  data?: string
  /**
   *
   * @type {string}
   * @memberof V1SubmitTransactionResponse
   */
  height?: string
  /**
   *
   * @type {string}
   * @memberof V1SubmitTransactionResponse
   */
  log?: string
  /**
   *
   * @type {boolean}
   * @memberof V1SubmitTransactionResponse
   */
  success?: boolean
  /**
   *
   * @type {string}
   * @memberof V1SubmitTransactionResponse
   */
  txHash?: string
}

/**
 *
 * @export
 * @interface V1TimeUpdate
 */
export interface V1TimeUpdate {
  /**
   *
   * @type {string}
   * @memberof V1TimeUpdate
   */
  timestamp?: string
}

/**
 *
 * @export
 * @interface V1TradeSettlement
 */
export interface V1TradeSettlement {
  /**
   *
   * @type {string}
   * @memberof V1TradeSettlement
   */
  marketPrice?: string
  /**
   *
   * @type {string}
   * @memberof V1TradeSettlement
   */
  price?: string
  /**
   *
   * @type {string}
   * @memberof V1TradeSettlement
   */
  size?: string
}

/**
 * Represents a transaction to be sent to Vega.
 * @export
 * @interface V1Transaction
 */
export interface V1Transaction {
  /**
   * Hex-encoded address of the sender. Not supported yet.
   * @type {string}
   * @memberof V1Transaction
   */
  address?: string
  /**
   * One of the set of Vega commands. These bytes are should be built as follows:   chain_id_as_bytes + \\0 character as delimiter + proto_marshalled_command.
   * @type {string}
   * @memberof V1Transaction
   */
  inputData?: string
  /**
   *
   * @type {V1ProofOfWork}
   * @memberof V1Transaction
   */
  pow?: V1ProofOfWork
  /**
   * Hex-encoded public key of the sender.
   * @type {string}
   * @memberof V1Transaction
   */
  pubKey?: string
  /**
   *
   * @type {V1Signature}
   * @memberof V1Transaction
   */
  signature?: V1Signature
  /**
   *
   * @type {V1TxVersion}
   * @memberof V1Transaction
   */
  version?: V1TxVersion
}

/**
 *
 * @export
 * @interface V1TransactionResult
 */
export interface V1TransactionResult {
  /**
   *
   * @type {V1AnnounceNode}
   * @memberof V1TransactionResult
   */
  announceNode?: V1AnnounceNode
  /**
   *
   * @type {V1BatchMarketInstructions}
   * @memberof V1TransactionResult
   */
  batchMarketInstructions?: V1BatchMarketInstructions
  /**
   *
   * @type {V1CancelTransfer}
   * @memberof V1TransactionResult
   */
  cancelTransfer?: V1CancelTransfer
  /**
   *
   * @type {V1DelegateSubmission}
   * @memberof V1TransactionResult
   */
  delegateSubmission?: V1DelegateSubmission
  /**
   *
   * @type {V1EthereumKeyRotateSubmission}
   * @memberof V1TransactionResult
   */
  ethereumKeyRotateSubmission?: V1EthereumKeyRotateSubmission
  /**
   *
   * @type {TransactionResultFailureDetails}
   * @memberof V1TransactionResult
   */
  failure?: TransactionResultFailureDetails
  /**
   *
   * @type {string}
   * @memberof V1TransactionResult
   */
  hash?: string
  /**
   *
   * @type {V1IssueSignatures}
   * @memberof V1TransactionResult
   */
  issueSignatures?: V1IssueSignatures
  /**
   *
   * @type {V1KeyRotateSubmission}
   * @memberof V1TransactionResult
   */
  keyRotateSubmission?: V1KeyRotateSubmission
  /**
   *
   * @type {V1LiquidityProvisionAmendment}
   * @memberof V1TransactionResult
   */
  liquidityProvisionAmendment?: V1LiquidityProvisionAmendment
  /**
   *
   * @type {V1LiquidityProvisionCancellation}
   * @memberof V1TransactionResult
   */
  liquidityProvisionCancellation?: V1LiquidityProvisionCancellation
  /**
   *
   * @type {V1LiquidityProvisionSubmission}
   * @memberof V1TransactionResult
   */
  liquidityProvisionSubmission?: V1LiquidityProvisionSubmission
  /**
   *
   * @type {V1OracleDataSubmission}
   * @memberof V1TransactionResult
   */
  oracleDataSubmission?: V1OracleDataSubmission
  /**
   *
   * @type {V1OrderAmendment}
   * @memberof V1TransactionResult
   */
  orderAmendment?: V1OrderAmendment
  /**
   *
   * @type {V1OrderCancellation}
   * @memberof V1TransactionResult
   */
  orderCancellation?: V1OrderCancellation
  /**
   *
   * @type {V1OrderSubmission}
   * @memberof V1TransactionResult
   */
  orderSubmission?: V1OrderSubmission
  /**
   *
   * @type {string}
   * @memberof V1TransactionResult
   */
  partyId?: string
  /**
   *
   * @type {V1ProposalSubmission}
   * @memberof V1TransactionResult
   */
  proposal?: V1ProposalSubmission
  /**
   *
   * @type {V1ProtocolUpgradeProposal}
   * @memberof V1TransactionResult
   */
  protocolUpgradeProposal?: V1ProtocolUpgradeProposal
  /**
   * Status of the transaction, did it succeed or an error was raised.
   * @type {boolean}
   * @memberof V1TransactionResult
   */
  status?: boolean
  /**
   *
   * @type {TransactionResultSuccessDetails}
   * @memberof V1TransactionResult
   */
  success?: TransactionResultSuccessDetails
  /**
   *
   * @type {Vegacommandsv1Transfer}
   * @memberof V1TransactionResult
   */
  transfer?: Vegacommandsv1Transfer
  /**
   *
   * @type {V1UndelegateSubmission}
   * @memberof V1TransactionResult
   */
  undelegateSubmission?: V1UndelegateSubmission
  /**
   *
   * @type {V1VoteSubmission}
   * @memberof V1TransactionResult
   */
  voteSubmission?: V1VoteSubmission
  /**
   *
   * @type {V1WithdrawSubmission}
   * @memberof V1TransactionResult
   */
  withdrawSubmission?: V1WithdrawSubmission
}

/**
 *
 * @export
 * @enum {string}
 */
export enum V1TransferStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  PENDING = 'STATUS_PENDING' as any,
  DONE = 'STATUS_DONE' as any,
  REJECTED = 'STATUS_REJECTED' as any,
  STOPPED = 'STATUS_STOPPED' as any,
  CANCELLED = 'STATUS_CANCELLED' as any
}

/**
 *
 * @export
 * @interface V1TxErrorEvent
 */
export interface V1TxErrorEvent {
  /**
   *
   * @type {V1AnnounceNode}
   * @memberof V1TxErrorEvent
   */
  announceNode?: V1AnnounceNode
  /**
   *
   * @type {V1BatchMarketInstructions}
   * @memberof V1TxErrorEvent
   */
  batchMarketInstructions?: V1BatchMarketInstructions
  /**
   *
   * @type {V1CancelTransfer}
   * @memberof V1TxErrorEvent
   */
  cancelTransfer?: V1CancelTransfer
  /**
   *
   * @type {V1DelegateSubmission}
   * @memberof V1TxErrorEvent
   */
  delegateSubmission?: V1DelegateSubmission
  /**
   *
   * @type {string}
   * @memberof V1TxErrorEvent
   */
  errMsg?: string
  /**
   *
   * @type {V1IssueSignatures}
   * @memberof V1TxErrorEvent
   */
  issueSignatures?: V1IssueSignatures
  /**
   *
   * @type {V1LiquidityProvisionAmendment}
   * @memberof V1TxErrorEvent
   */
  liquidityProvisionAmendment?: V1LiquidityProvisionAmendment
  /**
   *
   * @type {V1LiquidityProvisionCancellation}
   * @memberof V1TxErrorEvent
   */
  liquidityProvisionCancellation?: V1LiquidityProvisionCancellation
  /**
   *
   * @type {V1LiquidityProvisionSubmission}
   * @memberof V1TxErrorEvent
   */
  liquidityProvisionSubmission?: V1LiquidityProvisionSubmission
  /**
   *
   * @type {V1OracleDataSubmission}
   * @memberof V1TxErrorEvent
   */
  oracleDataSubmission?: V1OracleDataSubmission
  /**
   *
   * @type {V1OrderAmendment}
   * @memberof V1TxErrorEvent
   */
  orderAmendment?: V1OrderAmendment
  /**
   *
   * @type {V1OrderCancellation}
   * @memberof V1TxErrorEvent
   */
  orderCancellation?: V1OrderCancellation
  /**
   *
   * @type {V1OrderSubmission}
   * @memberof V1TxErrorEvent
   */
  orderSubmission?: V1OrderSubmission
  /**
   *
   * @type {string}
   * @memberof V1TxErrorEvent
   */
  partyId?: string
  /**
   *
   * @type {V1ProposalSubmission}
   * @memberof V1TxErrorEvent
   */
  proposal?: V1ProposalSubmission
  /**
   *
   * @type {V1ProtocolUpgradeProposal}
   * @memberof V1TxErrorEvent
   */
  protocolUpgradeProposal?: V1ProtocolUpgradeProposal
  /**
   *
   * @type {Vegacommandsv1Transfer}
   * @memberof V1TxErrorEvent
   */
  transfer?: Vegacommandsv1Transfer
  /**
   *
   * @type {V1UndelegateSubmission}
   * @memberof V1TxErrorEvent
   */
  undelegateSubmission?: V1UndelegateSubmission
  /**
   *
   * @type {V1VoteSubmission}
   * @memberof V1TxErrorEvent
   */
  voteSubmission?: V1VoteSubmission
  /**
   *
   * @type {V1WithdrawSubmission}
   * @memberof V1TxErrorEvent
   */
  withdrawSubmission?: V1WithdrawSubmission
}

/**
 * Current supported version of the transaction inside the network.   - TX_VERSION_UNSPECIFIED: Represents an unspecified or missing value from the input  - TX_VERSION_V2: This version requires the proof-of-work added to the transaction.  - TX_VERSION_V3: This version requires the chain ID to be appended in front of the input data byte, with a `\\0` delimiter.
 * @export
 * @enum {string}
 */
export enum V1TxVersion {
  UNSPECIFIED = 'TX_VERSION_UNSPECIFIED' as any,
  V2 = 'TX_VERSION_V2' as any,
  V3 = 'TX_VERSION_V3' as any
}

/**
 *
 * @export
 * @interface V1UndelegateSubmission
 */
export interface V1UndelegateSubmission {
  /**
   * Optional, if not specified = ALL. If provided, this field must be an unsigned integer passed as a string and needs to be scaled using the asset decimal places for the token.
   * @type {string}
   * @memberof V1UndelegateSubmission
   */
  amount?: string
  /**
   *
   * @type {UndelegateSubmissionMethod}
   * @memberof V1UndelegateSubmission
   */
  method?: UndelegateSubmissionMethod
  /**
   * Node ID to delegate to.
   * @type {string}
   * @memberof V1UndelegateSubmission
   */
  nodeId?: string
}

/**
 *
 * @export
 * @interface V1ValidatorRankingEvent
 */
export interface V1ValidatorRankingEvent {
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  nextStatus?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  nodeId?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  performanceScore?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  previousStatus?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  rankingScore?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorRankingEvent
   */
  stakeScore?: string
  /**
   *
   * @type {number}
   * @memberof V1ValidatorRankingEvent
   */
  tmVotingPower?: number
}

/**
 *
 * @export
 * @interface V1ValidatorScoreEvent
 */
export interface V1ValidatorScoreEvent {
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  multisigScore?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  nodeId?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  normalisedScore?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  rawValidatorScore?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  validatorPerformance?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  validatorScore?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorScoreEvent
   */
  validatorStatus?: string
}

/**
 *
 * @export
 * @interface V1ValidatorUpdate
 */
export interface V1ValidatorUpdate {
  /**
   *
   * @type {boolean}
   * @memberof V1ValidatorUpdate
   */
  added?: boolean
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  avatarUrl?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  country?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  epochSeq?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  ethereumAddress?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  fromEpoch?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  infoUrl?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  name?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  nodeId?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  submitterAddress?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  tmPubKey?: string
  /**
   *
   * @type {string}
   * @memberof V1ValidatorUpdate
   */
  vegaPubKey?: string
  /**
   *
   * @type {number}
   * @memberof V1ValidatorUpdate
   */
  vegaPubKeyIndex?: number
}

/**
 * Vote statistics for the voting spam policies which are calculated as a ratio of the total votes that have been rejected.
 * @export
 * @interface V1VoteSpamStatistic
 */
export interface V1VoteSpamStatistic {
  /**
   *
   * @type {string}
   * @memberof V1VoteSpamStatistic
   */
  countForEpoch?: string
  /**
   *
   * @type {string}
   * @memberof V1VoteSpamStatistic
   */
  minTokensRequired?: string
  /**
   * Unique ID of the proposal being voted on by the party.
   * @type {string}
   * @memberof V1VoteSpamStatistic
   */
  proposal?: string
}

/**
 *
 * @export
 * @interface V1VoteSpamStatistics
 */
export interface V1VoteSpamStatistics {
  /**
   *
   * @type {string}
   * @memberof V1VoteSpamStatistics
   */
  bannedUntil?: string
  /**
   *
   * @type {string}
   * @memberof V1VoteSpamStatistics
   */
  maxForEpoch?: string
  /**
   *
   * @type {Array<V1VoteSpamStatistic>}
   * @memberof V1VoteSpamStatistics
   */
  statistics?: Array<V1VoteSpamStatistic>
}

/**
 * Command to submit a new vote for a governance proposal.
 * @export
 * @interface V1VoteSubmission
 */
export interface V1VoteSubmission {
  /**
   * Submit vote for the specified proposal ID.
   * @type {string}
   * @memberof V1VoteSubmission
   */
  proposalId?: string
  /**
   *
   * @type {VegaVoteValue}
   * @memberof V1VoteSubmission
   */
  value?: VegaVoteValue
}

/**
 *
 * @export
 * @interface V1WithdrawSubmission
 */
export interface V1WithdrawSubmission {
  /**
   * Amount to be withdrawn. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof V1WithdrawSubmission
   */
  amount?: string
  /**
   * Asset to be withdrawn.
   * @type {string}
   * @memberof V1WithdrawSubmission
   */
  asset?: string
  /**
   *
   * @type {VegaWithdrawExt}
   * @memberof V1WithdrawSubmission
   */
  ext?: VegaWithdrawExt
}

/**
 *
 * @export
 * @interface VegaAccount
 */
export interface VegaAccount {
  /**
   * Asset ID for the account.
   * @type {string}
   * @memberof VegaAccount
   */
  asset?: string
  /**
   * Balance of the asset, the balance is an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places and importantly balances cannot be negative.
   * @type {string}
   * @memberof VegaAccount
   */
  balance?: string
  /**
   * Unique account ID, used internally by Vega.
   * @type {string}
   * @memberof VegaAccount
   */
  id?: string
  /**
   * Market ID for the account, if `AccountType.ACCOUNT_TYPE_GENERAL` this will be empty.
   * @type {string}
   * @memberof VegaAccount
   */
  marketId?: string
  /**
   * Party that the account belongs to, special values include `network`, which represents the Vega network and is most commonly seen during liquidation of distressed trading positions.
   * @type {string}
   * @memberof VegaAccount
   */
  owner?: string
  /**
   *
   * @type {VegaAccountType}
   * @memberof VegaAccount
   */
  type?: VegaAccountType
}

/**
 *
 * @export
 * @interface VegaAccountDetails
 */
export interface VegaAccountDetails {
  /**
   * Asset ID of the asset for this account.
   * @type {string}
   * @memberof VegaAccountDetails
   */
  assetId?: string
  /**
   * Not specified if account is not related to a market.
   * @type {string}
   * @memberof VegaAccountDetails
   */
  marketId?: string
  /**
   * Not specified if network account.
   * @type {string}
   * @memberof VegaAccountDetails
   */
  owner?: string
  /**
   *
   * @type {VegaAccountType}
   * @memberof VegaAccountDetails
   */
  type?: VegaAccountType
}

/**
 * - ACCOUNT_TYPE_UNSPECIFIED: Default value  - ACCOUNT_TYPE_INSURANCE: Insurance pool accounts contain insurance pool funds for a market  - ACCOUNT_TYPE_SETTLEMENT: Settlement accounts exist only during settlement or mark-to-market  - ACCOUNT_TYPE_MARGIN: Margin accounts contain funds set aside for the margin needed to support a party's open positions. Each party will have a margin account for each market they have traded in. Required initial margin is allocated to each market from user's general account. Collateral in the margin account can't be withdrawn or used as margin on another market until it is released back to the general account. Vega protocol uses an internal accounting system to segregate funds held as margin from other funds to ensure they are never lost or 'double spent'  Margin account funds will vary as margin requirements on positions change  - ACCOUNT_TYPE_GENERAL: General accounts contain the collateral for a party that is not otherwise allocated. A party will have multiple general accounts, one for each asset they want to trade with  General accounts are where funds are initially deposited or withdrawn from, it is also the account where funds are taken to fulfil fees and initial margin requirements  - ACCOUNT_TYPE_FEES_INFRASTRUCTURE: Infrastructure accounts contain fees earned by providing infrastructure on Vega  - ACCOUNT_TYPE_FEES_LIQUIDITY: Liquidity accounts contain fees earned by providing liquidity on Vega markets  - ACCOUNT_TYPE_FEES_MAKER: This account is created to hold fees earned by placing orders that sit on the book and are then matched with an incoming order to create a trade - These fees reward parties who provide the best priced liquidity that actually allows trading to take place  - ACCOUNT_TYPE_BOND: This account is created to maintain liquidity providers funds commitments  - ACCOUNT_TYPE_EXTERNAL: External account represents an external source (deposit/withdrawal)  - ACCOUNT_TYPE_GLOBAL_INSURANCE: Global insurance account for the asset  - ACCOUNT_TYPE_GLOBAL_REWARD: Global reward account for the asset  - ACCOUNT_TYPE_PENDING_TRANSFERS: Per asset account used to store pending transfers (if any)  - ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES: Per asset reward account for fees paid to makers  - ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES: Per asset reward account for fees received by makers  - ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES: Per asset reward account for fees received by liquidity providers  - ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS: Per asset reward account for market proposers when the market goes above some trading threshold
 * @export
 * @enum {string}
 */
export enum VegaAccountType {
  UNSPECIFIED = 'ACCOUNT_TYPE_UNSPECIFIED' as any,
  INSURANCE = 'ACCOUNT_TYPE_INSURANCE' as any,
  SETTLEMENT = 'ACCOUNT_TYPE_SETTLEMENT' as any,
  MARGIN = 'ACCOUNT_TYPE_MARGIN' as any,
  GENERAL = 'ACCOUNT_TYPE_GENERAL' as any,
  FEESINFRASTRUCTURE = 'ACCOUNT_TYPE_FEES_INFRASTRUCTURE' as any,
  FEESLIQUIDITY = 'ACCOUNT_TYPE_FEES_LIQUIDITY' as any,
  FEESMAKER = 'ACCOUNT_TYPE_FEES_MAKER' as any,
  BOND = 'ACCOUNT_TYPE_BOND' as any,
  EXTERNAL = 'ACCOUNT_TYPE_EXTERNAL' as any,
  GLOBALINSURANCE = 'ACCOUNT_TYPE_GLOBAL_INSURANCE' as any,
  GLOBALREWARD = 'ACCOUNT_TYPE_GLOBAL_REWARD' as any,
  PENDINGTRANSFERS = 'ACCOUNT_TYPE_PENDING_TRANSFERS' as any,
  REWARDMAKERPAIDFEES = 'ACCOUNT_TYPE_REWARD_MAKER_PAID_FEES' as any,
  REWARDMAKERRECEIVEDFEES = 'ACCOUNT_TYPE_REWARD_MAKER_RECEIVED_FEES' as any,
  REWARDLPRECEIVEDFEES = 'ACCOUNT_TYPE_REWARD_LP_RECEIVED_FEES' as any,
  REWARDMARKETPROPOSERS = 'ACCOUNT_TYPE_REWARD_MARKET_PROPOSERS' as any
}

/**
 *
 * @export
 * @interface VegaAsset
 */
export interface VegaAsset {
  /**
   *
   * @type {VegaAssetDetails}
   * @memberof VegaAsset
   */
  details?: VegaAssetDetails
  /**
   * Internal identifier of the asset.
   * @type {string}
   * @memberof VegaAsset
   */
  id?: string
  /**
   *
   * @type {VegaAssetStatus}
   * @memberof VegaAsset
   */
  status?: VegaAssetStatus
}

/**
 *
 * @export
 * @interface VegaAssetDetails
 */
export interface VegaAssetDetails {
  /**
   *
   * @type {VegaBuiltinAsset}
   * @memberof VegaAssetDetails
   */
  builtinAsset?: VegaBuiltinAsset
  /**
   * Number of decimal / precision handled by this asset.
   * @type {string}
   * @memberof VegaAssetDetails
   */
  decimals?: string
  /**
   *
   * @type {VegaERC20}
   * @memberof VegaAssetDetails
   */
  erc20?: VegaERC20
  /**
   * Name of the asset (e.g: Great British Pound).
   * @type {string}
   * @memberof VegaAssetDetails
   */
  name?: string
  /**
   * Minimum economically meaningful amount in the asset.
   * @type {string}
   * @memberof VegaAssetDetails
   */
  quantum?: string
  /**
   * Symbol of the asset (e.g: GBP).
   * @type {string}
   * @memberof VegaAssetDetails
   */
  symbol?: string
}

/**
 * Changes to apply on an existing asset.
 * @export
 * @interface VegaAssetDetailsUpdate
 */
export interface VegaAssetDetailsUpdate {
  /**
   *
   * @type {VegaERC20Update}
   * @memberof VegaAssetDetailsUpdate
   */
  erc20?: VegaERC20Update
  /**
   * Minimum economically meaningful amount in the asset.
   * @type {string}
   * @memberof VegaAssetDetailsUpdate
   */
  quantum?: string
}

/**
 *
 * @export
 * @enum {string}
 */
export enum VegaAssetStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  PROPOSED = 'STATUS_PROPOSED' as any,
  REJECTED = 'STATUS_REJECTED' as any,
  PENDINGLISTING = 'STATUS_PENDING_LISTING' as any,
  ENABLED = 'STATUS_ENABLED' as any
}

/**
 *
 * @export
 * @interface VegaAuctionDuration
 */
export interface VegaAuctionDuration {
  /**
   * Duration of the auction in seconds.
   * @type {string}
   * @memberof VegaAuctionDuration
   */
  duration?: string
  /**
   * Target uncrossing trading volume.
   * @type {string}
   * @memberof VegaAuctionDuration
   */
  volume?: string
}

/**
 * - AUCTION_TRIGGER_UNSPECIFIED: Default value for AuctionTrigger, no auction triggered  - AUCTION_TRIGGER_BATCH: Batch auction  - AUCTION_TRIGGER_OPENING: Opening auction  - AUCTION_TRIGGER_PRICE: Price monitoring trigger  - AUCTION_TRIGGER_LIQUIDITY: Deprecated  - AUCTION_TRIGGER_LIQUIDITY_TARGET_NOT_MET: Liquidity auction due to not enough committed liquidity  - AUCTION_TRIGGER_UNABLE_TO_DEPLOY_LP_ORDERS: Liquidity auction due to not being able to deploy LP orders because there's nothing to peg on one or both sides of the book
 * @export
 * @enum {string}
 */
export enum VegaAuctionTrigger {
  UNSPECIFIED = 'AUCTION_TRIGGER_UNSPECIFIED' as any,
  BATCH = 'AUCTION_TRIGGER_BATCH' as any,
  OPENING = 'AUCTION_TRIGGER_OPENING' as any,
  PRICE = 'AUCTION_TRIGGER_PRICE' as any,
  LIQUIDITY = 'AUCTION_TRIGGER_LIQUIDITY' as any,
  LIQUIDITYTARGETNOTMET = 'AUCTION_TRIGGER_LIQUIDITY_TARGET_NOT_MET' as any,
  UNABLETODEPLOYLPORDERS = 'AUCTION_TRIGGER_UNABLE_TO_DEPLOY_LP_ORDERS' as any
}

/**
 *
 * @export
 * @interface VegaBuiltinAsset
 */
export interface VegaBuiltinAsset {
  /**
   * Maximum amount that can be requested by a party through the built-in asset faucet at a time.
   * @type {string}
   * @memberof VegaBuiltinAsset
   */
  maxFaucetAmountMint?: string
}

/**
 * - CHAIN_STATUS_UNSPECIFIED: Default value, always invalid  - CHAIN_STATUS_DISCONNECTED: Blockchain is disconnected  - CHAIN_STATUS_REPLAYING: Blockchain is replaying historic transactions  - CHAIN_STATUS_CONNECTED: Blockchain is connected and receiving transactions
 * @export
 * @enum {string}
 */
export enum VegaChainStatus {
  UNSPECIFIED = 'CHAIN_STATUS_UNSPECIFIED' as any,
  DISCONNECTED = 'CHAIN_STATUS_DISCONNECTED' as any,
  REPLAYING = 'CHAIN_STATUS_REPLAYING' as any,
  CONNECTED = 'CHAIN_STATUS_CONNECTED' as any
}

/**
 * DataSourceDefinition represents the top level object that deals with data sources. DataSourceDefinition can be external or internal, with whatever number of data sources are defined for each type in the child objects below.
 * @export
 * @interface VegaDataSourceDefinition
 */
export interface VegaDataSourceDefinition {
  /**
   *
   * @type {VegaDataSourceDefinitionExternal}
   * @memberof VegaDataSourceDefinition
   */
  external?: VegaDataSourceDefinitionExternal
  /**
   *
   * @type {VegaDataSourceDefinitionInternal}
   * @memberof VegaDataSourceDefinition
   */
  internal?: VegaDataSourceDefinitionInternal
}

/**
 * DataSourceDefinitionExternal is the top level object used for all external data sources. It contains one of any of the defined `SourceType` variants.
 * @export
 * @interface VegaDataSourceDefinitionExternal
 */
export interface VegaDataSourceDefinitionExternal {
  /**
   *
   * @type {VegaDataSourceSpecConfiguration}
   * @memberof VegaDataSourceDefinitionExternal
   */
  oracle?: VegaDataSourceSpecConfiguration
}

/**
 * DataSourceDefinitionInternal is the top level object used for all internal data sources. It contains one of any of the defined `SourceType` variants.
 * @export
 * @interface VegaDataSourceDefinitionInternal
 */
export interface VegaDataSourceDefinitionInternal {
  /**
   *
   * @type {VegaDataSourceSpecConfigurationTime}
   * @memberof VegaDataSourceDefinitionInternal
   */
  time?: VegaDataSourceSpecConfigurationTime
}

/**
 * Data source spec describes the data source base that a product or a risk model wants to get from the data source engine. This message contains additional information used by the API.
 * @export
 * @interface VegaDataSourceSpec
 */
export interface VegaDataSourceSpec {
  /**
   *
   * @type {string}
   * @memberof VegaDataSourceSpec
   */
  createdAt?: string
  /**
   *
   * @type {VegaDataSourceDefinition}
   * @memberof VegaDataSourceSpec
   */
  data?: VegaDataSourceDefinition
  /**
   * Hash generated from the DataSpec data.
   * @type {string}
   * @memberof VegaDataSourceSpec
   */
  id?: string
  /**
   *
   * @type {VegaDataSourceSpecStatus}
   * @memberof VegaDataSourceSpec
   */
  status?: VegaDataSourceSpecStatus
  /**
   *
   * @type {string}
   * @memberof VegaDataSourceSpec
   */
  updatedAt?: string
}

/**
 * All types of external data sources use the same configuration set for meeting requirements in order for the data to be useful for Vega - valid signatures and matching filters.
 * @export
 * @interface VegaDataSourceSpecConfiguration
 */
export interface VegaDataSourceSpecConfiguration {
  /**
   * Filters describes which source data are considered of interest or not for the product (or the risk model).
   * @type {Array<V1Filter>}
   * @memberof VegaDataSourceSpecConfiguration
   */
  filters?: Array<V1Filter>
  /**
   * Signers is the list of authorized signatures that signed the data for this source. All the signatures in the data source data should be contained in this external source. All the signatures in the data should be contained in this list.
   * @type {Array<V1Signer>}
   * @memberof VegaDataSourceSpecConfiguration
   */
  signers?: Array<V1Signer>
}

/**
 * DataSourceSpecConfigurationTime is the internal data source used for emitting timestamps.
 * @export
 * @interface VegaDataSourceSpecConfigurationTime
 */
export interface VegaDataSourceSpecConfigurationTime {
  /**
   * Conditions that the timestamps should meet in order to be considered.
   * @type {Array<V1Condition>}
   * @memberof VegaDataSourceSpecConfigurationTime
   */
  conditions?: Array<V1Condition>
}

/**
 * - STATUS_UNSPECIFIED: Default value.  - STATUS_ACTIVE: STATUS_ACTIVE describes an active data source spec.  - STATUS_DEACTIVATED: STATUS_DEACTIVATED describes an data source spec that is not listening to data anymore.
 * @export
 * @enum {string}
 */
export enum VegaDataSourceSpecStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  ACTIVE = 'STATUS_ACTIVE' as any,
  DEACTIVATED = 'STATUS_DEACTIVATED' as any
}

/**
 *
 * @export
 * @interface VegaDataSourceSpecToFutureBinding
 */
export interface VegaDataSourceSpecToFutureBinding {
  /**
   * Name of the property in the source data that should be used as settlement data. If it is set to \"prices.BTC.value\", then the Future will use the value of this property as settlement data.
   * @type {string}
   * @memberof VegaDataSourceSpecToFutureBinding
   */
  settlementDataProperty?: string
  /**
   * Name of the property in the data source data that signals termination of trading.
   * @type {string}
   * @memberof VegaDataSourceSpecToFutureBinding
   */
  tradingTerminationProperty?: string
}

/**
 *
 * @export
 * @interface VegaDeposit
 */
export interface VegaDeposit {
  /**
   * Amount to be deposited. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaDeposit
   */
  amount?: string
  /**
   * Vega asset targeted by this deposit.
   * @type {string}
   * @memberof VegaDeposit
   */
  asset?: string
  /**
   * Timestamp for when the deposit was created on the Vega network.
   * @type {string}
   * @memberof VegaDeposit
   */
  createdTimestamp?: string
  /**
   * Timestamp for when the Vega account was updated with the deposit.
   * @type {string}
   * @memberof VegaDeposit
   */
  creditedTimestamp?: string
  /**
   * Unique ID for the deposit.
   * @type {string}
   * @memberof VegaDeposit
   */
  id?: string
  /**
   * Party ID of the user initiating the deposit.
   * @type {string}
   * @memberof VegaDeposit
   */
  partyId?: string
  /**
   *
   * @type {VegaDepositStatus}
   * @memberof VegaDeposit
   */
  status?: VegaDepositStatus
  /**
   * Hash of the transaction from the foreign chain.
   * @type {string}
   * @memberof VegaDeposit
   */
  txHash?: string
}

/**
 * - STATUS_UNSPECIFIED: Default value, always invalid  - STATUS_OPEN: Deposit is being processed by the network  - STATUS_CANCELLED: Deposit has been cancelled by the network  - STATUS_FINALIZED: Deposit has been finalised and accounts have been updated
 * @export
 * @enum {string}
 */
export enum VegaDepositStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  OPEN = 'STATUS_OPEN' as any,
  CANCELLED = 'STATUS_CANCELLED' as any,
  FINALIZED = 'STATUS_FINALIZED' as any
}

/**
 *
 * @export
 * @enum {string}
 */
export enum VegaDispatchMetric {
  UNSPECIFIED = 'DISPATCH_METRIC_UNSPECIFIED' as any,
  MAKERFEESPAID = 'DISPATCH_METRIC_MAKER_FEES_PAID' as any,
  MAKERFEESRECEIVED = 'DISPATCH_METRIC_MAKER_FEES_RECEIVED' as any,
  LPFEESRECEIVED = 'DISPATCH_METRIC_LP_FEES_RECEIVED' as any,
  MARKETVALUE = 'DISPATCH_METRIC_MARKET_VALUE' as any
}

/**
 *
 * @export
 * @interface VegaDispatchStrategy
 */
export interface VegaDispatchStrategy {
  /**
   * Asset to use for metric.
   * @type {string}
   * @memberof VegaDispatchStrategy
   */
  assetForMetric?: string
  /**
   * Optional markets in scope.
   * @type {Array<string>}
   * @memberof VegaDispatchStrategy
   */
  markets?: Array<string>
  /**
   *
   * @type {VegaDispatchMetric}
   * @memberof VegaDispatchStrategy
   */
  metric?: VegaDispatchMetric
}

/**
 *
 * @export
 * @interface VegaERC20
 */
export interface VegaERC20 {
  /**
   * Address of the contract for the token, on the ethereum network.
   * @type {string}
   * @memberof VegaERC20
   */
  contractAddress?: string
  /**
   * Lifetime limits deposit per address note: this is a temporary measure that can be changed by governance.
   * @type {string}
   * @memberof VegaERC20
   */
  lifetimeLimit?: string
  /**
   * Maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay. There’s no limit on the size of a withdrawal note: this is a temporary measure that can be changed by governance.
   * @type {string}
   * @memberof VegaERC20
   */
  withdrawThreshold?: string
}

/**
 *
 * @export
 * @interface VegaERC20Update
 */
export interface VegaERC20Update {
  /**
   * Lifetime limits deposit per address. This will be interpreted against the asset decimals. note: this is a temporary measure that can be changed by governance.
   * @type {string}
   * @memberof VegaERC20Update
   */
  lifetimeLimit?: string
  /**
   * Maximum you can withdraw instantly. All withdrawals over the threshold will be delayed by the withdrawal delay. There’s no limit on the size of a withdrawal note: this is a temporary measure that can be changed by governance.
   * @type {string}
   * @memberof VegaERC20Update
   */
  withdrawThreshold?: string
}

/**
 * - EPOCH_ACTION_START: Epoch update is for a new epoch.  - EPOCH_ACTION_END: Epoch update is for the end of an epoch.
 * @export
 * @enum {string}
 */
export enum VegaEpochAction {
  UNSPECIFIED = 'EPOCH_ACTION_UNSPECIFIED' as any,
  START = 'EPOCH_ACTION_START' as any,
  END = 'EPOCH_ACTION_END' as any
}

/**
 *
 * @export
 * @interface VegaErc20WithdrawExt
 */
export interface VegaErc20WithdrawExt {
  /**
   * Address into which the bridge will release the funds.
   * @type {string}
   * @memberof VegaErc20WithdrawExt
   */
  receiverAddress?: string
}

/**
 *
 * @export
 * @interface VegaExternalDataSourceSpec
 */
export interface VegaExternalDataSourceSpec {
  /**
   *
   * @type {VegaDataSourceSpec}
   * @memberof VegaExternalDataSourceSpec
   */
  spec?: VegaDataSourceSpec
}

/**
 *
 * @export
 * @interface VegaFee
 */
export interface VegaFee {
  /**
   * Fee amount paid for maintaining the Vega infrastructure. This field is an unsigned integer scaled using the asset's decimal places.
   * @type {string}
   * @memberof VegaFee
   */
  infrastructureFee?: string
  /**
   * Fee amount paid to market makers. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaFee
   */
  liquidityFee?: string
  /**
   * Fee amount paid to the non-aggressive party of the trade. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaFee
   */
  makerFee?: string
}

/**
 *
 * @export
 * @interface VegaFeeFactors
 */
export interface VegaFeeFactors {
  /**
   * Infrastructure fee charged network wide for staking and governance.
   * @type {string}
   * @memberof VegaFeeFactors
   */
  infrastructureFee?: string
  /**
   * Liquidity fee applied per market for market making.
   * @type {string}
   * @memberof VegaFeeFactors
   */
  liquidityFee?: string
  /**
   * Market maker fee charged network wide.
   * @type {string}
   * @memberof VegaFeeFactors
   */
  makerFee?: string
}

/**
 *
 * @export
 * @interface VegaFees
 */
export interface VegaFees {
  /**
   *
   * @type {VegaFeeFactors}
   * @memberof VegaFees
   */
  factors?: VegaFeeFactors
}

/**
 *
 * @export
 * @interface VegaFuture
 */
export interface VegaFuture {
  /**
   *
   * @type {VegaDataSourceSpecToFutureBinding}
   * @memberof VegaFuture
   */
  dataSourceSpecBinding?: VegaDataSourceSpecToFutureBinding
  /**
   *
   * @type {VegaDataSourceSpec}
   * @memberof VegaFuture
   */
  dataSourceSpecForSettlementData?: VegaDataSourceSpec
  /**
   *
   * @type {VegaDataSourceSpec}
   * @memberof VegaFuture
   */
  dataSourceSpecForTradingTermination?: VegaDataSourceSpec
  /**
   * Quote name of the instrument.
   * @type {string}
   * @memberof VegaFuture
   */
  quoteName?: string
  /**
   * Underlying asset for the future.
   * @type {string}
   * @memberof VegaFuture
   */
  settlementAsset?: string
}

/**
 *
 * @export
 * @interface VegaFutureProduct
 */
export interface VegaFutureProduct {
  /**
   *
   * @type {VegaDataSourceSpecToFutureBinding}
   * @memberof VegaFutureProduct
   */
  dataSourceSpecBinding?: VegaDataSourceSpecToFutureBinding
  /**
   *
   * @type {VegaDataSourceDefinition}
   * @memberof VegaFutureProduct
   */
  dataSourceSpecForSettlementData?: VegaDataSourceDefinition
  /**
   *
   * @type {VegaDataSourceDefinition}
   * @memberof VegaFutureProduct
   */
  dataSourceSpecForTradingTermination?: VegaDataSourceDefinition
  /**
   * Product quote name.
   * @type {string}
   * @memberof VegaFutureProduct
   */
  quoteName?: string
  /**
   * Asset ID for the product's settlement asset.
   * @type {string}
   * @memberof VegaFutureProduct
   */
  settlementAsset?: string
}

/**
 *
 * @export
 * @interface VegaInstrument
 */
export interface VegaInstrument {
  /**
   * Code for the instrument.
   * @type {string}
   * @memberof VegaInstrument
   */
  code?: string
  /**
   *
   * @type {VegaFuture}
   * @memberof VegaInstrument
   */
  future?: VegaFuture
  /**
   * Unique instrument ID.
   * @type {string}
   * @memberof VegaInstrument
   */
  id?: string
  /**
   *
   * @type {VegaInstrumentMetadata}
   * @memberof VegaInstrument
   */
  metadata?: VegaInstrumentMetadata
  /**
   * Name of the instrument.
   * @type {string}
   * @memberof VegaInstrument
   */
  name?: string
}

/**
 *
 * @export
 * @interface VegaInstrumentConfiguration
 */
export interface VegaInstrumentConfiguration {
  /**
   * Instrument code, human-readable shortcode used to describe the instrument.
   * @type {string}
   * @memberof VegaInstrumentConfiguration
   */
  code?: string
  /**
   *
   * @type {VegaFutureProduct}
   * @memberof VegaInstrumentConfiguration
   */
  future?: VegaFutureProduct
  /**
   * Instrument name.
   * @type {string}
   * @memberof VegaInstrumentConfiguration
   */
  name?: string
}

/**
 *
 * @export
 * @interface VegaInstrumentMetadata
 */
export interface VegaInstrumentMetadata {
  /**
   * List of 0 or more tags.
   * @type {Array<string>}
   * @memberof VegaInstrumentMetadata
   */
  tags?: Array<string>
}

/**
 *
 * @export
 * @interface VegaLedgerEntry
 */
export interface VegaLedgerEntry {
  /**
   * Amount to transfer. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaLedgerEntry
   */
  amount?: string
  /**
   *
   * @type {VegaAccountDetails}
   * @memberof VegaLedgerEntry
   */
  fromAccount?: VegaAccountDetails
  /**
   * Sender account balance after the transfer. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaLedgerEntry
   */
  fromAccountBalance?: string
  /**
   * Unixnano timestamp at which the ledger entry was created.
   * @type {string}
   * @memberof VegaLedgerEntry
   */
  timestamp?: string
  /**
   *
   * @type {VegaAccountDetails}
   * @memberof VegaLedgerEntry
   */
  toAccount?: VegaAccountDetails
  /**
   * Receiver account balance after the transfer. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaLedgerEntry
   */
  toAccountBalance?: string
  /**
   *
   * @type {VegaTransferType}
   * @memberof VegaLedgerEntry
   */
  type?: VegaTransferType
}

/**
 *
 * @export
 * @interface VegaLedgerMovement
 */
export interface VegaLedgerMovement {
  /**
   * Resulting balances once the ledger movement are applied.
   * @type {Array<VegaPostTransferBalance>}
   * @memberof VegaLedgerMovement
   */
  balances?: Array<VegaPostTransferBalance>
  /**
   * All the entries for these ledger movements.
   * @type {Array<VegaLedgerEntry>}
   * @memberof VegaLedgerMovement
   */
  entries?: Array<VegaLedgerEntry>
}

/**
 *
 * @export
 * @interface VegaLiquidityMonitoringParameters
 */
export interface VegaLiquidityMonitoringParameters {
  /**
   * Specifies by how many seconds an auction should be extended if leaving the auction were to trigger a liquidity auction.
   * @type {string}
   * @memberof VegaLiquidityMonitoringParameters
   */
  auctionExtension?: string
  /**
   *
   * @type {VegaTargetStakeParameters}
   * @memberof VegaLiquidityMonitoringParameters
   */
  targetStakeParameters?: VegaTargetStakeParameters
  /**
   * Specifies the triggering ratio for entering liquidity auction.
   * @type {string}
   * @memberof VegaLiquidityMonitoringParameters
   */
  triggeringRatio?: string
}

/**
 *
 * @export
 * @interface VegaLiquidityOrder
 */
export interface VegaLiquidityOrder {
  /**
   * Offset/amount of units away for the order. This field is an unsigned integer scaled using the market's decimal places.
   * @type {string}
   * @memberof VegaLiquidityOrder
   */
  offset?: string
  /**
   * Relative proportion of the commitment to be allocated at a price level.
   * @type {number}
   * @memberof VegaLiquidityOrder
   */
  proportion?: number
  /**
   *
   * @type {VegaPeggedReference}
   * @memberof VegaLiquidityOrder
   */
  reference?: VegaPeggedReference
}

/**
 *
 * @export
 * @interface VegaLiquidityOrderReference
 */
export interface VegaLiquidityOrderReference {
  /**
   *
   * @type {VegaLiquidityOrder}
   * @memberof VegaLiquidityOrderReference
   */
  liquidityOrder?: VegaLiquidityOrder
  /**
   * Unique ID of the pegged order generated by the core to fulfil this liquidity order.
   * @type {string}
   * @memberof VegaLiquidityOrderReference
   */
  orderId?: string
}

/**
 *
 * @export
 * @interface VegaLiquidityProviderFeeShare
 */
export interface VegaLiquidityProviderFeeShare {
  /**
   * Average entry valuation of the liquidity provider for the market.
   * @type {string}
   * @memberof VegaLiquidityProviderFeeShare
   */
  averageEntryValuation?: string
  /**
   * Average liquidity score.
   * @type {string}
   * @memberof VegaLiquidityProviderFeeShare
   */
  averageScore?: string
  /**
   * Share own by this liquidity provider (float).
   * @type {string}
   * @memberof VegaLiquidityProviderFeeShare
   */
  equityLikeShare?: string
  /**
   * Liquidity provider party ID.
   * @type {string}
   * @memberof VegaLiquidityProviderFeeShare
   */
  party?: string
}

/**
 *
 * @export
 * @interface VegaLiquidityProvision
 */
export interface VegaLiquidityProvision {
  /**
   * Set of liquidity buy orders to meet the liquidity provision obligation.
   * @type {Array<VegaLiquidityOrderReference>}
   * @memberof VegaLiquidityProvision
   */
  buys?: Array<VegaLiquidityOrderReference>
  /**
   * Specified as a unitless number that represents the amount of settlement asset of the market. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  commitmentAmount?: string
  /**
   * Timestamp for when the order was created at, in nanoseconds.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  createdAt?: string
  /**
   * Nominated liquidity fee factor, which is an input to the calculation of taker fees on the market, as per setting fees and rewarding liquidity providers.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  fee?: string
  /**
   * Unique ID for the liquidity provision.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  id?: string
  /**
   * Market ID for the order, required field.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  marketId?: string
  /**
   * Unique party ID for the creator of the provision.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  partyId?: string
  /**
   * Reference shared between this liquidity provision and all its orders.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  reference?: string
  /**
   * Set of liquidity sell orders to meet the liquidity provision obligation.
   * @type {Array<VegaLiquidityOrderReference>}
   * @memberof VegaLiquidityProvision
   */
  sells?: Array<VegaLiquidityOrderReference>
  /**
   *
   * @type {VegaLiquidityProvisionStatus}
   * @memberof VegaLiquidityProvision
   */
  status?: VegaLiquidityProvisionStatus
  /**
   * Timestamp for when the order was updated at, in nanoseconds.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  updatedAt?: string
  /**
   * Version of this liquidity provision order.
   * @type {string}
   * @memberof VegaLiquidityProvision
   */
  version?: string
}

/**
 * Status of a liquidity provision order.   - STATUS_UNSPECIFIED: Default value  - STATUS_ACTIVE: Liquidity provision is active  - STATUS_STOPPED: Liquidity provision was stopped by the network  - STATUS_CANCELLED: Liquidity provision was cancelled by the liquidity provider  - STATUS_REJECTED: Liquidity provision was invalid and got rejected  - STATUS_UNDEPLOYED: Liquidity provision is valid and accepted by network, but orders aren't deployed  - STATUS_PENDING: Liquidity provision is valid and accepted by network but has never been deployed. If when it's possible to deploy the orders for the first time margin check fails, then they will be cancelled without any penalties.
 * @export
 * @enum {string}
 */
export enum VegaLiquidityProvisionStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  ACTIVE = 'STATUS_ACTIVE' as any,
  STOPPED = 'STATUS_STOPPED' as any,
  CANCELLED = 'STATUS_CANCELLED' as any,
  REJECTED = 'STATUS_REJECTED' as any,
  UNDEPLOYED = 'STATUS_UNDEPLOYED' as any,
  PENDING = 'STATUS_PENDING' as any
}

/**
 *
 * @export
 * @interface VegaLogNormalModelParams
 */
export interface VegaLogNormalModelParams {
  /**
   * Mu parameter, annualised growth rate of the underlying asset.
   * @type {number}
   * @memberof VegaLogNormalModelParams
   */
  mu?: number
  /**
   * R parameter, annualised growth rate of the risk-free asset, used for discounting of future cash flows, can be any real number.
   * @type {number}
   * @memberof VegaLogNormalModelParams
   */
  r?: number
  /**
   * Sigma parameter, annualised volatility of the underlying asset, must be a strictly non-negative real number.
   * @type {number}
   * @memberof VegaLogNormalModelParams
   */
  sigma?: number
}

/**
 *
 * @export
 * @interface VegaLogNormalRiskModel
 */
export interface VegaLogNormalRiskModel {
  /**
   *
   * @type {VegaLogNormalModelParams}
   * @memberof VegaLogNormalRiskModel
   */
  params?: VegaLogNormalModelParams
  /**
   * Risk Aversion Parameter.
   * @type {number}
   * @memberof VegaLogNormalRiskModel
   */
  riskAversionParameter?: number
  /**
   * Tau parameter of the risk model, projection horizon measured as a year fraction used in the expected shortfall calculation to obtain the maintenance margin, must be a strictly non-negative real number.
   * @type {number}
   * @memberof VegaLogNormalRiskModel
   */
  tau?: number
}

/**
 *
 * @export
 * @interface VegaMarginCalculator
 */
export interface VegaMarginCalculator {
  /**
   *
   * @type {VegaScalingFactors}
   * @memberof VegaMarginCalculator
   */
  scalingFactors?: VegaScalingFactors
}

/**
 *
 * @export
 * @interface VegaMarginLevels
 */
export interface VegaMarginLevels {
  /**
   * Asset ID for which the margin levels apply.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  asset?: string
  /**
   * Collateral release level value. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  collateralReleaseLevel?: string
  /**
   * Initial margin value. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  initialMargin?: string
  /**
   * Maintenance margin value. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  maintenanceMargin?: string
  /**
   * Market ID for which the margin levels apply.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  marketId?: string
  /**
   * Party ID for whom the margin levels apply.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  partyId?: string
  /**
   * Margin search level value. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  searchLevel?: string
  /**
   * Timestamp for the time the ledger entry was created, in nanoseconds.
   * @type {string}
   * @memberof VegaMarginLevels
   */
  timestamp?: string
}

/**
 *
 * @export
 * @interface VegaMarket
 */
export interface VegaMarket {
  /**
   * Number of decimal places that a price must be shifted by in order to get a correct price denominated in the currency of the market, for example: `realPrice = price / 10^decimalPlaces`.
   * @type {string}
   * @memberof VegaMarket
   */
  decimalPlaces?: string
  /**
   *
   * @type {VegaFees}
   * @memberof VegaMarket
   */
  fees?: VegaFees
  /**
   * Unique ID for the market.
   * @type {string}
   * @memberof VegaMarket
   */
  id?: string
  /**
   * Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
   * @type {string}
   * @memberof VegaMarket
   */
  linearSlippageFactor?: string
  /**
   *
   * @type {VegaLiquidityMonitoringParameters}
   * @memberof VegaMarket
   */
  liquidityMonitoringParameters?: VegaLiquidityMonitoringParameters
  /**
   * Percentage move up and down from the mid price which specifies the range of price levels over which automated liquidity provision orders will be deployed.
   * @type {string}
   * @memberof VegaMarket
   */
  lpPriceRange?: string
  /**
   *
   * @type {VegaMarketTimestamps}
   * @memberof VegaMarket
   */
  marketTimestamps?: VegaMarketTimestamps
  /**
   *
   * @type {VegaAuctionDuration}
   * @memberof VegaMarket
   */
  openingAuction?: VegaAuctionDuration
  /**
   * The number of decimal places for a position.
   * @type {string}
   * @memberof VegaMarket
   */
  positionDecimalPlaces?: string
  /**
   *
   * @type {VegaPriceMonitoringSettings}
   * @memberof VegaMarket
   */
  priceMonitoringSettings?: VegaPriceMonitoringSettings
  /**
   * Quadratic slippage factor is used to cap the slippage component of maintenance margin - it is applied to the square of the slippage volume.
   * @type {string}
   * @memberof VegaMarket
   */
  quadraticSlippageFactor?: string
  /**
   *
   * @type {VegaMarketState}
   * @memberof VegaMarket
   */
  state?: VegaMarketState
  /**
   *
   * @type {VegaTradableInstrument}
   * @memberof VegaMarket
   */
  tradableInstrument?: VegaTradableInstrument
  /**
   *
   * @type {MarketTradingMode}
   * @memberof VegaMarket
   */
  tradingMode?: MarketTradingMode
}

/**
 *
 * @export
 * @interface VegaMarketData
 */
export interface VegaMarketData {
  /**
   * Time in seconds until the end of the auction (zero if currently not in auction period).
   * @type {string}
   * @memberof VegaMarketData
   */
  auctionEnd?: string
  /**
   * Time until next auction, or start time of the current auction if market is in auction period.
   * @type {string}
   * @memberof VegaMarketData
   */
  auctionStart?: string
  /**
   * Highest price level on an order book for buy orders, as an unsigned integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestBidPrice?: string
  /**
   * Aggregated volume being bid at the best bid price, as an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market is configured to 5 decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestBidVolume?: string
  /**
   * Lowest price level on an order book for offer orders. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestOfferPrice?: string
  /**
   * Aggregated volume being offered at the best offer price, as an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market is configured to 5 decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestOfferVolume?: string
  /**
   * Highest price on the order book for buy orders not including pegged orders. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestStaticBidPrice?: string
  /**
   * Total volume at the best static bid price excluding pegged orders.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestStaticBidVolume?: string
  /**
   * Lowest price on the order book for sell orders not including pegged orders. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestStaticOfferPrice?: string
  /**
   * Total volume at the best static offer price, excluding pegged orders.
   * @type {string}
   * @memberof VegaMarketData
   */
  bestStaticOfferVolume?: string
  /**
   *
   * @type {VegaAuctionTrigger}
   * @memberof VegaMarketData
   */
  extensionTrigger?: VegaAuctionTrigger
  /**
   * Indicative price (zero if not in auction). This field is an unsigned scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  indicativePrice?: string
  /**
   * Indicative volume (zero if not in auction).
   * @type {string}
   * @memberof VegaMarketData
   */
  indicativeVolume?: string
  /**
   * Last traded price of the market. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  lastTradedPrice?: string
  /**
   * Equity like share of liquidity fee for each liquidity provider.
   * @type {Array<VegaLiquidityProviderFeeShare>}
   * @memberof VegaMarketData
   */
  liquidityProviderFeeShare?: Array<VegaLiquidityProviderFeeShare>
  /**
   * Mark price, as an unsigned integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  markPrice?: string
  /**
   *
   * @type {string}
   * @memberof VegaMarketData
   */
  market?: string
  /**
   *
   * @type {VegaMarketState}
   * @memberof VegaMarketData
   */
  marketState?: VegaMarketState
  /**
   *
   * @type {MarketTradingMode}
   * @memberof VegaMarketData
   */
  marketTradingMode?: MarketTradingMode
  /**
   * Market value proxy.
   * @type {string}
   * @memberof VegaMarketData
   */
  marketValueProxy?: string
  /**
   * Arithmetic average of the best bid price and best offer price, as an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  midPrice?: string
  /**
   * Next MTM timestamp.
   * @type {string}
   * @memberof VegaMarketData
   */
  nextMarkToMarket?: string
  /**
   * Sum of the size of all positions greater than zero on the market.
   * @type {string}
   * @memberof VegaMarketData
   */
  openInterest?: string
  /**
   * One or more price monitoring bounds for the current timestamp.
   * @type {Array<VegaPriceMonitoringBounds>}
   * @memberof VegaMarketData
   */
  priceMonitoringBounds?: Array<VegaPriceMonitoringBounds>
  /**
   * Arithmetic average of the best static bid price and best static offer price. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  staticMidPrice?: string
  /**
   * Available stake for the given market. This field is an unsigned integer scaled to the settlement asset's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  suppliedStake?: string
  /**
   * Targeted stake for the given market. This field is an unsigned integer scaled to the settlement asset's decimal places.
   * @type {string}
   * @memberof VegaMarketData
   */
  targetStake?: string
  /**
   * Timestamp at which this mark price was relevant, in nanoseconds.
   * @type {string}
   * @memberof VegaMarketData
   */
  timestamp?: string
  /**
   *
   * @type {VegaAuctionTrigger}
   * @memberof VegaMarketData
   */
  trigger?: VegaAuctionTrigger
}

/**
 * - STATE_UNSPECIFIED: Default value, invalid  - STATE_PROPOSED: Governance proposal valid and accepted  - STATE_REJECTED: Outcome of governance votes is to reject the market  - STATE_PENDING: Governance vote passes/wins  - STATE_CANCELLED: Market triggers cancellation condition or governance votes to close before market becomes Active  - STATE_ACTIVE: Enactment date reached and usual auction exit checks pass  - STATE_SUSPENDED: Price monitoring or liquidity monitoring trigger  - STATE_CLOSED: Governance vote to close (Not currently implemented)  - STATE_TRADING_TERMINATED: Defined by the product (i.e. from a product parameter, specified in market definition, giving close date/time)  - STATE_SETTLED: Settlement triggered and completed as defined by product
 * @export
 * @enum {string}
 */
export enum VegaMarketState {
  UNSPECIFIED = 'STATE_UNSPECIFIED' as any,
  PROPOSED = 'STATE_PROPOSED' as any,
  REJECTED = 'STATE_REJECTED' as any,
  PENDING = 'STATE_PENDING' as any,
  CANCELLED = 'STATE_CANCELLED' as any,
  ACTIVE = 'STATE_ACTIVE' as any,
  SUSPENDED = 'STATE_SUSPENDED' as any,
  CLOSED = 'STATE_CLOSED' as any,
  TRADINGTERMINATED = 'STATE_TRADING_TERMINATED' as any,
  SETTLED = 'STATE_SETTLED' as any
}

/**
 *
 * @export
 * @interface VegaMarketTimestamps
 */
export interface VegaMarketTimestamps {
  /**
   * Time when the market closed.
   * @type {string}
   * @memberof VegaMarketTimestamps
   */
  close?: string
  /**
   * Time when the market has left the opening auction and is ready to accept trades.
   * @type {string}
   * @memberof VegaMarketTimestamps
   */
  open?: string
  /**
   * Time when the market has been voted in and began its opening auction.
   * @type {string}
   * @memberof VegaMarketTimestamps
   */
  pending?: string
  /**
   * Time when the market is first proposed.
   * @type {string}
   * @memberof VegaMarketTimestamps
   */
  proposed?: string
}

/**
 *
 * @export
 * @interface VegaNetworkLimits
 */
export interface VegaNetworkLimits {
  /**
   * Are asset proposals allowed at this point in time.
   * @type {boolean}
   * @memberof VegaNetworkLimits
   */
  canProposeAsset?: boolean
  /**
   * Are market proposals allowed at this point in time.
   * @type {boolean}
   * @memberof VegaNetworkLimits
   */
  canProposeMarket?: boolean
  /**
   * True once the genesis file is loaded.
   * @type {boolean}
   * @memberof VegaNetworkLimits
   */
  genesisLoaded?: boolean
  /**
   * Are asset proposals enabled on this chain.
   * @type {boolean}
   * @memberof VegaNetworkLimits
   */
  proposeAssetEnabled?: boolean
  /**
   * Date/timestamp in unix nanoseconds at which asset proposals will be enabled (0 indicates not set).
   * @type {string}
   * @memberof VegaNetworkLimits
   */
  proposeAssetEnabledFrom?: string
  /**
   * Are market proposals enabled on this chain.
   * @type {boolean}
   * @memberof VegaNetworkLimits
   */
  proposeMarketEnabled?: boolean
  /**
   * Date/timestamp in unix nanoseconds at which market proposals will be enabled (0 indicates not set).
   * @type {string}
   * @memberof VegaNetworkLimits
   */
  proposeMarketEnabledFrom?: string
}

/**
 *
 * @export
 * @interface VegaNetworkParameter
 */
export interface VegaNetworkParameter {
  /**
   * Unique key of the network parameter.
   * @type {string}
   * @memberof VegaNetworkParameter
   */
  key?: string
  /**
   * Value for the network parameter.
   * @type {string}
   * @memberof VegaNetworkParameter
   */
  value?: string
}

/**
 *
 * @export
 * @interface VegaNewAsset
 */
export interface VegaNewAsset {
  /**
   *
   * @type {VegaAssetDetails}
   * @memberof VegaNewAsset
   */
  changes?: VegaAssetDetails
}

/**
 * Freeform proposal This message is just used as a placeholder to sort out the nature of the proposal once parsed.
 * @export
 * @interface VegaNewFreeform
 */
export interface VegaNewFreeform {}

/**
 *
 * @export
 * @interface VegaNewMarket
 */
export interface VegaNewMarket {
  /**
   *
   * @type {VegaNewMarketConfiguration}
   * @memberof VegaNewMarket
   */
  changes?: VegaNewMarketConfiguration
}

/**
 *
 * @export
 * @interface VegaNewMarketConfiguration
 */
export interface VegaNewMarketConfiguration {
  /**
   * Decimal places used for the new market, sets the smallest price increment on the book.
   * @type {string}
   * @memberof VegaNewMarketConfiguration
   */
  decimalPlaces?: string
  /**
   *
   * @type {VegaInstrumentConfiguration}
   * @memberof VegaNewMarketConfiguration
   */
  instrument?: VegaInstrumentConfiguration
  /**
   * Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
   * @type {string}
   * @memberof VegaNewMarketConfiguration
   */
  linearSlippageFactor?: string
  /**
   *
   * @type {VegaLiquidityMonitoringParameters}
   * @memberof VegaNewMarketConfiguration
   */
  liquidityMonitoringParameters?: VegaLiquidityMonitoringParameters
  /**
   *
   * @type {VegaLogNormalRiskModel}
   * @memberof VegaNewMarketConfiguration
   */
  logNormal?: VegaLogNormalRiskModel
  /**
   * Percentage move up and down from the mid price which specifies the range of price levels over which automated liquidity provision orders will be deployed.
   * @type {string}
   * @memberof VegaNewMarketConfiguration
   */
  lpPriceRange?: string
  /**
   * Optional new market metadata, tags.
   * @type {Array<string>}
   * @memberof VegaNewMarketConfiguration
   */
  metadata?: Array<string>
  /**
   * Decimal places for order sizes, sets what size the smallest order / position on the market can be.
   * @type {string}
   * @memberof VegaNewMarketConfiguration
   */
  positionDecimalPlaces?: string
  /**
   *
   * @type {VegaPriceMonitoringParameters}
   * @memberof VegaNewMarketConfiguration
   */
  priceMonitoringParameters?: VegaPriceMonitoringParameters
  /**
   * Quadratic slippage factor is used to cap the slippage component of maintenance margin - it is applied to the square of the slippage volume.
   * @type {string}
   * @memberof VegaNewMarketConfiguration
   */
  quadraticSlippageFactor?: string
  /**
   *
   * @type {VegaSimpleModelParams}
   * @memberof VegaNewMarketConfiguration
   */
  simple?: VegaSimpleModelParams
}

/**
 *
 * @export
 * @interface VegaOracleData
 */
export interface VegaOracleData {
  /**
   *
   * @type {V1ExternalData}
   * @memberof VegaOracleData
   */
  externalData?: V1ExternalData
}

/**
 *
 * @export
 * @interface VegaOracleSpec
 */
export interface VegaOracleSpec {
  /**
   *
   * @type {VegaExternalDataSourceSpec}
   * @memberof VegaOracleSpec
   */
  externalDataSourceSpec?: VegaExternalDataSourceSpec
}

/**
 *
 * @export
 * @interface VegaOrder
 */
export interface VegaOrder {
  /**
   *
   * @type {string}
   * @memberof VegaOrder
   */
  batchId?: string
  /**
   * Timestamp for when the order was created at, in nanoseconds.
   * @type {string}
   * @memberof VegaOrder
   */
  createdAt?: string
  /**
   * Timestamp for when the order will expire, in nanoseconds.
   * @type {string}
   * @memberof VegaOrder
   */
  expiresAt?: string
  /**
   * Unique ID generated for the order. This is set by the system after consensus.
   * @type {string}
   * @memberof VegaOrder
   */
  id?: string
  /**
   * Set if order was created as part of a liquidity provision, will be empty if not.
   * @type {string}
   * @memberof VegaOrder
   */
  liquidityProvisionId?: string
  /**
   * Market ID for the order.
   * @type {string}
   * @memberof VegaOrder
   */
  marketId?: string
  /**
   * Party ID for the order.
   * @type {string}
   * @memberof VegaOrder
   */
  partyId?: string
  /**
   *
   * @type {VegaPeggedOrder}
   * @memberof VegaOrder
   */
  peggedOrder?: VegaPeggedOrder
  /**
   * Only valid for Limit orders. Cannot be True at the same time as Reduce-Only.
   * @type {boolean}
   * @memberof VegaOrder
   */
  postOnly?: boolean
  /**
   * Price for the order, the price is an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places.
   * @type {string}
   * @memberof VegaOrder
   */
  price?: string
  /**
   *
   * @type {VegaOrderError}
   * @memberof VegaOrder
   */
  reason?: VegaOrderError
  /**
   * Only valid for Non-Persistent orders. Cannot be True at the same time as Post-Only. If set, order will only be executed if the outcome of the trade moves the trader's position closer to 0.
   * @type {boolean}
   * @memberof VegaOrder
   */
  reduceOnly?: boolean
  /**
   * Reference given for the order, this is typically used to retrieve an order submitted through consensus - Currently set internally by the node to return a unique reference ID for the order submission.
   * @type {string}
   * @memberof VegaOrder
   */
  reference?: string
  /**
   * Size remaining, when this reaches 0 then the order is fully filled and status becomes STATUS_FILLED.
   * @type {string}
   * @memberof VegaOrder
   */
  remaining?: string
  /**
   *
   * @type {VegaSide}
   * @memberof VegaOrder
   */
  side?: VegaSide
  /**
   * Size for the order, for example, in a futures market the size equals the number of contracts.
   * @type {string}
   * @memberof VegaOrder
   */
  size?: string
  /**
   *
   * @type {VegaOrderStatus}
   * @memberof VegaOrder
   */
  status?: VegaOrderStatus
  /**
   *
   * @type {OrderTimeInForce}
   * @memberof VegaOrder
   */
  timeInForce?: OrderTimeInForce
  /**
   *
   * @type {VegaOrderType}
   * @memberof VegaOrder
   */
  type?: VegaOrderType
  /**
   * Timestamp for when the order was last updated, in nanoseconds.
   * @type {string}
   * @memberof VegaOrder
   */
  updatedAt?: string
  /**
   *
   * @type {string}
   * @memberof VegaOrder
   */
  version?: string
}

/**
 * - ORDER_ERROR_UNSPECIFIED: Default value, no error reported  - ORDER_ERROR_INVALID_MARKET_ID: Order was submitted for a market that does not exist  - ORDER_ERROR_INVALID_ORDER_ID: Order was submitted with an invalid ID  - ORDER_ERROR_OUT_OF_SEQUENCE: Order was amended with a sequence number that was not previous version + 1  - ORDER_ERROR_INVALID_REMAINING_SIZE: Order was amended with an invalid remaining size (e.g. remaining greater than total size)  - ORDER_ERROR_TIME_FAILURE: Node was unable to get Vega (blockchain) time  - ORDER_ERROR_REMOVAL_FAILURE: Failed to remove an order from the book  - ORDER_ERROR_INVALID_EXPIRATION_DATETIME: Order with `TimeInForce.TIME_IN_FORCE_GTT` was submitted or amended with an expiration that was badly formatted or otherwise invalid  - ORDER_ERROR_INVALID_ORDER_REFERENCE: Order was submitted or amended with an invalid reference field  - ORDER_ERROR_EDIT_NOT_ALLOWED: Order amend was submitted for an order field that cannot not be amended (e.g. order ID)  - ORDER_ERROR_AMEND_FAILURE: Amend failure because amend details do not match original order  - ORDER_ERROR_NOT_FOUND: Order not found in an order book or store  - ORDER_ERROR_INVALID_PARTY_ID: Order was submitted with an invalid or missing party ID  - ORDER_ERROR_MARKET_CLOSED: Order was submitted for a market that has closed  - ORDER_ERROR_MARGIN_CHECK_FAILED: Order was submitted, but the party did not have enough collateral to cover the order  - ORDER_ERROR_MISSING_GENERAL_ACCOUNT: Order was submitted, but the party did not have an account for this asset  - ORDER_ERROR_INTERNAL_ERROR: Unspecified internal error  - ORDER_ERROR_INVALID_SIZE: Order was submitted with an invalid or missing size (e.g. 0)  - ORDER_ERROR_INVALID_PERSISTENCE: Order was submitted with an invalid persistence for its type  - ORDER_ERROR_INVALID_TYPE: Order was submitted with an invalid type field  - ORDER_ERROR_SELF_TRADING: Order was stopped as it would have traded with another order submitted from the same party  - ORDER_ERROR_INSUFFICIENT_FUNDS_TO_PAY_FEES: Order was submitted, but the party did not have enough collateral to cover the fees for the order  - ORDER_ERROR_INCORRECT_MARKET_TYPE: Order was submitted with an incorrect or invalid market type  - ORDER_ERROR_INVALID_TIME_IN_FORCE: Order was submitted with invalid time in force  - ORDER_ERROR_CANNOT_SEND_GFN_ORDER_DURING_AN_AUCTION: Good For Normal order has reached the market when it is in auction mode  - ORDER_ERROR_CANNOT_SEND_GFA_ORDER_DURING_CONTINUOUS_TRADING: Good For Auction order has reached the market when it is in continuous trading mode  - ORDER_ERROR_CANNOT_AMEND_TO_GTT_WITHOUT_EXPIRYAT: Attempt to amend order to GTT without ExpiryAt  - ORDER_ERROR_EXPIRYAT_BEFORE_CREATEDAT: Attempt to amend ExpiryAt to a value before CreatedAt  - ORDER_ERROR_CANNOT_HAVE_GTC_AND_EXPIRYAT: Attempt to amend to GTC without an ExpiryAt value  - ORDER_ERROR_CANNOT_AMEND_TO_FOK_OR_IOC: Amending to FOK or IOC is invalid  - ORDER_ERROR_CANNOT_AMEND_TO_GFA_OR_GFN: Amending to GFA or GFN is invalid  - ORDER_ERROR_CANNOT_AMEND_FROM_GFA_OR_GFN: Amending from GFA or GFN is invalid  - ORDER_ERROR_CANNOT_SEND_IOC_ORDER_DURING_AUCTION: IOC orders are not allowed during auction  - ORDER_ERROR_CANNOT_SEND_FOK_ORDER_DURING_AUCTION: FOK orders are not allowed during auction  - ORDER_ERROR_MUST_BE_LIMIT_ORDER: Pegged orders must be LIMIT orders  - ORDER_ERROR_MUST_BE_GTT_OR_GTC: Pegged orders can only have TIF GTC or GTT  - ORDER_ERROR_WITHOUT_REFERENCE_PRICE: Pegged order must have a reference price  - ORDER_ERROR_BUY_CANNOT_REFERENCE_BEST_ASK_PRICE: Buy pegged order cannot reference best ask price  - ORDER_ERROR_OFFSET_MUST_BE_GREATER_OR_EQUAL_TO_ZERO: Pegged order offset must be >= 0  - ORDER_ERROR_SELL_CANNOT_REFERENCE_BEST_BID_PRICE: Sell pegged order cannot reference best bid price  - ORDER_ERROR_OFFSET_MUST_BE_GREATER_THAN_ZERO: Pegged order offset must be > zero  - ORDER_ERROR_INSUFFICIENT_ASSET_BALANCE: Party has an insufficient balance, or does not have a general account to submit the order (no deposits made for the required asset)  - ORDER_ERROR_CANNOT_AMEND_PEGGED_ORDER_DETAILS_ON_NON_PEGGED_ORDER: Cannot amend details of a non pegged details  - ORDER_ERROR_UNABLE_TO_REPRICE_PEGGED_ORDER: Could not re-price a pegged order because a market price is unavailable  - ORDER_ERROR_UNABLE_TO_AMEND_PRICE_ON_PEGGED_ORDER: It is not possible to amend the price of an existing pegged order  - ORDER_ERROR_NON_PERSISTENT_ORDER_OUT_OF_PRICE_BOUNDS: FOK, IOC, or GFN order was rejected because it resulted in trades outside the price bounds  - ORDER_ERROR_TOO_MANY_PEGGED_ORDERS: Unable to submit pegged order, temporarily too many pegged orders across all markets  - ORDER_ERROR_POST_ONLY_ORDER_WOULD_TRADE: Post order would trade  - ORDER_ERROR_REDUCE_ONLY_ORDER_WOULD_NOT_REDUCE_POSITION: Post order would trade
 * @export
 * @enum {string}
 */
export enum VegaOrderError {
  UNSPECIFIED = 'ORDER_ERROR_UNSPECIFIED' as any,
  INVALIDMARKETID = 'ORDER_ERROR_INVALID_MARKET_ID' as any,
  INVALIDORDERID = 'ORDER_ERROR_INVALID_ORDER_ID' as any,
  OUTOFSEQUENCE = 'ORDER_ERROR_OUT_OF_SEQUENCE' as any,
  INVALIDREMAININGSIZE = 'ORDER_ERROR_INVALID_REMAINING_SIZE' as any,
  TIMEFAILURE = 'ORDER_ERROR_TIME_FAILURE' as any,
  REMOVALFAILURE = 'ORDER_ERROR_REMOVAL_FAILURE' as any,
  INVALIDEXPIRATIONDATETIME = 'ORDER_ERROR_INVALID_EXPIRATION_DATETIME' as any,
  INVALIDORDERREFERENCE = 'ORDER_ERROR_INVALID_ORDER_REFERENCE' as any,
  EDITNOTALLOWED = 'ORDER_ERROR_EDIT_NOT_ALLOWED' as any,
  AMENDFAILURE = 'ORDER_ERROR_AMEND_FAILURE' as any,
  NOTFOUND = 'ORDER_ERROR_NOT_FOUND' as any,
  INVALIDPARTYID = 'ORDER_ERROR_INVALID_PARTY_ID' as any,
  MARKETCLOSED = 'ORDER_ERROR_MARKET_CLOSED' as any,
  MARGINCHECKFAILED = 'ORDER_ERROR_MARGIN_CHECK_FAILED' as any,
  MISSINGGENERALACCOUNT = 'ORDER_ERROR_MISSING_GENERAL_ACCOUNT' as any,
  INTERNALERROR = 'ORDER_ERROR_INTERNAL_ERROR' as any,
  INVALIDSIZE = 'ORDER_ERROR_INVALID_SIZE' as any,
  INVALIDPERSISTENCE = 'ORDER_ERROR_INVALID_PERSISTENCE' as any,
  INVALIDTYPE = 'ORDER_ERROR_INVALID_TYPE' as any,
  SELFTRADING = 'ORDER_ERROR_SELF_TRADING' as any,
  INSUFFICIENTFUNDSTOPAYFEES = 'ORDER_ERROR_INSUFFICIENT_FUNDS_TO_PAY_FEES' as any,
  INCORRECTMARKETTYPE = 'ORDER_ERROR_INCORRECT_MARKET_TYPE' as any,
  INVALIDTIMEINFORCE = 'ORDER_ERROR_INVALID_TIME_IN_FORCE' as any,
  CANNOTSENDGFNORDERDURINGANAUCTION = 'ORDER_ERROR_CANNOT_SEND_GFN_ORDER_DURING_AN_AUCTION' as any,
  CANNOTSENDGFAORDERDURINGCONTINUOUSTRADING = 'ORDER_ERROR_CANNOT_SEND_GFA_ORDER_DURING_CONTINUOUS_TRADING' as any,
  CANNOTAMENDTOGTTWITHOUTEXPIRYAT = 'ORDER_ERROR_CANNOT_AMEND_TO_GTT_WITHOUT_EXPIRYAT' as any,
  EXPIRYATBEFORECREATEDAT = 'ORDER_ERROR_EXPIRYAT_BEFORE_CREATEDAT' as any,
  CANNOTHAVEGTCANDEXPIRYAT = 'ORDER_ERROR_CANNOT_HAVE_GTC_AND_EXPIRYAT' as any,
  CANNOTAMENDTOFOKORIOC = 'ORDER_ERROR_CANNOT_AMEND_TO_FOK_OR_IOC' as any,
  CANNOTAMENDTOGFAORGFN = 'ORDER_ERROR_CANNOT_AMEND_TO_GFA_OR_GFN' as any,
  CANNOTAMENDFROMGFAORGFN = 'ORDER_ERROR_CANNOT_AMEND_FROM_GFA_OR_GFN' as any,
  CANNOTSENDIOCORDERDURINGAUCTION = 'ORDER_ERROR_CANNOT_SEND_IOC_ORDER_DURING_AUCTION' as any,
  CANNOTSENDFOKORDERDURINGAUCTION = 'ORDER_ERROR_CANNOT_SEND_FOK_ORDER_DURING_AUCTION' as any,
  MUSTBELIMITORDER = 'ORDER_ERROR_MUST_BE_LIMIT_ORDER' as any,
  MUSTBEGTTORGTC = 'ORDER_ERROR_MUST_BE_GTT_OR_GTC' as any,
  WITHOUTREFERENCEPRICE = 'ORDER_ERROR_WITHOUT_REFERENCE_PRICE' as any,
  BUYCANNOTREFERENCEBESTASKPRICE = 'ORDER_ERROR_BUY_CANNOT_REFERENCE_BEST_ASK_PRICE' as any,
  OFFSETMUSTBEGREATEROREQUALTOZERO = 'ORDER_ERROR_OFFSET_MUST_BE_GREATER_OR_EQUAL_TO_ZERO' as any,
  SELLCANNOTREFERENCEBESTBIDPRICE = 'ORDER_ERROR_SELL_CANNOT_REFERENCE_BEST_BID_PRICE' as any,
  OFFSETMUSTBEGREATERTHANZERO = 'ORDER_ERROR_OFFSET_MUST_BE_GREATER_THAN_ZERO' as any,
  INSUFFICIENTASSETBALANCE = 'ORDER_ERROR_INSUFFICIENT_ASSET_BALANCE' as any,
  CANNOTAMENDPEGGEDORDERDETAILSONNONPEGGEDORDER = 'ORDER_ERROR_CANNOT_AMEND_PEGGED_ORDER_DETAILS_ON_NON_PEGGED_ORDER' as any,
  UNABLETOREPRICEPEGGEDORDER = 'ORDER_ERROR_UNABLE_TO_REPRICE_PEGGED_ORDER' as any,
  UNABLETOAMENDPRICEONPEGGEDORDER = 'ORDER_ERROR_UNABLE_TO_AMEND_PRICE_ON_PEGGED_ORDER' as any,
  NONPERSISTENTORDEROUTOFPRICEBOUNDS = 'ORDER_ERROR_NON_PERSISTENT_ORDER_OUT_OF_PRICE_BOUNDS' as any,
  TOOMANYPEGGEDORDERS = 'ORDER_ERROR_TOO_MANY_PEGGED_ORDERS' as any,
  POSTONLYORDERWOULDTRADE = 'ORDER_ERROR_POST_ONLY_ORDER_WOULD_TRADE' as any,
  REDUCEONLYORDERWOULDNOTREDUCEPOSITION = 'ORDER_ERROR_REDUCE_ONLY_ORDER_WOULD_NOT_REDUCE_POSITION' as any
}

/**
 * - STATUS_UNSPECIFIED: Default value, always invalid  - STATUS_ACTIVE: Used for active unfilled or partially filled orders  - STATUS_EXPIRED: Used for expired GTT orders  - STATUS_CANCELLED: Used for orders cancelled by the party that created the order  - STATUS_STOPPED: Used for unfilled FOK or IOC orders, and for orders that were stopped by the network  - STATUS_FILLED: Used for closed fully filled orders  - STATUS_REJECTED: Used for orders when not enough collateral was available to fill the margin requirements  - STATUS_PARTIALLY_FILLED: Used for closed partially filled IOC orders  - STATUS_PARKED: Order has been removed from the order book and has been parked, this applies to pegged orders and liquidity orders (orders created from a liquidity provision shape)
 * @export
 * @enum {string}
 */
export enum VegaOrderStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  ACTIVE = 'STATUS_ACTIVE' as any,
  EXPIRED = 'STATUS_EXPIRED' as any,
  CANCELLED = 'STATUS_CANCELLED' as any,
  STOPPED = 'STATUS_STOPPED' as any,
  FILLED = 'STATUS_FILLED' as any,
  REJECTED = 'STATUS_REJECTED' as any,
  PARTIALLYFILLED = 'STATUS_PARTIALLY_FILLED' as any,
  PARKED = 'STATUS_PARKED' as any
}

/**
 * - TYPE_UNSPECIFIED: Default value, always invalid  - TYPE_LIMIT: Used for Limit orders  - TYPE_MARKET: Used for Market orders  - TYPE_NETWORK: Used for orders where the initiating party is the network (with distressed parties)
 * @export
 * @enum {string}
 */
export enum VegaOrderType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  LIMIT = 'TYPE_LIMIT' as any,
  MARKET = 'TYPE_MARKET' as any,
  NETWORK = 'TYPE_NETWORK' as any
}

/**
 *
 * @export
 * @interface VegaParty
 */
export interface VegaParty {
  /**
   * Unique ID for the party, typically represented by a public key.
   * @type {string}
   * @memberof VegaParty
   */
  id?: string
}

/**
 *
 * @export
 * @interface VegaPeggedOrder
 */
export interface VegaPeggedOrder {
  /**
   * Offset from the price reference.
   * @type {string}
   * @memberof VegaPeggedOrder
   */
  offset?: string
  /**
   *
   * @type {VegaPeggedReference}
   * @memberof VegaPeggedOrder
   */
  reference?: VegaPeggedReference
}

/**
 * - PEGGED_REFERENCE_UNSPECIFIED: Default value for PeggedReference, no reference given  - PEGGED_REFERENCE_MID: Mid price reference  - PEGGED_REFERENCE_BEST_BID: Best bid price reference  - PEGGED_REFERENCE_BEST_ASK: Best ask price reference
 * @export
 * @enum {string}
 */
export enum VegaPeggedReference {
  UNSPECIFIED = 'PEGGED_REFERENCE_UNSPECIFIED' as any,
  MID = 'PEGGED_REFERENCE_MID' as any,
  BESTBID = 'PEGGED_REFERENCE_BEST_BID' as any,
  BESTASK = 'PEGGED_REFERENCE_BEST_ASK' as any
}

/**
 *
 * @export
 * @interface VegaPostTransferBalance
 */
export interface VegaPostTransferBalance {
  /**
   *
   * @type {VegaAccountDetails}
   * @memberof VegaPostTransferBalance
   */
  account?: VegaAccountDetails
  /**
   * Balance relating to the transfer. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaPostTransferBalance
   */
  balance?: string
}

/**
 *
 * @export
 * @interface VegaPriceMonitoringBounds
 */
export interface VegaPriceMonitoringBounds {
  /**
   * Maximum price that isn't currently breaching the specified price monitoring trigger. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaPriceMonitoringBounds
   */
  maxValidPrice?: string
  /**
   * Minimum price that isn't currently breaching the specified price monitoring trigger. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaPriceMonitoringBounds
   */
  minValidPrice?: string
  /**
   * Reference price used to calculate the valid price range. This field is an unsigned integer scaled to the market's decimal places.
   * @type {string}
   * @memberof VegaPriceMonitoringBounds
   */
  referencePrice?: string
  /**
   *
   * @type {VegaPriceMonitoringTrigger}
   * @memberof VegaPriceMonitoringBounds
   */
  trigger?: VegaPriceMonitoringTrigger
}

/**
 *
 * @export
 * @interface VegaPriceMonitoringParameters
 */
export interface VegaPriceMonitoringParameters {
  /**
   *
   * @type {Array<VegaPriceMonitoringTrigger>}
   * @memberof VegaPriceMonitoringParameters
   */
  triggers?: Array<VegaPriceMonitoringTrigger>
}

/**
 *
 * @export
 * @interface VegaPriceMonitoringSettings
 */
export interface VegaPriceMonitoringSettings {
  /**
   *
   * @type {VegaPriceMonitoringParameters}
   * @memberof VegaPriceMonitoringSettings
   */
  parameters?: VegaPriceMonitoringParameters
}

/**
 *
 * @export
 * @interface VegaPriceMonitoringTrigger
 */
export interface VegaPriceMonitoringTrigger {
  /**
   * Price monitoring auction extension duration in seconds should the price breach its theoretical level over the specified horizon at the specified probability level.
   * @type {string}
   * @memberof VegaPriceMonitoringTrigger
   */
  auctionExtension?: string
  /**
   * Price monitoring projection horizon τ in seconds.
   * @type {string}
   * @memberof VegaPriceMonitoringTrigger
   */
  horizon?: string
  /**
   * Price monitoring probability level p.
   * @type {string}
   * @memberof VegaPriceMonitoringTrigger
   */
  probability?: string
}

/**
 *
 * @export
 * @interface VegaProposal
 */
export interface VegaProposal {
  /**
   * Detailed error associated to the reason.
   * @type {string}
   * @memberof VegaProposal
   */
  errorDetails?: string
  /**
   * Unique proposal ID.
   * @type {string}
   * @memberof VegaProposal
   */
  id?: string
  /**
   * Party ID i.e. public key of the party submitting the proposal.
   * @type {string}
   * @memberof VegaProposal
   */
  partyId?: string
  /**
   *
   * @type {VegaProposalRationale}
   * @memberof VegaProposal
   */
  rationale?: VegaProposalRationale
  /**
   *
   * @type {VegaProposalError}
   * @memberof VegaProposal
   */
  reason?: VegaProposalError
  /**
   * Proposal reference.
   * @type {string}
   * @memberof VegaProposal
   */
  reference?: string
  /**
   * Required majority from liquidity providers, optional but is required for market update proposal.
   * @type {string}
   * @memberof VegaProposal
   */
  requiredLiquidityProviderMajority?: string
  /**
   * Required participation from liquidity providers, optional but is required for market update proposal.
   * @type {string}
   * @memberof VegaProposal
   */
  requiredLiquidityProviderParticipation?: string
  /**
   * Required majority for this proposal.
   * @type {string}
   * @memberof VegaProposal
   */
  requiredMajority?: string
  /**
   * Required vote participation for this proposal.
   * @type {string}
   * @memberof VegaProposal
   */
  requiredParticipation?: string
  /**
   *
   * @type {VegaProposalState}
   * @memberof VegaProposal
   */
  state?: VegaProposalState
  /**
   *
   * @type {VegaProposalTerms}
   * @memberof VegaProposal
   */
  terms?: VegaProposalTerms
  /**
   * Proposal timestamp for date and time as Unix time in nanoseconds when proposal was submitted to the network.
   * @type {string}
   * @memberof VegaProposal
   */
  timestamp?: string
}

/**
 * - PROPOSAL_ERROR_UNSPECIFIED: Default value  - PROPOSAL_ERROR_CLOSE_TIME_TOO_SOON: Specified close time is too early based on network parameters  - PROPOSAL_ERROR_CLOSE_TIME_TOO_LATE: Specified close time is too late based on network parameters  - PROPOSAL_ERROR_ENACT_TIME_TOO_SOON: Specified enactment time is too early based on network parameters  - PROPOSAL_ERROR_ENACT_TIME_TOO_LATE: Specified enactment time is too late based on network parameters  - PROPOSAL_ERROR_INSUFFICIENT_TOKENS: Proposer for this proposal has insufficient tokens  - PROPOSAL_ERROR_INVALID_INSTRUMENT_SECURITY: Instrument quote name and base name were the same  - PROPOSAL_ERROR_NO_PRODUCT: Proposal has no product  - PROPOSAL_ERROR_UNSUPPORTED_PRODUCT: Specified product is not supported  - PROPOSAL_ERROR_NO_TRADING_MODE: Proposal has no trading mode  - PROPOSAL_ERROR_UNSUPPORTED_TRADING_MODE: Proposal has an unsupported trading mode  - PROPOSAL_ERROR_NODE_VALIDATION_FAILED: Proposal failed node validation  - PROPOSAL_ERROR_MISSING_BUILTIN_ASSET_FIELD: Field is missing in a builtin asset source  - PROPOSAL_ERROR_MISSING_ERC20_CONTRACT_ADDRESS: Contract address is missing in the ERC20 asset source  - PROPOSAL_ERROR_INVALID_ASSET: Asset ID is invalid or does not exist on the Vega network  - PROPOSAL_ERROR_INCOMPATIBLE_TIMESTAMPS: Proposal terms timestamps are not compatible (Validation < Closing < Enactment)  - PROPOSAL_ERROR_NO_RISK_PARAMETERS: No risk parameters were specified  - PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_KEY: Invalid key in update network parameter proposal  - PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_VALUE: Invalid value in update network parameter proposal  - PROPOSAL_ERROR_NETWORK_PARAMETER_VALIDATION_FAILED: Validation failed for network parameter proposal  - PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_SMALL: Opening auction duration is less than the network minimum opening auction time  - PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_LARGE: Opening auction duration is more than the network minimum opening auction time  - PROPOSAL_ERROR_COULD_NOT_INSTANTIATE_MARKET: Market proposal market could not be instantiated in execution  - PROPOSAL_ERROR_INVALID_FUTURE_PRODUCT: Market proposal market contained invalid product definition  - PROPOSAL_ERROR_INVALID_RISK_PARAMETER: Market proposal has invalid risk parameter  - PROPOSAL_ERROR_MAJORITY_THRESHOLD_NOT_REACHED: Proposal was declined because vote didn't reach the majority threshold required  - PROPOSAL_ERROR_PARTICIPATION_THRESHOLD_NOT_REACHED: Proposal declined because the participation threshold was not reached  - PROPOSAL_ERROR_INVALID_ASSET_DETAILS: Asset proposal has invalid asset details  - PROPOSAL_ERROR_UNKNOWN_TYPE: Proposal is an unknown type  - PROPOSAL_ERROR_UNKNOWN_RISK_PARAMETER_TYPE: Proposal has an unknown risk parameter type  - PROPOSAL_ERROR_INVALID_FREEFORM: Validation failed for freeform proposal  - PROPOSAL_ERROR_INSUFFICIENT_EQUITY_LIKE_SHARE: Party doesn't have enough equity-like share to propose an update on the market targeted by the proposal  - PROPOSAL_ERROR_INVALID_MARKET: Market targeted by the proposal does not exist or is not eligible for modification  - PROPOSAL_ERROR_TOO_MANY_MARKET_DECIMAL_PLACES: Market proposal decimal place is higher than the market settlement asset decimal places  - PROPOSAL_ERROR_TOO_MANY_PRICE_MONITORING_TRIGGERS: Market proposal contains too many price monitoring triggers  - PROPOSAL_ERROR_ERC20_ADDRESS_ALREADY_IN_USE: Market proposal contains too many price monitoring triggers  - PROPOSAL_ERROR_LP_PRICE_RANGE_NONPOSITIVE: LP price range must be larger than 0  - PROPOSAL_ERROR_LP_PRICE_RANGE_TOO_LARGE: LP price range must not be larger than 100  - PROPOSAL_ERROR_LINEAR_SLIPPAGE_FACTOR_OUT_OF_RANGE: Linear slippage factor is out of range, either negative or too large  - PROPOSAL_ERROR_QUADRATIC_SLIPPAGE_FACTOR_OUT_OF_RANGE: Quadratic slippage factor is out of range, either negative or too large
 * @export
 * @enum {string}
 */
export enum VegaProposalError {
  UNSPECIFIED = 'PROPOSAL_ERROR_UNSPECIFIED' as any,
  CLOSETIMETOOSOON = 'PROPOSAL_ERROR_CLOSE_TIME_TOO_SOON' as any,
  CLOSETIMETOOLATE = 'PROPOSAL_ERROR_CLOSE_TIME_TOO_LATE' as any,
  ENACTTIMETOOSOON = 'PROPOSAL_ERROR_ENACT_TIME_TOO_SOON' as any,
  ENACTTIMETOOLATE = 'PROPOSAL_ERROR_ENACT_TIME_TOO_LATE' as any,
  INSUFFICIENTTOKENS = 'PROPOSAL_ERROR_INSUFFICIENT_TOKENS' as any,
  INVALIDINSTRUMENTSECURITY = 'PROPOSAL_ERROR_INVALID_INSTRUMENT_SECURITY' as any,
  NOPRODUCT = 'PROPOSAL_ERROR_NO_PRODUCT' as any,
  UNSUPPORTEDPRODUCT = 'PROPOSAL_ERROR_UNSUPPORTED_PRODUCT' as any,
  NOTRADINGMODE = 'PROPOSAL_ERROR_NO_TRADING_MODE' as any,
  UNSUPPORTEDTRADINGMODE = 'PROPOSAL_ERROR_UNSUPPORTED_TRADING_MODE' as any,
  NODEVALIDATIONFAILED = 'PROPOSAL_ERROR_NODE_VALIDATION_FAILED' as any,
  MISSINGBUILTINASSETFIELD = 'PROPOSAL_ERROR_MISSING_BUILTIN_ASSET_FIELD' as any,
  MISSINGERC20CONTRACTADDRESS = 'PROPOSAL_ERROR_MISSING_ERC20_CONTRACT_ADDRESS' as any,
  INVALIDASSET = 'PROPOSAL_ERROR_INVALID_ASSET' as any,
  INCOMPATIBLETIMESTAMPS = 'PROPOSAL_ERROR_INCOMPATIBLE_TIMESTAMPS' as any,
  NORISKPARAMETERS = 'PROPOSAL_ERROR_NO_RISK_PARAMETERS' as any,
  NETWORKPARAMETERINVALIDKEY = 'PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_KEY' as any,
  NETWORKPARAMETERINVALIDVALUE = 'PROPOSAL_ERROR_NETWORK_PARAMETER_INVALID_VALUE' as any,
  NETWORKPARAMETERVALIDATIONFAILED = 'PROPOSAL_ERROR_NETWORK_PARAMETER_VALIDATION_FAILED' as any,
  OPENINGAUCTIONDURATIONTOOSMALL = 'PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_SMALL' as any,
  OPENINGAUCTIONDURATIONTOOLARGE = 'PROPOSAL_ERROR_OPENING_AUCTION_DURATION_TOO_LARGE' as any,
  COULDNOTINSTANTIATEMARKET = 'PROPOSAL_ERROR_COULD_NOT_INSTANTIATE_MARKET' as any,
  INVALIDFUTUREPRODUCT = 'PROPOSAL_ERROR_INVALID_FUTURE_PRODUCT' as any,
  INVALIDRISKPARAMETER = 'PROPOSAL_ERROR_INVALID_RISK_PARAMETER' as any,
  MAJORITYTHRESHOLDNOTREACHED = 'PROPOSAL_ERROR_MAJORITY_THRESHOLD_NOT_REACHED' as any,
  PARTICIPATIONTHRESHOLDNOTREACHED = 'PROPOSAL_ERROR_PARTICIPATION_THRESHOLD_NOT_REACHED' as any,
  INVALIDASSETDETAILS = 'PROPOSAL_ERROR_INVALID_ASSET_DETAILS' as any,
  UNKNOWNTYPE = 'PROPOSAL_ERROR_UNKNOWN_TYPE' as any,
  UNKNOWNRISKPARAMETERTYPE = 'PROPOSAL_ERROR_UNKNOWN_RISK_PARAMETER_TYPE' as any,
  INVALIDFREEFORM = 'PROPOSAL_ERROR_INVALID_FREEFORM' as any,
  INSUFFICIENTEQUITYLIKESHARE = 'PROPOSAL_ERROR_INSUFFICIENT_EQUITY_LIKE_SHARE' as any,
  INVALIDMARKET = 'PROPOSAL_ERROR_INVALID_MARKET' as any,
  TOOMANYMARKETDECIMALPLACES = 'PROPOSAL_ERROR_TOO_MANY_MARKET_DECIMAL_PLACES' as any,
  TOOMANYPRICEMONITORINGTRIGGERS = 'PROPOSAL_ERROR_TOO_MANY_PRICE_MONITORING_TRIGGERS' as any,
  ERC20ADDRESSALREADYINUSE = 'PROPOSAL_ERROR_ERC20_ADDRESS_ALREADY_IN_USE' as any,
  LPPRICERANGENONPOSITIVE = 'PROPOSAL_ERROR_LP_PRICE_RANGE_NONPOSITIVE' as any,
  LPPRICERANGETOOLARGE = 'PROPOSAL_ERROR_LP_PRICE_RANGE_TOO_LARGE' as any,
  LINEARSLIPPAGEFACTOROUTOFRANGE = 'PROPOSAL_ERROR_LINEAR_SLIPPAGE_FACTOR_OUT_OF_RANGE' as any,
  QUADRATICSLIPPAGEFACTOROUTOFRANGE = 'PROPOSAL_ERROR_QUADRATIC_SLIPPAGE_FACTOR_OUT_OF_RANGE' as any
}

/**
 * Rationale behind a proposal.
 * @export
 * @interface VegaProposalRationale
 */
export interface VegaProposalRationale {
  /**
   * Description to show a short title / something in case the link goes offline. This is to be between 0 and 20k unicode characters. This is mandatory for all proposals.
   * @type {string}
   * @memberof VegaProposalRationale
   */
  description?: string
  /**
   * Title to be used to give a short description of the proposal in lists. This is to be between 0 and 100 unicode characters. This is mandatory for all proposals.
   * @type {string}
   * @memberof VegaProposalRationale
   */
  title?: string
}

/**
 * - STATE_UNSPECIFIED: Default value, always invalid  - STATE_FAILED: Proposal enactment has failed - even though proposal has passed, its execution could not be performed  - STATE_OPEN: Proposal is open for voting  - STATE_PASSED: Proposal has gained enough support to be executed  - STATE_REJECTED: Proposal wasn't accepted i.e. proposal terms failed validation due to wrong configuration or failed to meet network requirements.  - STATE_DECLINED: Proposal didn't get enough votes, e.g. either failed to gain required participation or majority level.  - STATE_ENACTED: Proposal enacted  - STATE_WAITING_FOR_NODE_VOTE: Waiting for node validation of the proposal
 * @export
 * @enum {string}
 */
export enum VegaProposalState {
  UNSPECIFIED = 'STATE_UNSPECIFIED' as any,
  FAILED = 'STATE_FAILED' as any,
  OPEN = 'STATE_OPEN' as any,
  PASSED = 'STATE_PASSED' as any,
  REJECTED = 'STATE_REJECTED' as any,
  DECLINED = 'STATE_DECLINED' as any,
  ENACTED = 'STATE_ENACTED' as any,
  WAITINGFORNODEVOTE = 'STATE_WAITING_FOR_NODE_VOTE' as any
}

/**
 *
 * @export
 * @interface VegaProposalTerms
 */
export interface VegaProposalTerms {
  /**
   * Timestamp as Unix time in seconds when voting closes for this proposal, constrained by `minClose` and `maxClose` network parameters.
   * @type {string}
   * @memberof VegaProposalTerms
   */
  closingTimestamp?: string
  /**
   * Timestamp as Unix time in seconds when proposal gets enacted if passed, constrained by `minEnact` and `maxEnact` network parameters.
   * @type {string}
   * @memberof VegaProposalTerms
   */
  enactmentTimestamp?: string
  /**
   *
   * @type {VegaNewAsset}
   * @memberof VegaProposalTerms
   */
  newAsset?: VegaNewAsset
  /**
   *
   * @type {VegaNewFreeform}
   * @memberof VegaProposalTerms
   */
  newFreeform?: VegaNewFreeform
  /**
   *
   * @type {VegaNewMarket}
   * @memberof VegaProposalTerms
   */
  newMarket?: VegaNewMarket
  /**
   *
   * @type {VegaUpdateAsset}
   * @memberof VegaProposalTerms
   */
  updateAsset?: VegaUpdateAsset
  /**
   *
   * @type {VegaUpdateMarket}
   * @memberof VegaProposalTerms
   */
  updateMarket?: VegaUpdateMarket
  /**
   *
   * @type {VegaUpdateNetworkParameter}
   * @memberof VegaProposalTerms
   */
  updateNetworkParameter?: VegaUpdateNetworkParameter
  /**
   * Validation timestamp as Unix time in seconds.
   * @type {string}
   * @memberof VegaProposalTerms
   */
  validationTimestamp?: string
}

/**
 *
 * @export
 * @interface VegaRiskFactor
 */
export interface VegaRiskFactor {
  /**
   * Long Risk factor value.
   * @type {string}
   * @memberof VegaRiskFactor
   */
  _long?: string
  /**
   * Market ID that relates to this risk factor.
   * @type {string}
   * @memberof VegaRiskFactor
   */
  market?: string
  /**
   * Short Risk factor value.
   * @type {string}
   * @memberof VegaRiskFactor
   */
  _short?: string
}

/**
 *
 * @export
 * @interface VegaScalingFactors
 */
export interface VegaScalingFactors {
  /**
   * Collateral release level. If a trader has collateral above this level, the system will release collateral to a trader's general collateral account for the asset.
   * @type {number}
   * @memberof VegaScalingFactors
   */
  collateralRelease?: number
  /**
   * Initial margin level. This is the minimum amount of collateral required to open a position in a market that requires margin.
   * @type {number}
   * @memberof VegaScalingFactors
   */
  initialMargin?: number
  /**
   * Collateral search level. If collateral dips below this value, the system will search for collateral to release.
   * @type {number}
   * @memberof VegaScalingFactors
   */
  searchLevel?: number
}

/**
 * - SIDE_UNSPECIFIED: Default value, always invalid  - SIDE_BUY: Buy order  - SIDE_SELL: Sell order
 * @export
 * @enum {string}
 */
export enum VegaSide {
  UNSPECIFIED = 'SIDE_UNSPECIFIED' as any,
  BUY = 'SIDE_BUY' as any,
  SELL = 'SIDE_SELL' as any
}

/**
 *
 * @export
 * @interface VegaSimpleModelParams
 */
export interface VegaSimpleModelParams {
  /**
   * Pre-defined risk factor value for long.
   * @type {number}
   * @memberof VegaSimpleModelParams
   */
  factorLong?: number
  /**
   * Pre-defined risk factor value for short.
   * @type {number}
   * @memberof VegaSimpleModelParams
   */
  factorShort?: number
  /**
   * Pre-defined maximum price move up that the model considers as valid.
   * @type {number}
   * @memberof VegaSimpleModelParams
   */
  maxMoveUp?: number
  /**
   * Pre-defined minimum price move down that the model considers as valid.
   * @type {number}
   * @memberof VegaSimpleModelParams
   */
  minMoveDown?: number
  /**
   * Pre-defined constant probability of trading.
   * @type {number}
   * @memberof VegaSimpleModelParams
   */
  probabilityOfTrading?: number
}

/**
 *
 * @export
 * @interface VegaSimpleRiskModel
 */
export interface VegaSimpleRiskModel {
  /**
   *
   * @type {VegaSimpleModelParams}
   * @memberof VegaSimpleRiskModel
   */
  params?: VegaSimpleModelParams
}

/**
 *
 * @export
 * @interface VegaTargetStakeParameters
 */
export interface VegaTargetStakeParameters {
  /**
   * Specifies scaling factors used in target stake calculation.
   * @type {number}
   * @memberof VegaTargetStakeParameters
   */
  scalingFactor?: number
  /**
   * Specifies length of time window expressed in seconds for target stake calculation.
   * @type {string}
   * @memberof VegaTargetStakeParameters
   */
  timeWindow?: string
}

/**
 *
 * @export
 * @interface VegaTradableInstrument
 */
export interface VegaTradableInstrument {
  /**
   *
   * @type {VegaInstrument}
   * @memberof VegaTradableInstrument
   */
  instrument?: VegaInstrument
  /**
   *
   * @type {VegaLogNormalRiskModel}
   * @memberof VegaTradableInstrument
   */
  logNormalRiskModel?: VegaLogNormalRiskModel
  /**
   *
   * @type {VegaMarginCalculator}
   * @memberof VegaTradableInstrument
   */
  marginCalculator?: VegaMarginCalculator
  /**
   *
   * @type {VegaSimpleRiskModel}
   * @memberof VegaTradableInstrument
   */
  simpleRiskModel?: VegaSimpleRiskModel
}

/**
 *
 * @export
 * @interface VegaTrade
 */
export interface VegaTrade {
  /**
   *
   * @type {VegaSide}
   * @memberof VegaTrade
   */
  aggressor?: VegaSide
  /**
   * Identifier of the order from the buy side.
   * @type {string}
   * @memberof VegaTrade
   */
  buyOrder?: string
  /**
   * Unique party ID for the buyer.
   * @type {string}
   * @memberof VegaTrade
   */
  buyer?: string
  /**
   * Auction batch number that the buy side order was placed in.
   * @type {string}
   * @memberof VegaTrade
   */
  buyerAuctionBatch?: string
  /**
   *
   * @type {VegaFee}
   * @memberof VegaTrade
   */
  buyerFee?: VegaFee
  /**
   * Unique ID for the trade (generated by Vega).
   * @type {string}
   * @memberof VegaTrade
   */
  id?: string
  /**
   * Market ID (the market that the trade occurred on).
   * @type {string}
   * @memberof VegaTrade
   */
  marketId?: string
  /**
   * Price for the trade, the price is an integer, for example `123456` is a correctly formatted price of `1.23456` assuming market configured to 5 decimal places.
   * @type {string}
   * @memberof VegaTrade
   */
  price?: string
  /**
   * Identifier of the order from the sell side.
   * @type {string}
   * @memberof VegaTrade
   */
  sellOrder?: string
  /**
   * Unique party ID for the seller.
   * @type {string}
   * @memberof VegaTrade
   */
  seller?: string
  /**
   * Auction batch number that the sell side order was placed in.
   * @type {string}
   * @memberof VegaTrade
   */
  sellerAuctionBatch?: string
  /**
   *
   * @type {VegaFee}
   * @memberof VegaTrade
   */
  sellerFee?: VegaFee
  /**
   * Size filled for the trade.
   * @type {string}
   * @memberof VegaTrade
   */
  size?: string
  /**
   * Timestamp for when the trade occurred, in nanoseconds.
   * @type {string}
   * @memberof VegaTrade
   */
  timestamp?: string
  /**
   *
   * @type {VegaTradeType}
   * @memberof VegaTrade
   */
  type?: VegaTradeType
}

/**
 * - TYPE_UNSPECIFIED: Default value, always invalid  - TYPE_DEFAULT: Normal trading between two parties  - TYPE_NETWORK_CLOSE_OUT_GOOD: Trading initiated by the network with another party on the book, which helps to zero-out the positions of one or more distressed parties  - TYPE_NETWORK_CLOSE_OUT_BAD: Trading initiated by the network with another party off the book, with a distressed party in order to zero-out the position of the party
 * @export
 * @enum {string}
 */
export enum VegaTradeType {
  UNSPECIFIED = 'TYPE_UNSPECIFIED' as any,
  DEFAULT = 'TYPE_DEFAULT' as any,
  NETWORKCLOSEOUTGOOD = 'TYPE_NETWORK_CLOSE_OUT_GOOD' as any,
  NETWORKCLOSEOUTBAD = 'TYPE_NETWORK_CLOSE_OUT_BAD' as any
}

/**
 * - TRANSFER_TYPE_UNSPECIFIED: Default value, always invalid  - TRANSFER_TYPE_LOSS: Funds deducted after final settlement loss  - TRANSFER_TYPE_WIN: Funds added to general account after final settlement gain  - TRANSFER_TYPE_MTM_LOSS: Funds deducted from margin account after mark to market loss  - TRANSFER_TYPE_MTM_WIN: Funds added to margin account after mark to market gain  - TRANSFER_TYPE_MARGIN_LOW: Funds transferred from general account to meet margin requirement  - TRANSFER_TYPE_MARGIN_HIGH: Excess margin amount returned to general account  - TRANSFER_TYPE_MARGIN_CONFISCATED: Margin confiscated from margin account to fulfil closeout  - TRANSFER_TYPE_MAKER_FEE_PAY: Maker fee paid from general account  - TRANSFER_TYPE_MAKER_FEE_RECEIVE: Maker fee received into general account  - TRANSFER_TYPE_INFRASTRUCTURE_FEE_PAY: Infrastructure fee paid from general account  - TRANSFER_TYPE_INFRASTRUCTURE_FEE_DISTRIBUTE: Infrastructure fee received into general account  - TRANSFER_TYPE_LIQUIDITY_FEE_PAY: Liquidity fee paid from general account  - TRANSFER_TYPE_LIQUIDITY_FEE_DISTRIBUTE: Liquidity fee received into general account  - TRANSFER_TYPE_BOND_LOW: Bond account funded from general account to meet required bond amount  - TRANSFER_TYPE_BOND_HIGH: Bond returned to general account after liquidity commitment was reduced  - TRANSFER_TYPE_WITHDRAW: Funds withdrawn from general account  - TRANSFER_TYPE_DEPOSIT: Funds deposited to general account  - TRANSFER_TYPE_BOND_SLASHING: Bond account penalised when liquidity commitment not met  - TRANSFER_TYPE_REWARD_PAYOUT: Reward payout received  - TRANSFER_TYPE_TRANSFER_FUNDS_SEND: Internal Vega network instruction for the collateral engine to move funds from a user's general account into the pending transfers pool  - TRANSFER_TYPE_TRANSFER_FUNDS_DISTRIBUTE: Internal Vega network instruction for the collateral engine to move funds from the pending transfers pool account into the destination account  - TRANSFER_TYPE_CLEAR_ACCOUNT: Market-related accounts emptied because market has closed  - TRANSFER_TYPE_CHECKPOINT_BALANCE_RESTORE: Balances restored after network restart
 * @export
 * @enum {string}
 */
export enum VegaTransferType {
  UNSPECIFIED = 'TRANSFER_TYPE_UNSPECIFIED' as any,
  LOSS = 'TRANSFER_TYPE_LOSS' as any,
  WIN = 'TRANSFER_TYPE_WIN' as any,
  MTMLOSS = 'TRANSFER_TYPE_MTM_LOSS' as any,
  MTMWIN = 'TRANSFER_TYPE_MTM_WIN' as any,
  MARGINLOW = 'TRANSFER_TYPE_MARGIN_LOW' as any,
  MARGINHIGH = 'TRANSFER_TYPE_MARGIN_HIGH' as any,
  MARGINCONFISCATED = 'TRANSFER_TYPE_MARGIN_CONFISCATED' as any,
  MAKERFEEPAY = 'TRANSFER_TYPE_MAKER_FEE_PAY' as any,
  MAKERFEERECEIVE = 'TRANSFER_TYPE_MAKER_FEE_RECEIVE' as any,
  INFRASTRUCTUREFEEPAY = 'TRANSFER_TYPE_INFRASTRUCTURE_FEE_PAY' as any,
  INFRASTRUCTUREFEEDISTRIBUTE = 'TRANSFER_TYPE_INFRASTRUCTURE_FEE_DISTRIBUTE' as any,
  LIQUIDITYFEEPAY = 'TRANSFER_TYPE_LIQUIDITY_FEE_PAY' as any,
  LIQUIDITYFEEDISTRIBUTE = 'TRANSFER_TYPE_LIQUIDITY_FEE_DISTRIBUTE' as any,
  BONDLOW = 'TRANSFER_TYPE_BOND_LOW' as any,
  BONDHIGH = 'TRANSFER_TYPE_BOND_HIGH' as any,
  WITHDRAW = 'TRANSFER_TYPE_WITHDRAW' as any,
  DEPOSIT = 'TRANSFER_TYPE_DEPOSIT' as any,
  BONDSLASHING = 'TRANSFER_TYPE_BOND_SLASHING' as any,
  REWARDPAYOUT = 'TRANSFER_TYPE_REWARD_PAYOUT' as any,
  TRANSFERFUNDSSEND = 'TRANSFER_TYPE_TRANSFER_FUNDS_SEND' as any,
  TRANSFERFUNDSDISTRIBUTE = 'TRANSFER_TYPE_TRANSFER_FUNDS_DISTRIBUTE' as any,
  CLEARACCOUNT = 'TRANSFER_TYPE_CLEAR_ACCOUNT' as any,
  CHECKPOINTBALANCERESTORE = 'TRANSFER_TYPE_CHECKPOINT_BALANCE_RESTORE' as any
}

/**
 *
 * @export
 * @interface VegaUpdateAsset
 */
export interface VegaUpdateAsset {
  /**
   * Asset ID the update is for.
   * @type {string}
   * @memberof VegaUpdateAsset
   */
  assetId?: string
  /**
   *
   * @type {VegaAssetDetailsUpdate}
   * @memberof VegaUpdateAsset
   */
  changes?: VegaAssetDetailsUpdate
}

/**
 *
 * @export
 * @interface VegaUpdateFutureProduct
 */
export interface VegaUpdateFutureProduct {
  /**
   *
   * @type {VegaDataSourceSpecToFutureBinding}
   * @memberof VegaUpdateFutureProduct
   */
  dataSourceSpecBinding?: VegaDataSourceSpecToFutureBinding
  /**
   *
   * @type {VegaDataSourceDefinition}
   * @memberof VegaUpdateFutureProduct
   */
  dataSourceSpecForSettlementData?: VegaDataSourceDefinition
  /**
   *
   * @type {VegaDataSourceDefinition}
   * @memberof VegaUpdateFutureProduct
   */
  dataSourceSpecForTradingTermination?: VegaDataSourceDefinition
  /**
   * Human-readable name/abbreviation of the quote name.
   * @type {string}
   * @memberof VegaUpdateFutureProduct
   */
  quoteName?: string
}

/**
 *
 * @export
 * @interface VegaUpdateInstrumentConfiguration
 */
export interface VegaUpdateInstrumentConfiguration {
  /**
   * Instrument code, human-readable shortcode used to describe the instrument.
   * @type {string}
   * @memberof VegaUpdateInstrumentConfiguration
   */
  code?: string
  /**
   *
   * @type {VegaUpdateFutureProduct}
   * @memberof VegaUpdateInstrumentConfiguration
   */
  future?: VegaUpdateFutureProduct
}

/**
 *
 * @export
 * @interface VegaUpdateMarket
 */
export interface VegaUpdateMarket {
  /**
   *
   * @type {VegaUpdateMarketConfiguration}
   * @memberof VegaUpdateMarket
   */
  changes?: VegaUpdateMarketConfiguration
  /**
   * Market ID the update is for.
   * @type {string}
   * @memberof VegaUpdateMarket
   */
  marketId?: string
}

/**
 *
 * @export
 * @interface VegaUpdateMarketConfiguration
 */
export interface VegaUpdateMarketConfiguration {
  /**
   *
   * @type {VegaUpdateInstrumentConfiguration}
   * @memberof VegaUpdateMarketConfiguration
   */
  instrument?: VegaUpdateInstrumentConfiguration
  /**
   * Linear slippage factor is used to cap the slippage component of maintenance margin - it is applied to the slippage volume.
   * @type {string}
   * @memberof VegaUpdateMarketConfiguration
   */
  linearSlippageFactor?: string
  /**
   *
   * @type {VegaLiquidityMonitoringParameters}
   * @memberof VegaUpdateMarketConfiguration
   */
  liquidityMonitoringParameters?: VegaLiquidityMonitoringParameters
  /**
   *
   * @type {VegaLogNormalRiskModel}
   * @memberof VegaUpdateMarketConfiguration
   */
  logNormal?: VegaLogNormalRiskModel
  /**
   * Percentage move up and down from the mid price which specifies the range of price levels over which automated liquidity provision orders will be deployed.
   * @type {string}
   * @memberof VegaUpdateMarketConfiguration
   */
  lpPriceRange?: string
  /**
   * Optional market metadata, tags.
   * @type {Array<string>}
   * @memberof VegaUpdateMarketConfiguration
   */
  metadata?: Array<string>
  /**
   *
   * @type {VegaPriceMonitoringParameters}
   * @memberof VegaUpdateMarketConfiguration
   */
  priceMonitoringParameters?: VegaPriceMonitoringParameters
  /**
   * Quadratic slippage factor is used to cap the slippage component of maintenance margin - it is applied to the square of the slippage volume.
   * @type {string}
   * @memberof VegaUpdateMarketConfiguration
   */
  quadraticSlippageFactor?: string
  /**
   *
   * @type {VegaSimpleModelParams}
   * @memberof VegaUpdateMarketConfiguration
   */
  simple?: VegaSimpleModelParams
}

/**
 *
 * @export
 * @interface VegaUpdateNetworkParameter
 */
export interface VegaUpdateNetworkParameter {
  /**
   *
   * @type {VegaNetworkParameter}
   * @memberof VegaUpdateNetworkParameter
   */
  changes?: VegaNetworkParameter
}

/**
 *
 * @export
 * @interface VegaVote
 */
export interface VegaVote {
  /**
   * Voter's party ID.
   * @type {string}
   * @memberof VegaVote
   */
  partyId?: string
  /**
   * Proposal ID being voted on.
   * @type {string}
   * @memberof VegaVote
   */
  proposalId?: string
  /**
   * Vote timestamp for date and time as Unix time in nanoseconds when vote was submitted to the network.
   * @type {string}
   * @memberof VegaVote
   */
  timestamp?: string
  /**
   * The weight of the vote compared to the total amount of equity-like share on the market.
   * @type {string}
   * @memberof VegaVote
   */
  totalEquityLikeShareWeight?: string
  /**
   * Total number of governance token for the party that cast the vote.
   * @type {string}
   * @memberof VegaVote
   */
  totalGovernanceTokenBalance?: string
  /**
   * The weight of this vote based on the total number of governance tokens.
   * @type {string}
   * @memberof VegaVote
   */
  totalGovernanceTokenWeight?: string
  /**
   *
   * @type {VegaVoteValue}
   * @memberof VegaVote
   */
  value?: VegaVoteValue
}

/**
 * - VALUE_UNSPECIFIED: Default value, always invalid  - VALUE_NO: Vote against the proposal  - VALUE_YES: Vote in favour of the proposal
 * @export
 * @enum {string}
 */
export enum VegaVoteValue {
  UNSPECIFIED = 'VALUE_UNSPECIFIED' as any,
  NO = 'VALUE_NO' as any,
  YES = 'VALUE_YES' as any
}

/**
 *
 * @export
 * @interface VegaWithdrawExt
 */
export interface VegaWithdrawExt {
  /**
   *
   * @type {VegaErc20WithdrawExt}
   * @memberof VegaWithdrawExt
   */
  erc20?: VegaErc20WithdrawExt
}

/**
 *
 * @export
 * @interface VegaWithdrawal
 */
export interface VegaWithdrawal {
  /**
   * Amount to be withdrawn. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  amount?: string
  /**
   * Asset to withdraw funds from.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  asset?: string
  /**
   * Timestamp for when the network started to process this withdrawal.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  createdTimestamp?: string
  /**
   *
   * @type {VegaWithdrawExt}
   * @memberof VegaWithdrawal
   */
  ext?: VegaWithdrawExt
  /**
   * Unique ID for the withdrawal.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  id?: string
  /**
   * Unique party ID of the user initiating the withdrawal.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  partyId?: string
  /**
   * Reference which is used by the foreign chain to refer to this withdrawal.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  ref?: string
  /**
   *
   * @type {VegaWithdrawalStatus}
   * @memberof VegaWithdrawal
   */
  status?: VegaWithdrawalStatus
  /**
   * Hash of the foreign chain for this transaction.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  txHash?: string
  /**
   * Timestamp for when the withdrawal was finalised by the network.
   * @type {string}
   * @memberof VegaWithdrawal
   */
  withdrawnTimestamp?: string
}

/**
 * - STATUS_UNSPECIFIED: Default value, always invalid  - STATUS_OPEN: Withdrawal is open and being processed by the network  - STATUS_REJECTED: Withdrawal have been cancelled  - STATUS_FINALIZED: Withdrawal went through and is fully finalised, the funds are removed from the Vega network and are unlocked on the foreign chain bridge, for example, on the Ethereum network
 * @export
 * @enum {string}
 */
export enum VegaWithdrawalStatus {
  UNSPECIFIED = 'STATUS_UNSPECIFIED' as any,
  OPEN = 'STATUS_OPEN' as any,
  REJECTED = 'STATUS_REJECTED' as any,
  FINALIZED = 'STATUS_FINALIZED' as any
}

/**
 *
 * @export
 * @interface Vegacommandsv1OneOffTransfer
 */
export interface Vegacommandsv1OneOffTransfer {
  /**
   * Unix timestamp in nanoseconds. Time at which the transfer should be delivered into the To account.
   * @type {string}
   * @memberof Vegacommandsv1OneOffTransfer
   */
  deliverOn?: string
}

/**
 *
 * @export
 * @interface Vegacommandsv1RecurringTransfer
 */
export interface Vegacommandsv1RecurringTransfer {
  /**
   *
   * @type {VegaDispatchStrategy}
   * @memberof Vegacommandsv1RecurringTransfer
   */
  dispatchStrategy?: VegaDispatchStrategy
  /**
   * Last epoch at which this transfer shall be paid.
   * @type {string}
   * @memberof Vegacommandsv1RecurringTransfer
   */
  endEpoch?: string
  /**
   * Factor needs to be > 0.
   * @type {string}
   * @memberof Vegacommandsv1RecurringTransfer
   */
  factor?: string
  /**
   * First epoch from which this transfer shall be paid.
   * @type {string}
   * @memberof Vegacommandsv1RecurringTransfer
   */
  startEpoch?: string
}

/**
 *
 * @export
 * @interface Vegacommandsv1Transfer
 */
export interface Vegacommandsv1Transfer {
  /**
   * Amount to be taken from the source account. This field is an unsigned integer scaled to the asset's decimal places.
   * @type {string}
   * @memberof Vegacommandsv1Transfer
   */
  amount?: string
  /**
   * Asset ID of the asset to be transferred.
   * @type {string}
   * @memberof Vegacommandsv1Transfer
   */
  asset?: string
  /**
   *
   * @type {VegaAccountType}
   * @memberof Vegacommandsv1Transfer
   */
  fromAccountType?: VegaAccountType
  /**
   *
   * @type {Vegacommandsv1OneOffTransfer}
   * @memberof Vegacommandsv1Transfer
   */
  oneOff?: Vegacommandsv1OneOffTransfer
  /**
   *
   * @type {Vegacommandsv1RecurringTransfer}
   * @memberof Vegacommandsv1Transfer
   */
  recurring?: Vegacommandsv1RecurringTransfer
  /**
   * Reference to be attached to the transfer.
   * @type {string}
   * @memberof Vegacommandsv1Transfer
   */
  reference?: string
  /**
   * Public key of the destination account.
   * @type {string}
   * @memberof Vegacommandsv1Transfer
   */
  to?: string
  /**
   *
   * @type {VegaAccountType}
   * @memberof Vegacommandsv1Transfer
   */
  toAccountType?: VegaAccountType
}

/**
 *
 * @export
 * @interface Vegaeventsv1OneOffTransfer
 */
export interface Vegaeventsv1OneOffTransfer {
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1OneOffTransfer
   */
  deliverOn?: string
}

/**
 *
 * @export
 * @interface Vegaeventsv1RecurringTransfer
 */
export interface Vegaeventsv1RecurringTransfer {
  /**
   *
   * @type {VegaDispatchStrategy}
   * @memberof Vegaeventsv1RecurringTransfer
   */
  dispatchStrategy?: VegaDispatchStrategy
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1RecurringTransfer
   */
  endEpoch?: string
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1RecurringTransfer
   */
  factor?: string
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1RecurringTransfer
   */
  startEpoch?: string
}

/**
 *
 * @export
 * @interface Vegaeventsv1Transfer
 */
export interface Vegaeventsv1Transfer {
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  amount?: string
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  asset?: string
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  from?: string
  /**
   *
   * @type {VegaAccountType}
   * @memberof Vegaeventsv1Transfer
   */
  fromAccountType?: VegaAccountType
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  id?: string
  /**
   *
   * @type {Vegaeventsv1OneOffTransfer}
   * @memberof Vegaeventsv1Transfer
   */
  oneOff?: Vegaeventsv1OneOffTransfer
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  reason?: string
  /**
   *
   * @type {Vegaeventsv1RecurringTransfer}
   * @memberof Vegaeventsv1Transfer
   */
  recurring?: Vegaeventsv1RecurringTransfer
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  reference?: string
  /**
   *
   * @type {V1TransferStatus}
   * @memberof Vegaeventsv1Transfer
   */
  status?: V1TransferStatus
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  timestamp?: string
  /**
   *
   * @type {string}
   * @memberof Vegaeventsv1Transfer
   */
  to?: string
  /**
   *
   * @type {VegaAccountType}
   * @memberof Vegaeventsv1Transfer
   */
  toAccountType?: VegaAccountType
}
