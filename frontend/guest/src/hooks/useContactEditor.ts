import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ChangeEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { guestProfileUpdateOptions, guestQueryKeys } from '../queries/guestAuthOptions'
import type { GuestData } from '../types/guest'
import type { MasterAccount } from '../types/guest'
import { formatUsPhoneInput, normalizeUsPhoneNumber } from '../utils/formatters'
import { notifyRequestError } from '../utils/notifications'
import { normalizeRequestError } from '../utils/requestError'

export type ContactEditField = 'email' | 'phone'

const contactEditorSchema = z
  .object({
    field: z.enum(['email', 'phone']),
    value: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (data.field === 'email') {
      const emailResult = z.email('Enter a valid email address.').safeParse(data.value)
      if (!emailResult.success) {
        ctx.addIssue({
          code: 'custom',
          message: 'Enter a valid email address.',
          path: ['value'],
        })
      }
      return
    }

    if (!normalizeUsPhoneNumber(data.value)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Enter a valid US phone number.',
        path: ['value'],
      })
    }
  })

export type ContactEditorForm = z.infer<typeof contactEditorSchema>

interface UseContactEditorOptions {
  account: MasterAccount
  onEditorClosed?: () => void
  onSessionExpired: () => void
}

export function useContactEditor({
  account,
  onEditorClosed,
  onSessionExpired,
}: UseContactEditorOptions) {
  const queryClient = useQueryClient()
  const [editingField, setEditingField] = useState<ContactEditField | null>(null)
  const updateProfileMutation = useMutation({
    ...guestProfileUpdateOptions(),
    onSuccess: (updatedAccount) => {
      queryClient.setQueryData<GuestData>(guestQueryKeys.session(), (current) =>
        current ? { ...current, master: updatedAccount } : current,
      )
      resetEditor()
    },
  })
  const form = useForm<ContactEditorForm>({
    defaultValues: {
      field: 'email',
      value: '',
    },
    resolver: zodResolver(contactEditorSchema),
  })
  const {
    clearErrors,
    formState: { isSubmitting },
    reset,
    setError,
  } = form
  const isEditingEmail = editingField === 'email'

  const resetEditor = () => {
    setEditingField(null)
    reset({ field: 'email', value: '' })
    onEditorClosed?.()
  }

  const openEditor = (field: ContactEditField) => {
    setEditingField(field)
    reset({
      field,
      value: field === 'email' ? account.email : formatUsPhoneInput(account.phone),
    })
  }

  const closeEditor = () => {
    if (isSubmitting) {
      return
    }

    resetEditor()
    clearErrors()
  }

  const getEditorInputValue = (event: ChangeEvent<HTMLInputElement>) => {
    const value = isEditingEmail ? event.target.value : formatUsPhoneInput(event.target.value)
    clearErrors('value')
    clearErrors('root')
    return value
  }

  const submitEditor = async (values: ContactEditorForm) => {
    const payload =
      values.field === 'email'
        ? { email: values.value.trim() }
        : { phone: normalizeUsPhoneNumber(values.value) }

    try {
      await updateProfileMutation.mutateAsync(payload)
    } catch (error: unknown) {
      const requestError = normalizeRequestError(error)

      if (requestError.kind === 'auth') {
        notifyRequestError(error, {
          id: 'guest-profile-session',
          title: 'Your session expired',
        })
        onSessionExpired()
        return
      }

      if (
        requestError.kind === 'network' ||
        requestError.kind === 'server' ||
        requestError.kind === 'timeout'
      ) {
        notifyRequestError(error, {
          id: 'guest-profile-update',
          title: "We couldn't update your contact information",
        })
      }

      setError('root', {
        message: requestError.userMessage,
      })
    }
  }

  return {
    closeEditor,
    editingField,
    form,
    getEditorInputValue,
    isEditingEmail,
    openEditor,
    submitEditor,
  }
}
