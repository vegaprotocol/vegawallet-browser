import { Button, ExternalLink } from "@vegaprotocol/ui-toolkit";
import { Page } from "../../../components/page";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FULL_ROUTES } from "../..";

export const Telemetry = () => {
  const { handleSubmit } = useForm<{}>();
  const navigate = useNavigate();
  const submit = useCallback(() => {
    navigate(FULL_ROUTES.wallets);
  }, [navigate]);

  return (
    <Page name="Telemetry" back>
      <>
        <p>Improve Vega Wallet by automatically reporting bugs and crashes.</p>
        <ul className="list-disc mb-4 mt-4">
          <li>Your identity and keys will remain anonymous</li>
          <li>You can change this anytime via settings</li>
        </ul>
        <ExternalLink href="https://vega.xyz/privacy">
          Read more in our privacy policy
        </ExternalLink>
        <form
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-[1fr_1fr] justify-between gap-4 mt-5"
        >
          <Button type="submit">No thanks</Button>
          <Button type="submit" variant="primary">
            Report bugs and crashes
          </Button>
        </form>
      </>
    </Page>
  );
};
