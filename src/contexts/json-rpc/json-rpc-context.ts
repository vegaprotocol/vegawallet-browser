import React from "react";
import JSONRPCClient from "../../lib/json-rpc-client";

export interface JsonRpcContextShape {
  client: JSONRPCClient;
}

export const JsonRpcContext = React.createContext<
  JsonRpcContextShape | undefined
>(undefined);

export function useJsonRpcClient() {
  const context = React.useContext(JsonRpcContext);
  if (context === undefined) {
    throw new Error("useJsonRpcClient must be used within JsonRPCProvider");
  }
  return context;
}
