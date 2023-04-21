import { create } from "zustand";
import JSONRPCClient from "../../lib/json-rpc-client";

export interface Wallet {
  name: string;
  keys: Key[];
}

export interface Key {
  index: number;
  metadata: Metadata[];
  name: string;
  publicKey: string;
}

export interface Metadata {
  key: string;
  value: string;
}

export type WalletsStore = {
  wallets: Wallet[];
  loading: boolean;
  error: Error | null;
  loadWallets: (client: JSONRPCClient) => void;
};

export const useWalletStore = create<WalletsStore>()((set, get) => ({
  wallets: [],
  loading: true,
  error: null,
  loadWallets: async (client: JSONRPCClient) => {
    try {
      set({ loading: true });
      const { wallets } = await client.request("admin.list_wallets", null);
      const res = await Promise.all(
        wallets.map(async (w: string) => {
          const { keys } = await client.request("admin.list_keys", {
            wallet: w,
            passphrase: "",
          });
          return { name: w, keys };
        })
      );
      set({ wallets: res });
    } catch (e) {
      set({ error: new Error(e?.toString()) });
    } finally {
      set({ loading: false });
    }
  },
}));
