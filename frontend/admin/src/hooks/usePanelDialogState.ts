import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  accountSchema,
  defaultAccountValues,
  type AccountFormInput,
  type AccountFormValues,
} from '../forms/accountForm'
import {
  defaultFileValues,
  fileSchema,
  type FileFormInput,
  type FileFormValues,
} from '../forms/fileForm'
import {
  defaultTransferValues,
  transferSchema,
  type TransferFormInput,
  type TransferFormValues,
} from '../forms/transferForm'
import type { Entity, FormDialog } from '../types/panel'

export function usePanelDialogState() {
  const [formDialog, setFormDialog] = useState<FormDialog>(null)
  const [deleteDialog, setDeleteDialog] = useState<Entity | null>(null)
  const [formError, setFormError] = useState('')

  const accountForm = useForm<AccountFormInput, unknown, AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultAccountValues,
  })
  const transferForm = useForm<TransferFormInput, unknown, TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: defaultTransferValues,
  })
  const fileForm = useForm<FileFormInput, unknown, FileFormValues>({
    resolver: zodResolver(fileSchema),
    defaultValues: defaultFileValues,
  })

  const closeFormDialog = () => {
    setFormDialog(null)
    setFormError('')
    accountForm.reset(defaultAccountValues)
    transferForm.reset(defaultTransferValues)
    fileForm.reset(defaultFileValues)
  }

  const closeDeleteDialog = () => {
    setDeleteDialog(null)
    setFormError('')
  }

  return {
    formDialog,
    deleteDialog,
    formError,
    accountForm,
    transferForm,
    fileForm,
    setFormDialog,
    setDeleteDialog,
    setFormError,
    closeFormDialog,
    closeDeleteDialog,
  }
}
