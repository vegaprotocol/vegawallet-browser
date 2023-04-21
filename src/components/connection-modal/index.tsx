import { Button } from "@vegaprotocol/ui-toolkit";
import { Frame } from "../frame";
import { Tick } from "../icons/tick";
import { Splash } from "../splash";
import { ModalHeader } from "../modal-header";
import { useCallback, useState } from "react";

import { useEffect } from "react";
import { useModalStore } from "../../lib/modal-store";

type InteractionSuccessProps = {
  onClose: () => void;
};

export const ConnectionSuccess = ({ onClose }: InteractionSuccessProps) => {
  useEffect(() => {
    const stamp = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(stamp);
  }, [onClose]);

  return (
    <div
      data-testid="interaction-success"
      className="bg-vega-green-550 w-full h-full flex flex-col py-24 px-5 justify-center items-center"
    >
      <h1 className="text-3xl text-center mb-4">Connected</h1>
      <div className="border border-white rounded-sm p-4">
        <Tick className="w-12" />
      </div>
    </div>
  );
};

const ConnectScreen = ({
  handleDecision,
  isLoading,
}: {
  handleDecision: (decision: boolean) => void;
  isLoading: boolean;
}) => {
  const hostname = "https://www.google.com";
  return (
    <div data-testid="dapp-connect-modal">
      <ModalHeader hostname={hostname} title="Connected to dApp" />
      <Frame>
        <p className="mb-3" data-testid="dapp-connect-access-list-title">
          Allow this site to:
        </p>
        <ul className="list-none">
          <li className="flex">
            <Tick className="w-3 mr-2 text-vega-green-550" />
            <p
              data-testid="dapp-connect-access-list-access"
              className="text-light-200"
            >
              Request access to your key(s)
            </p>
          </li>
          <li className="flex">
            <Tick className="w-3 mr-2 text-vega-green-550" />
            <p
              data-testid="dapp-connect-access-list-access"
              className="text-light-200"
            >
              Send transaction requests for you to sign
            </p>
          </li>
        </ul>
      </Frame>
      <div className="grid grid-cols-[1fr_1fr] justify-between gap-4 mt-5">
        <Button
          data-testid="dapp-connect-deny-button"
          disabled={!!isLoading}
          onClick={() => handleDecision(false)}
        >
          Deny
        </Button>
        <Button
          data-testid="dapp-connect-approve-button"
          variant="primary"
          disabled={!!isLoading}
          onClick={() => handleDecision(true)}
        >
          Approve
        </Button>
      </div>
    </div>
  );
};

export const ConnectionModal = () => {
  const { isOpen, setIsOpen } = useModalStore((store) => ({
    isOpen: store.connectionModalOpen,
    setIsOpen: store.setConnectionModalOpen,
  }));
  const [hasConnected, setHasConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleDecision = useCallback((decision: boolean) => {
    if (decision) {
      setIsLoading(true);
      setHasConnected(true);
    }
  }, []);

  if (!isOpen) return null;
  return (
    <Splash>
      {hasConnected ? (
        <ConnectionSuccess
          onClose={() => {
            setHasConnected(false);
            setIsOpen(false);
          }}
        />
      ) : (
        <ConnectScreen isLoading={isLoading} handleDecision={handleDecision} />
      )}
    </Splash>
  );
};
