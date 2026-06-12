import { useMutation, type QueryClient } from '@tanstack/react-query'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { defaultFileValues, type FileFormInput, type FileFormValues } from '../forms/fileForm'
import { optionalText } from '../forms/formValue'
import { fileService } from '../services/fileService'
import type { AccountFile } from '../types'
import type { FormDialog } from '../types/panel'
import { getErrorMessage } from '../utils/requestError'
import { panelQueryKeys } from './usePanelData'

interface UseFilePanelActionsParams {
  queryClient: QueryClient
  files: AccountFile[]
  selectedFile: AccountFile | null
  selectedFileId: number | null
  activeAccountId: number | null
  formDialog: FormDialog
  fileForm: UseFormReturn<FileFormInput, unknown, FileFormValues>
  setSelectedFileId: (id: number | null) => void
  setFormDialog: (dialog: FormDialog) => void
  setDeleteDialog: (entity: 'file') => void
  setFormError: (error: string) => void
  closeFormDialog: () => void
  closeDeleteDialog: () => void
}

export function useFilePanelActions({
  queryClient,
  files,
  selectedFile,
  selectedFileId,
  activeAccountId,
  formDialog,
  fileForm,
  setSelectedFileId,
  setFormDialog,
  setDeleteDialog,
  setFormError,
  closeFormDialog,
  closeDeleteDialog,
}: UseFilePanelActionsParams) {
  const uploadMutation = useMutation({
    mutationFn: fileService.uploadFile,
    onSuccess: async (file) => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.files })
      setSelectedFileId(file.id)
      closeFormDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof fileService.updateFile>[1]
    }) => fileService.updateFile(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.files })
      closeFormDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: fileService.deleteFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.files })
      setSelectedFileId(null)
      closeDeleteDialog()
    },
  })

  const openCreate = () => {
    fileForm.reset(defaultFileValues)
    setFormError('')
    setFormDialog({ entity: 'file', mode: 'create' })
  }

  const openEdit = (fileId = selectedFileId) => {
    const file =
      files.find((item) => item.id === fileId && item.account_id === activeAccountId) ?? null
    if (!file) {
      return
    }

    setSelectedFileId(file.id)
    fileForm.reset({
      file: null,
      name: file.name,
      type: file.type,
      description: file.description,
    })
    setFormError('')
    setFormDialog({ entity: 'file', mode: 'edit' })
  }

  const openDelete = (fileId = selectedFileId) => {
    if (!fileId) {
      return
    }

    setSelectedFileId(fileId)
    setDeleteDialog('file')
  }

  const save: SubmitHandler<FileFormValues> = async (values) => {
    if (!activeAccountId) {
      return
    }

    if (formDialog?.mode === 'create' && !values.file) {
      fileForm.setError('file', { message: 'Файл обязателен' })
      return
    }

    setFormError('')
    try {
      if (formDialog?.mode === 'edit' && selectedFile) {
        await updateMutation.mutateAsync({
          id: selectedFile.id,
          payload: {
            account_id: activeAccountId,
            name: values.name,
            type: values.type,
            description: values.description,
          },
        })
      } else if (values.file) {
        await uploadMutation.mutateAsync({
          account_id: activeAccountId,
          file: values.file,
          description: optionalText(values.description),
        })
      }
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  return {
    openCreate,
    openEdit,
    openDelete,
    save,
    deleteFile: deleteMutation.mutateAsync,
    isSaving: uploadMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
