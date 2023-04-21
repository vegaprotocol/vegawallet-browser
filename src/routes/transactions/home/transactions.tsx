import { List } from "../../../components/list";
import { formatDate } from "../../../lib/date";
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Page } from "../../../components/page";
import { truncateMiddle } from "@vegaprotocol/ui-toolkit";
import {
  TRANSACTION_TITLES,
  Transaction,
  TransactionKeys,
  TransactionStatus as TxStatus,
} from "../../../lib/transactions";
import { TransactionStatus } from "../../../components/transaction-status";
import { FULL_ROUTES } from "../..";

export const TransactionHome = ({
  transactions,
}: {
  transactions: Transaction[];
}) => {
  return (
    <Page name="Transactions">
      <List
        clickable={true}
        empty={
          <p data-testid="transactions-empty" className="pt-8">
            You have no transactions this session.
          </p>
        }
        items={transactions}
        idProp="id"
        renderItem={(transaction) => (
          <NavLink
            to={{ pathname: `${FULL_ROUTES.transactions}/${transaction.id}` }}
          >
            <div data-testid="transactions-transaction">
              <TransactionStatus transaction={transaction} />
              <div className="flex justify-between">
                <div data-testid="transactions-type" className="text-lg">
                  {TRANSACTION_TITLES[transaction.type]}
                </div>
                <div data-testid="transactions-hash">
                  {transaction.txHash
                    ? truncateMiddle(transaction.txHash)
                    : null}
                </div>
              </div>
              <div className="flex justify-between text-dark-400">
                <div data-testid="transactions-sender">
                  {transaction.wallet}, {truncateMiddle(transaction.publicKey)}
                </div>
                <div data-testid="transactions-date">
                  {formatDate(transaction.receivedAt)}
                </div>
              </div>
            </div>
          </NavLink>
        )}
      />
    </Page>
  );
};

export const TransactionHomePage = () => {
  const transactions = useMemo(() => {
    return [
      {
        id: "1",
        type: TransactionKeys.ORDER_SUBMISSION,
        hostname: "vega.xyz",
        wallet: "Wallet 1",
        publicKey:
          "c1d9b39e5148b14d694020572cb591a8af971b9c5a4a185f3afa47bd9247c0da",
        payload: {},
        status: TxStatus.APPROVED,
        receivedAt: new Date(),
        logs: [
          { type: "info", message: "Withdrawal submitted to the network" },
        ],
        txHash: undefined,
        blockHeight: undefined,
        signature: undefined,
        error: undefined,
      },
      {
        id: "2",
        type: TransactionKeys.ORDER_SUBMISSION,
        hostname: "vega.xyz",
        wallet: "Wallet 1",
        publicKey:
          "c1d9b39e5148b14d694020572cb591a8af971b9c5a4a185f3afa47bd9247c0da",
        payload: {},
        status: TxStatus.REJECTED,
        receivedAt: new Date(),
        logs: [
          { type: "info", message: "Withdrawal submitted to the network" },
        ],
        txHash:
          "9BD4215DCDA4DC87F05305BBEF2544261771E9BC2986F78D96B86FD03ACAD4C0",
        blockHeight: undefined,
        signature: undefined,
        error: undefined,
      },
    ];
  }, []);
  return <TransactionHome transactions={transactions} />;
};
