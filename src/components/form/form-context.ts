import { useId } from 'react'

import { createFormHookContexts } from '@tanstack/react-form'

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts()

/**
 * Everything a registered input needs from the surrounding `form.AppField`: the field API, a stable
 * control id for the label, the current value and the validation errors. `field.state` is already
 * reactive inside `AppField`, so no extra store subscription is needed.
 */
export function useFieldControl<TValue>() {
  const field = useFieldContext<TValue>()
  const id = useId()
  const { value, meta } = field.state

  return { field, id, value, errors: meta.errors, invalid: meta.errors.length > 0 }
}
