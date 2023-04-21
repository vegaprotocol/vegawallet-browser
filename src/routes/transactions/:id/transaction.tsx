import { ListItem } from "../../../components/list";
import { TransactionStatus } from "../../../components/transaction-status";
import {
  TRANSACTION_TITLES,
  Transaction,
  TransactionKeys,
} from "../../../lib/transactions";
import {
  AnchorButton,
  CopyWithTooltip,
  ExternalLink,
  Notification,
  truncateMiddle,
  Intent,
} from "@vegaprotocol/ui-toolkit";
import { formatDate } from "../../../lib/date";
import type { ReactNode } from "react";
import { CodeWindow } from "../../../components/code-window";
import { Copy } from "../../../components/icons/copy";
import { CollapsiblePanel } from "../../../components/collapsible-panel";
import { useParams } from "react-router-dom";
import { TransactionNotFound } from "./transaction-not-found";
import { Page } from "../../../components/page";
import { TransactionStatus as TxStatus } from "../../../lib/transactions";

const TransactionDetailsItem = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  return (
    <div>
      <div className="text-dark-300 uppercase">{title}</div>
      <div>{children}</div>
    </div>
  );
};

export const TransactionDetails = ({
  transaction,
}: {
  transaction: Transaction;
}) => {
  const explorerUrl = process.env["REACT_APP_EXPLORER_URL"];
  const { signature, txHash } = transaction;
  return (
    <Page name={TRANSACTION_TITLES[transaction.type]} back={true}>
      <>
        <TransactionStatus transaction={transaction} />
        <ul>
          <ListItem
            data-testid="transaction-wallet-name"
            item={transaction}
            renderItem={(transaction) => (
              <TransactionDetailsItem title="Wallet">
                {transaction.wallet}
              </TransactionDetailsItem>
            )}
          />
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <TransactionDetailsItem title="Wallet">
                <ExternalLink
                  className="uppercase"
                  href={`${explorerUrl}/parties/${transaction.publicKey}`}
                >
                  {truncateMiddle(transaction.publicKey)}
                </ExternalLink>
              </TransactionDetailsItem>
            )}
          />
          {transaction.blockHeight && (
            <ListItem
              data-testid="transaction-wallet-name"
              item={transaction}
              renderItem={(transaction) => (
                <TransactionDetailsItem title="Wallet">
                  {transaction.wallet}
                </TransactionDetailsItem>
              )}
            />
          )}
          {transaction.blockHeight && (
            <ListItem
              item={transaction}
              renderItem={(transaction) => (
                <TransactionDetailsItem title="Block height">
                  <ExternalLink
                    className="underline"
                    href={`${explorerUrl}/block/${transaction.blockHeight}`}
                  >
                    {transaction.blockHeight?.toString()}
                  </ExternalLink>
                </TransactionDetailsItem>
              )}
            />
          )}
          {signature ? (
            <ListItem
              item={transaction}
              renderItem={(transaction) => (
                <TransactionDetailsItem title="Signature">
                  <CopyWithTooltip text={signature}>
                    <span>
                      <span>{truncateMiddle(signature)}</span>
                      <Copy className="w-3 ml-1" />
                    </span>
                  </CopyWithTooltip>
                </TransactionDetailsItem>
              )}
            />
          ) : null}
          {transaction.error && (
            <ListItem
              item={transaction}
              renderItem={(transaction) => (
                <TransactionDetailsItem title="Error">
                  <div className="mt-2">
                    <Notification
                      intent={Intent.Danger}
                      message={transaction.error}
                    />
                  </div>
                </TransactionDetailsItem>
              )}
            />
          )}
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <CollapsiblePanel
                title="Details"
                initiallyOpen={true}
                panelContent={
                  <CodeWindow
                    content={JSON.stringify(transaction.payload, null, 2)}
                    text={JSON.stringify(transaction.payload)}
                  />
                }
              />
            )}
          />
          <ListItem
            item={transaction}
            renderItem={(transaction) => (
              <TransactionDetailsItem title="Received At">
                {formatDate(transaction.receivedAt)}
              </TransactionDetailsItem>
            )}
          />
          {txHash ? (
            <ListItem
              item={transaction}
              renderItem={(transaction) => (
                <TransactionDetailsItem title="Transaction hash">
                  <ExternalLink href={`${explorerUrl}/txs/${txHash}`}>
                    {truncateMiddle(txHash)}
                  </ExternalLink>
                </TransactionDetailsItem>
              )}
            />
          ) : null}
        </ul>
        {transaction.txHash && (
          <div className="mt-6 flex justify-center">
            <AnchorButton href={`${explorerUrl}/txs/${transaction.txHash}`}>
              View on block explorer
            </AnchorButton>
          </div>
        )}
      </>
    </Page>
  );
};

export const TransactionPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <TransactionNotFound />;
  }
  const transaction = {
    id: "2",
    type: TransactionKeys.ORDER_SUBMISSION,
    hostname: "vega.xyz",
    wallet: "Wallet 1",
    publicKey:
      "c1d9b39e5148b14d694020572cb591a8af971b9c5a4a185f3afa47bd9247c0da",
    payload: {},
    status: TxStatus.REJECTED,
    receivedAt: new Date(),
    logs: [{ type: "info", message: "Withdrawal submitted to the network" }],
    txHash: "9BD4215DCDA4DC87F05305BBEF2544261771E9BC2986F78D96B86FD03ACAD4C0",
    blockHeight: undefined,
    signature: undefined,
    error: undefined,
  };
  if (!transaction) {
    return <TransactionNotFound />;
  }
  return <TransactionDetails transaction={transaction} />;
};
