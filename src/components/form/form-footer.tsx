import { Button } from '@/components/ui/button'
import { DrawerFooter } from '@/components/ui/drawer'
import { Spinner } from '@/components/ui/spinner'

import { useFormContext } from './form-context'

interface FormFooterProps {
  readonly onCancel: () => void
  readonly cancelText?: string
  readonly submitText?: string
  readonly submittingText?: string
}

/**
 * The drawer footer of an entity form: cancel and save. Both buttons are disabled while the form
 * submits, so the drawer cannot close mid-request. Must render inside the `<form>` and `form.AppForm`.
 */
export function FormFooter({
  onCancel,
  cancelText = '取消',
  submitText = '保存',
  submittingText = '保存中'
}: FormFooterProps) {
  const form = useFormContext()

  return (
    <DrawerFooter>
      <form.Subscribe selector={state => state.isSubmitting}>
        {isSubmitting => (
          <>
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
              {cancelText}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner />
                  {submittingText}
                </>
              ) : (
                submitText
              )}
            </Button>
          </>
        )}
      </form.Subscribe>
    </DrawerFooter>
  )
}
