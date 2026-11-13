import type { ComponentProps, ReactNode } from 'react'

import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { useFieldControl } from './form-context'
import { FormItem, type FormItemLabelProps } from './form-item'

type NativeInputProps = Omit<
  ComponentProps<'input'>,
  'id' | 'name' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'required'
>

interface TextInputProps extends FormItemLabelProps, NativeInputProps {
  readonly type?: 'text' | 'email' | 'tel' | 'url' | 'password'
  /** A unit or hint drawn inside the end of the input, such as 「秒」. */
  readonly addonEnd?: ReactNode
}

/** A single-line text input bound to a `string` field. */
export function TextInput({ label, description, required, addonEnd, type = 'text', ...inputProps }: TextInputProps) {
  const { field, id, value, errors, invalid } = useFieldControl<string>()
  const controlProps = {
    ...inputProps,
    id,
    name: field.name,
    type,
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => field.handleChange(event.target.value),
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
