import {
  Button,
  FormGroup,
  Input,
  InputError,
  Intent,
  Notification,
} from "@vegaprotocol/ui-toolkit";
import { Page } from "../../../components/page";
import { useForm, useWatch } from "react-hook-form";
import { Validation } from "../../../lib/form-validation";
import { useCallback, useEffect } from "react";
import { Checkbox } from "../../../components/checkbox";
import { useNavigate } from "react-router-dom";
import { FULL_ROUTES } from "../..";

interface FormFields {
  passphrase: string;
  confirmPassphrase: string;
  acceptedTerms: boolean;
}

export const CreatePassword = () => {
  const {
    control,
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormFields>();
  const navigate = useNavigate();
  const passphrase = useWatch({ control, name: "passphrase" });
  const acceptedTerms = useWatch({ control, name: "acceptedTerms" });
  const submit = useCallback(
    (fields: { confirmPassphrase: string; passphrase: string }) => {
      console.log(passphrase);
      navigate(FULL_ROUTES.saveMnemonic);
    },
    [navigate, passphrase]
  );

  useEffect(() => {
    setFocus("passphrase");
  }, [setFocus]);

  return (
    <Page name="Create Password" back>
      <>
        <p>
          Set a password to unlock your Vega Wallets on this device. Your
          password can't be used to recover your wallet.
        </p>
        <form onSubmit={handleSubmit(submit)}>
          <FormGroup label="Password" labelFor="passphrase">
            <Input
              data-testid="create-wallet-form-passphrase"
              type="password"
              {...register("passphrase", { required: Validation.REQUIRED })}
            />
            {errors.passphrase?.message && (
              <InputError forInput="passphrase">
                {errors.passphrase.message}
              </InputError>
            )}
          </FormGroup>
          <FormGroup label="Confirm passphrase" labelFor="confirmPassphrase">
            <Input
              data-testid="create-wallet-form-passphrase-confirm"
              type="password"
              {...register("confirmPassphrase", {
                required: Validation.REQUIRED,
                pattern: Validation.match(passphrase),
              })}
            />
            {errors.confirmPassphrase?.message && (
              <InputError forInput="confirmPassphrase">
                {errors.confirmPassphrase.message}
              </InputError>
            )}
          </FormGroup>
          <Notification
            intent={Intent.Warning}
            message="Please note that Vega Wallet cannot recover this password if I lose it"
          />
          <Checkbox
            name="acceptedTerms"
            label="I understand and wish to proceed"
            control={control}
          />
          <Button
            fill={true}
            className="mt-2"
            variant="primary"
            type="submit"
            disabled={
              Boolean(errors.confirmPassphrase?.message) || !acceptedTerms
            }
          >
            Submit
          </Button>
        </form>
      </>
    </Page>
  );
};
