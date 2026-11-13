import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useFieldControl } from './form-context'
import { FormItem, type FormItemLabelProps } from './form-item'

export interface SelectOption {
  readonly label: string
  readonly value: string
}

interface SelectInputProps extends FormItemLabelProps {
  readonly options: ReadonlyArray<SelectOption>
  readonly placeholder?: string
  readonly disabled?: boolean
}

/**
 * A single-choice dropdown bound to a `string` field; an empty string shows the placeholder.
 * The select primitive only takes string values, so numeric codes are kept as strings in the form.
 */
export function SelectInput({ label, description, required, options, placeholder, disabled }: SelectInputProps) {
  const { field, id, value, errors, invalid } = useFieldControl<string>()

  return (
    <FormItem id={id} label={label} description={description} required={required} errors={errors}>
      <Select
        items={options}
        value={value || null}
        onValueChange={next => field.handleChange(next ?? '')}
        disabled={disabled}
      >
        <SelectTrigger id={id} className="w-full" onBlur={field.handleBlur} aria-invalid={invalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          <SelectGroup>
            {options.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormItem>
  )
}
