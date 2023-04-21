import {
  Button,
  Dialog,
  Indicator,
  Intent,
  Notification,
} from "@vegaprotocol/ui-toolkit";
import { useState } from "react";
import { Cross } from "../icons/cross";
import { List } from "../list";
import { HostImage } from "../host-image";

export interface Connection {
  hostname: string;
}

const ConnectionsList = ({
  connections,
  removeConnection,
}: {
  connections: Connection[];
  removeConnection: (connection: Connection) => void;
}) => {
  return (
    <>
      <p>Your wallet is connected to these dapps.</p>
      <List<Connection>
        idProp="hostname"
        items={connections}
        renderItem={(i) => (
          <div className="flex justify-between">
            <div className="flex">
              <div className="flex flex-col justify-center">
                <HostImage size={6} hostname={i.hostname} />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                {i.hostname}
              </div>
            </div>
            <button onClick={() => removeConnection(i)}>
              <Cross className="w-8 h-8" />
            </button>
          </div>
        )}
      />
      <Notification
        intent={Intent.None}
        message="Trying to connect to a Vega dapp? Look for the 'Connect Wallet' button and press it to create a connection."
      />
    </>
  );
};

const NoAppsConnected = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p>Your wallet is not connected to any dapps.</p>
      <Notification
        intent={Intent.None}
        message="Trying to connect to a Vega dapp? Look for the 'Connect Wallet' button and press it to create a connection."
      />
    </div>
  );
};

export const ConnectedDialog = () => {
  const [dialog, setDialogOpen] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([
    { hostname: "https://www.google.com" },
    { hostname: "https://www.facebook.com" },
  ]);
  return (
    <>
      <Button size="sm" onClick={() => setDialogOpen(true)}>
        <span className="mr-2">Connected</span>
        <Indicator
          variant={connections.length ? Intent.Success : Intent.None}
        />
      </Button>
      <Dialog open={dialog}>
        <section className="flex justify-between">
          <h1>Connected dApps</h1>
          <button onClick={() => setDialogOpen(false)}>
            <Cross className="w-8 h-8" />
          </button>
        </section>
        {connections.length === 0 ? (
          <NoAppsConnected />
        ) : (
          <ConnectionsList
            connections={connections}
            removeConnection={(c) =>
              setConnections(connections.filter((con) => con !== c))
            }
          />
        )}
      </Dialog>
    </>
  );
};
