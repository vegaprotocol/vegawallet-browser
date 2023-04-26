import type { ReactNode } from 'react'
import type { Control, Path, FieldValues } from 'react-hook-form'
import { Controller } from 'react-hook-form'
import { Checkbox as UICheckbox } from '@vegaprotocol/ui-toolkit'
import locators from '../locators'

export type CheckboxProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  label: ReactNode
  disabled?: boolean
}

export function Checkbox<T extends FieldValues>({
  name,
  control,
  label,
  disabled
}: CheckboxProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return (
          <div
            data-testid={locators.checkboxWrapper}
            className="mt-4 flex items-center gap-4"
          >
            <UICheckbox
              label={label}
              checked={!!field.value}
              disabled={disabled}
              onCheckedChange={field.onChange}
              name={name}
            />
          </div>
        )
      }}
    />
  )
}
