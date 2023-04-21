import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { ReactNode } from "react";
import type { Control, Path, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Tick } from "../icons/tick";

type CheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: ReactNode;
  disabled?: boolean;
};

export function Checkbox<T extends FieldValues>({
  name,
  control,
  label,
  disabled,
}: CheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div className="mt-4 flex items-center gap-4">
            <CheckboxPrimitive.Root
              checked={!!field.value}
              disabled={disabled}
              onCheckedChange={field.onChange}
              name={name}
              id={name}
              className="inline-flex items-center justify-center w-6 h-6 bg-vega-dark-200"
            >
              <CheckboxPrimitive.Indicator className="flex items-center justify-center text-white">
                <Tick className="text-white w-3 h-3" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            <label htmlFor={name}>{label}</label>
          </div>
        );
      }}
    />
  );
}
