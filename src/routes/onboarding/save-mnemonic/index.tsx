import { useCallback, useState } from "react";
import { CodeWindow } from "../../../components/code-window";
import { Page } from "../../../components/page";
import { Button, Intent, Notification } from "@vegaprotocol/ui-toolkit";
import { Checkbox } from "../../../components/checkbox";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FULL_ROUTES } from "../..";

interface FormFields {
  acceptedTerms: boolean;
}

export const SaveMnemonic = () => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<FormFields>();
  const [mnemonic] = useState<string[]>([
    "symptomatic",
    "hissing",
    "hill",
    "ugly",
    "lavish",
    "possessive",
    "suck",
    "anger",
    "circle",
    "neighborly",
    "unit",
    "wait",
    "matter",
    "incandescent",
    "null",
    "borrow",
    "classy",
    "quiet",
    "branch",
    "awake",
    "responsible",
    "meeting",
    "religion",
    "tremble",
  ]);
  const acceptedTerms = useWatch({ control, name: "acceptedTerms" });

  const chunkedMnemonic = [
    mnemonic.slice(0, 4).join(" "),
    mnemonic.slice(4, 8).join(" "),
    mnemonic.slice(8, 12).join(" "),
    mnemonic.slice(12, 16).join(" "),
    mnemonic.slice(16, 20).join(" "),
    mnemonic.slice(20, 24).join(" "),
  ];
  const submit = useCallback(() => {
    navigate(FULL_ROUTES.telemetry);
  }, [navigate]);
  return (
    <Page name="Secure your wallet">
      <>
        <p>
          Write down or save this recovery phrase to a safe place. You'll need
          it to recover your wallet. Never share your recovery phrase with
          anyone else.
        </p>
        <CodeWindow
          text={mnemonic.join(" ")}
          content={chunkedMnemonic.join("\n")}
        />
        <div className="mt-4" />
        <Notification
          intent={Intent.Danger}
          message="I understand that if I lose my recovery phrase, I will lose access to my crypto. There is no way for Vega Wallet to recover it for me."
        />
        <form onSubmit={handleSubmit(submit)}>
          <Checkbox
            name="acceptedTerms"
            label="I understand and wish to proceed"
            control={control}
          />
          <Button
            fill={true}
            type="submit"
            variant="primary"
            className="mt-2"
            disabled={!Boolean(acceptedTerms)}
          >
            Continue
          </Button>
        </form>
      </>
    </Page>
  );
};
