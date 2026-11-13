import type { ComponentProps, ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { useFieldControl } from './form-context'
import { FormItem, type FormItemLabelProps } from './form-item'

type NativeInputProps = Omit<
  ComponentProps<'input'>,
  'id' | 'name' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'required'
>

interface NumberInputProps extends FormItemLabelProps, NativeInputProps {
  /** A unit drawn inside the end of the input, such as 「秒」 or 「次」. */
  readonly addonEnd?: ReactNode
}

/**
 * A number input bound to a `number | null` field. Clearing the input stores `null` instead of
 * snapping back to a default, so the user can type a new value and the schema reports an empty one.
 */
export function NumberInput({ label, description, required, addonEnd, ...inputProps }: NumberInputProps) {
  const { field, id, value, errors, invalid } = useFieldControl<number | null>()
  const controlProps = {
    inputMode: 'decimal' as const,
    ...inputProps,
    id,
    name: field.name,
    type: 'number',
    value: value ?? '',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      field.handleChange(event.target.value === '' ? null : event.target.valueAsNumber),
    onBlur: field.handleBlur,
    'aria-invalid': invalid
  }

  return (
    <FormItem id={id} label={label} description={description} required={required} errors={errors}>
      {addonEnd ? (
        <InputGroup>
          <InputGroupInput {...controlProps} />
          <InputGroupAddon align="inline-end">{addonEnd}</InputGroupAddon>
        </InputGroup>
      ) : (
        <Input {...controlProps} />
      )}
    </FormItem>
  )
}
