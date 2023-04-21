import { useForm, useWatch } from "react-hook-form";
import { Page } from "../../components/page";
import { Button, FormGroup, Input, InputError } from "@vegaprotocol/ui-toolkit";
import { Validation } from "../../lib/form-validation";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FULL_ROUTES } from "..";

interface FormFields {
  passphrase: string;
}

export const Login = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const navigate = useNavigate();
  const passphrase = useWatch({ control, name: "passphrase" });
  const submit = useCallback(
    (fields: { passphrase: string }) => {
      console.log(passphrase);
      navigate(FULL_ROUTES.wallets);
    },
    [navigate, passphrase]
  );
  return (
    <Page name="Login">
      <form onSubmit={handleSubmit(submit)}>
        <FormGroup label="Confirm password" labelFor="confirmPassphrase">
          <Input
            data-testid="create-wallet-form-passphrase-confirm"
            type="password"
            {...register("passphrase", {
              required: Validation.REQUIRED,
            })}
          />
          {errors.passphrase?.message && (
            <InputError forInput="passphrase">
              {errors.passphrase.message}
            </InputError>
          )}
        </FormGroup>
        <Button
          fill={true}
          className="mt-2"
          variant="primary"
          type="submit"
          disabled={!Boolean(passphrase)}
        >
          Login
        </Button>
      </form>
    </Page>
  );
};
