import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from './form-context'
import { FormFooter } from './form-footer'
import { NumberInput } from './number-input'
import { SelectInput } from './select-input'
import { SwitchInput } from './switch-input'
import { TextInput } from './text-input'
import { TextareaInput } from './textarea-input'

/**
 * The app's form hook. Use `useAppForm` in place of `useForm`, then render registered inputs with
 * `<form.AppField name="x">{field => <field.TextInput label="…" />}</form.AppField>` and the footer
 * with `<form.AppForm><form.FormFooter onCancel={onClose} /></form.AppForm>`.
 */
export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextInput,
    TextareaInput,
    NumberInput,
    SelectInput,
    SwitchInput
  },
  formComponents: {
    FormFooter
  }
})

export { FormItem, type FormItemLabelProps } from './form-item'
export { useFieldControl } from './form-context'
export type { SelectOption } from './select-input'
