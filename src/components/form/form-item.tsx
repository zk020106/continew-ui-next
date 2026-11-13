import type { ReactNode } from 'react'

import { RequiredMark } from '@/components/required-mark'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'

/** The label props every registered input accepts. */
export interface FormItemLabelProps {
  readonly label?: ReactNode
  readonly description?: ReactNode
  /** Only draws the required mark; the schema decides whether the value is required. */
  readonly required?: boolean
}

interface FormItemProps extends FormItemLabelProps {
  /** The control id, so clicking the label focuses the control. */
  readonly id?: string
  readonly errors: ReadonlyArray<{ message?: string } | undefined>
  /** `horizontal` puts the control on the right of the label, for switches and checkboxes. */
  readonly orientation?: 'vertical' | 'horizontal'
  readonly children: ReactNode
}

/**
 * The shell around one form control: label, required mark, description and error message.
 * Registered inputs use it internally; screens use it directly for a custom control.
 */
export function FormItem({
  id,
  label,
  description,
  required = false,
  errors,
  orientation = 'vertical',
  children
}: FormItemProps) {
  const invalid = errors.length > 0
  const labelNode = label ? (
    <FieldLabel htmlFor={id}>
      {label}
      {required ? <RequiredMark /> : null}
    </FieldLabel>
  ) : null
  const descriptionNode = description ? <FieldDescription>{description}</FieldDescription> : null
  const errorNode = <FieldError errors={[...errors]} />

  if (orientation === 'horizontal') {
    return (
      <Field orientation="horizontal" data-invalid={invalid}>
        <FieldContent>
          {labelNode}
          {descriptionNode}
          {errorNode}
        </FieldContent>
        {children}
      </Field>
    )
  }

  return (
    <Field data-invalid={invalid}>
      {labelNode}
      {children}
      {descriptionNode}
      {errorNode}
    </Field>
  )
}
