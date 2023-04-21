import {
  ButtonLink,
  ExternalLink,
  truncateMiddle,
} from "@vegaprotocol/ui-toolkit";
import { Page } from "../../components/page";
import { CopyWithCheckmark } from "../../components/copy-with-check";
import { ConnectedDialog } from "../../components/connections-modal";
import { useEffect } from "react";
import { useJsonRpcClient } from "../../contexts/json-rpc/json-rpc-context";
import { useWalletStore } from "./store";

const KeyIcon = ({ publicKey }: { publicKey: string }) => {
  return (
    <div className="inline-grid grid-cols-3 gap-0 w-6 mr-4">
      {publicKey
        .match(/.{6}/g)
        ?.slice(0, 9)
        .map((c) => (
          <div className="w-2 h-2" style={{ backgroundColor: `#${c}` }} />
        ))}
    </div>
  );
};

export const Wallets = () => {
  const { client } = useJsonRpcClient();
  const { wallets, loadWallets, loading, error } = useWalletStore((store) => ({
    wallets: store.wallets,
    loadWallets: store.loadWallets,
    loading: store.loading,
    error: store.error,
  }));
  useEffect(() => {
    loadWallets(client);
  }, [client, loadWallets]);
  const [wallet] = wallets;

  if (loading) return null;
  // TODO make this better
  if (error) return <span>{error.toString()}</span>;

  return (
    <Page name="Wallets">
      <>
        <div className="flex justify-between">
          <h1 className="flex justify-center flex-col text-xl">
            {wallet.name} keys
          </h1>
          <ConnectedDialog />
        </div>
        <ul>
          {wallet.keys.map((k) => (
            <li className="flex flex-col justify-center">
              <div>{k.name}</div>
              <div className="flex">
                <KeyIcon publicKey={k.publicKey} />
                <div>
                  <CopyWithCheckmark text={k.publicKey}>
                    {truncateMiddle(k.publicKey)}
                  </CopyWithCheckmark>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <ButtonLink>Create new key/pair</ButtonLink>
        <section>
          <h1 className="text-xl">Assets</h1>
          <ExternalLink
            className="w-full break-word"
            href={process.env["REACT_APP_DEPOSIT_LINK"]}
          >
            Manage your assets directly in a Vega dapp.
          </ExternalLink>
        </section>
      </>
    </Page>
  );
};
