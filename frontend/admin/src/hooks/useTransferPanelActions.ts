import { useMutation, type QueryClient } from '@tanstack/react-query'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import {
  defaultTransferValues,
  toApiDate,
  toDateInputValue,
  type TransferFormInput,
  type TransferFormValues,
} from '../forms/transferForm'
import { transferService } from '../services/transferService'
import type { Transfer } from '../types'
import type { FormDialog } from '../types/panel'
import { getErrorMessage } from '../utils/requestError'
import { panelQueryKeys } from './usePanelData'

interface UseTransferPanelActionsParams {
  queryClient: QueryClient
  transfers: Transfer[]
  selectedTransfer: Transfer | null
  selectedTransferId: number | null
  activeAccountId: number | null
  formDialog: FormDialog
  transferForm: UseFormReturn<TransferFormInput, unknown, TransferFormValues>
  setSelectedTransferId: (id: number | null) => void
  setFormDialog: (dialog: FormDialog) => void
  setDeleteDialog: (entity: 'transfer') => void
  setFormError: (error: string) => void
  closeFormDialog: () => void
  closeDeleteDialog: () => void
}

interface UpdateTransferMutationInput {
  id: number
  payload: Parameters<typeof transferService.updateTransfer>[1]
}

export function useTransferPanelActions({
  queryClient,
  transfers,
  selectedTransfer,
  selectedTransferId,
  activeAccountId,
  formDialog,
  transferForm,
  setSelectedTransferId,
  setFormDialog,
  setDeleteDialog,
  setFormError,
  closeFormDialog,
  closeDeleteDialog,
}: UseTransferPanelActionsParams) {
  const createMutation = useMutation({
    mutationFn: transferService.createTransfer,
    onSuccess: async (transfer) => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers })
      setSelectedTransferId(transfer.id)
      closeFormDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateTransferMutationInput) =>
      transferService.updateTransfer(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers })
      closeFormDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: transferService.deleteTransfer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers })
      setSelectedTransferId(null)
      closeDeleteDialog()
    },
  })

  const openCreate = () => {
    transferForm.reset(defaultTransferValues)
    setFormError('')
    setFormDialog({ entity: 'transfer', mode: 'create' })
  }

  const openEdit = (transferId = selectedTransferId) => {
    const transfer =
      transfers.find((item) => item.id === transferId && item.account_id === activeAccountId) ??
      null
    if (!transfer) {
      return
    }

    setSelectedTransferId(transfer.id)
    transferForm.reset({
      amount: transfer.amount,
      description: transfer.description,
      full_description: transfer.full_description,
      category: transfer.category,
      reference: transfer.reference,
      transfer_type: transfer.transfer_type,
      transaction_date: toDateInputValue(transfer.transaction_date),
    })
    setFormError('')
    setFormDialog({ entity: 'transfer', mode: 'edit' })
  }

  const openDelete = (transferId = selectedTransferId) => {
    if (!transferId) {
      return
    }

    setSelectedTransferId(transferId)
    setDeleteDialog('transfer')
  }

  const save: SubmitHandler<TransferFormValues> = async (values) => {
    if (!activeAccountId) {
      return
    }

    setFormError('')
    try {
      const payload = {
        account_id: activeAccountId,
        amount: values.amount,
        description: values.description,
        full_description: values.full_description,
        category: values.category,
        reference: values.reference,
        transfer_type: values.transfer_type,
        status: values.transfer_type,
        transaction_date: toApiDate(values.transaction_date),
      }

      if (formDialog?.mode === 'edit' && selectedTransfer) {
        await updateMutation.mutateAsync({ id: selectedTransfer.id, payload })
      } else {
        await createMutation.mutateAsync(payload)
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
    deleteTransfer: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
