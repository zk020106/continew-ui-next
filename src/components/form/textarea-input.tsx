import type { ComponentProps } from 'react'

import { Textarea } from '@/components/ui/textarea'

import { useFieldControl } from './form-context'
import { FormItem, type FormItemLabelProps } from './form-item'

type NativeTextareaProps = Omit<
  ComponentProps<'textarea'>,
  'id' | 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'required'
>

interface TextareaInputProps extends FormItemLabelProps, NativeTextareaProps {}

/** A multi-line text input bound to a `string` field. */
export function TextareaInput({ label, description, required, ...textareaProps }: TextareaInputProps) {
  const { field, id, value, errors, invalid } = useFieldControl<string>()

  return (
    <FormItem id={id} label={label} description={description} required={required} errors={errors}>
      <Textarea
        {...textareaProps}
        id={id}
        name={field.name}
        value={value}
        onChange={event => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
      />
    </FormItem>
  )
}
