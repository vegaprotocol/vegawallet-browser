import { Button } from "@vegaprotocol/ui-toolkit";
import { Page } from "../../components/page";
import { useForm } from "react-hook-form";
import { useCallback } from "react";
import { Checkbox } from "../../components/checkbox";
import packageJson from "../../../package.json";

interface FormFields {
  telemetry: boolean;
}

export const Settings = () => {
  const { control, handleSubmit } = useForm<FormFields>();
  const submit = useCallback((fields: { telemetry: boolean }) => {
    console.log(fields.telemetry);
  }, []);
  return (
    <Page name="Settings">
      <>
        <form onSubmit={handleSubmit(submit)}>
          <Checkbox
            name="telemetry"
            label="Enable bug reporting"
            control={control}
          />
          <Button fill={true} className="mt-2" variant="primary" type="submit">
            Save
          </Button>
        </form>
        <div className="flex justify-between mt-4">
          <div>Version:</div>
          <div>{packageJson.version}</div>
        </div>
      </>
    </Page>
  );
};
