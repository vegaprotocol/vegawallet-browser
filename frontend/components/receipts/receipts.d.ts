export type ReceiptComponentProps = { transaction: any }
export type TransactionComponent = (props: ReceiptComponentProps) => JSX.Element | null
export type ReceiptMap = { [key in TransactionKeys]: TransactionComponent }
