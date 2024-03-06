import { FormEvent, useState } from "react";

export function ConnectWallet({
  onConnected,
}: Readonly<{
  onConnected: (value: boolean) => void;
}>) {
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState(false);
  const handleConnection = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      await window.vega.connectWallet();
      onConnected(true);
    } catch (e) {
      console.error(e);
      onConnected(false);
      setError((e as unknown as Error).toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleConnection}>
      <button type="submit" disabled={loading} id="connect">
        Connect Wallet
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
