import { useMemo } from "react";
import JSONRPCClient from "../../lib/json-rpc-client";
import { JsonRpcContext } from "./json-rpc-context";
import { useLogger } from "@vegaprotocol/react-helpers";
import JSONRPCServer from "../../lib/json-rpc-server";

const createServer = (logger: ReturnType<typeof useLogger>) => {
  return new JSONRPCServer({
    methods: {
      showTransactionModal() {
        console.log("showTransactionModal");
      },
      requestConnection() {
        console.log("showTransactionModal");
      },
    },
    onerror: (...args) => {
      logger.error(...args);
    },
  });
};

const createClient = (logger: ReturnType<typeof useLogger>) => {
  // @ts-ignore
  const runtime = globalThis.browser?.runtime ?? globalThis.chrome?.runtime;

  const backgroundPort = runtime.connect({ name: "popup" });

  const background = new JSONRPCClient({
    send(msg: any) {
      // TODO change this to debug when https://github.com/vegaprotocol/frontend-monorepo/pull/3474 is merged
      logger.info("Sending message to background", msg);
      backgroundPort.postMessage(msg);
    },
  });
  backgroundPort.onMessage.addListener((res: any) => {
    // TODO change this to debug when https://github.com/vegaprotocol/frontend-monorepo/pull/3474 is merged
    logger.info("Received message from background", res);
    background.onmessage(res);
  });
  return background;
};

/**
 * Provides Vega Ethereum contract instances to its children.
 */
export const JsonRPCProvider = ({ children }: { children: JSX.Element }) => {
  const clientLogger = useLogger({
    application: "Vega Wallet",
    tags: ["global", "json-rpc-client"],
  });
  const serverLogger = useLogger({
    application: "Vega Wallet",
    tags: ["global", "json-rpc-server"],
  });
  const client = useMemo(() => createClient(clientLogger), [clientLogger]);
  const server = useMemo(() => createServer(serverLogger), [serverLogger]);
  return (
    <JsonRpcContext.Provider
      value={{
        client,
      }}
    >
      {children}
    </JsonRpcContext.Provider>
  );
};
