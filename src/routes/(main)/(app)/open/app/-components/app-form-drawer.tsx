import * as React from 'react'

import { revalidateLogic } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { Clock, LayoutGrid } from 'lucide-react'

import { EntityDrawer } from '@/components/entity-drawer'
import { ExpiryPicker } from '@/components/expiry-picker'
import { FormItem, useAppForm } from '@/components/form'
import { QueryState } from '@/components/query-state'
import { FieldGroup } from '@/components/ui/field'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/toast'
import { useFillFormOnce } from '@/hooks/use-fill-form-once'
import { appKeys, createApp, type AppDetailResp, type AppReq, type AppStatus, updateApp } from '@/lib/api/app'

import { useAppDetail } from './use-app-detail'

const formSchema = z.object({
  name: z.string().trim().min(1, '应用名称不能为空').max(100, '应用名称长度不能超过 100 个字符'),
  status: z.number().int().min(1).max(2),
  expireTime: z.string().refine(val => {
    if (!val) return true
    const date = new Date(val.replace(/-/g, '/'))
    return !Number.isNaN(date.getTime()) && date.getTime() > Date.now()
  }, '失效时间必须是未来时间'),
  description: z.string().max(200, '描述长度不能超过 200 个字符')
})

type FormValues = z.infer<typeof formSchema>

const EMPTY_FORM: FormValues = {
  name: '',
  status: 1,
  expireTime: '',
  description: ''
}

function toFormValues(app: AppDetailResp): FormValues {
  return {
    name: app.name ?? '',
    status: app.status ?? 1,
    expireTime: app.expireTime ?? '',
    description: app.description ?? ''
  }
}

function AppFormSkeleton() {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-3.5 w-48" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}

interface AppFormDrawerProps {
  /** The app being edited, or `null` when creating a new app. */
  readonly appId: string | number | null
  readonly open: boolean
  readonly onClose: () => void
}

export function AppFormDrawer({ appId, open, onClose }: AppFormDrawerProps) {
  const isCreate = appId === null
  const queryClient = useQueryClient()
  const formRef = React.useRef<HTMLFormElement>(null)
  const detail = useAppDetail(appId, { enabled: open })

  const form = useAppForm({
    defaultValues: EMPTY_FORM,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    onSubmit: async ({ value }) => {
      const payload: AppReq = {
        name: value.name,
        status: value.status as AppStatus,
        expireTime: value.expireTime || null,
        description: value.description || undefined
      }

      try {
        if (isCreate) {
          await createApp(payload)
        } else {
          await updateApp(appId, payload)
        }
      } catch {
        // The HTTP layer already reported the failure.
        return
      }

      onClose()
      void queryClient.invalidateQueries({ queryKey: appKeys.all })
      toast.add({ title: isCreate ? '新增应用成功' : '修改应用成功', type: 'success' })
    }
  })

  /** Run the object validator first; handleSubmit stops at field errors and would hide form-level ones. */
  const submit = async () => {
    await form.validate('submit')
    await form.handleSubmit()

    requestAnimationFrame(() => {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    })
  }

  useFillFormOnce({
    open,
    isEdit: !isCreate,
    entityKey: appId,
    record: detail.data,
    version: detail.dataUpdatedAt,
    buildValues: ({ isEdit: editing, record }) => (editing && record ? toFormValues(record) : { ...EMPTY_FORM }),
    apply: values => form.reset(values, { keepDefaultValues: true })
  })

  return (
    <EntityDrawer
      open={open}
      onClose={onClose}
      title={isCreate ? '新增应用' : '修改应用'}
      icon={<LayoutGrid className="size-4" />}
      width={30}
      canClose={() => !form.state.isSubmitting}
    >
      {isCreate || (!detail.isError && detail.data && detail.fetchStatus === 'idle') ? (
        <form
          ref={formRef}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={event => {
            event.preventDefault()
            void submit()
          }}
        >
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
            <FieldGroup className="gap-4">
              <form.AppField name="name" validators={{ onDynamic: formSchema.shape.name }}>
                {field => (
                  <field.TextInput
                    label="应用名称"
                    required
                    maxLength={100}
                    placeholder="请输入应用名称，例如：商城接口服务"
                  />
                )}
              </form.AppField>

              <form.Field name="expireTime" validators={{ onDynamic: formSchema.shape.expireTime }}>
                {field => (
                  <FormItem
                    id="app-expire-time"
                    label="失效时间"
                    errors={field.state.meta.errors}
                    description={
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        留空表示永久有效；若设置则必须是未来时间
                      </span>
                    }
                  >
                    <ExpiryPicker
                      id="app-expire-time"
                      value={field.state.value}
                      onChange={field.handleChange}
                      neverLabel="永久有效"
                      placeholder="永久有效（点击设置失效时间）"
                      invalid={field.state.meta.errors.length > 0}
                    />
                  </FormItem>
                )}
              </form.Field>

              <form.AppField name="description" validators={{ onDynamic: formSchema.shape.description }}>
                {field => (
                  <field.TextareaInput
                    label="应用描述"
                    maxLength={200}
                    rows={3}
                    placeholder="请输入应用描述信息（选填，最大 200 字）"
                  />
                )}
              </form.AppField>

              <form.AppField name="status" validators={{ onDynamic: formSchema.shape.status }}>
                {field => (
                  <field.SwitchInput
                    label="状态"
                    description={field.state.value === 1 ? '启用后允许调用开放 API 接口' : '禁用后阻止所有调用请求'}
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </div>

          <form.AppForm>
            <form.FormFooter onCancel={onClose} />
          </form.AppForm>
        </form>
      ) : detail.isError ? (
        <QueryState state="error" className="p-6" onRetry={() => void detail.refetch()} />
      ) : (
        <AppFormSkeleton />
      )}
    </EntityDrawer>
  )
}
