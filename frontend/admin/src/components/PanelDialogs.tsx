import { type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { AccountFormInput, AccountFormValues } from '../forms/accountForm'
import type { FileFormInput, FileFormValues } from '../forms/fileForm'
import type { TransferFormInput, TransferFormValues } from '../forms/transferForm'
import type { Entity, FormDialog } from '../types/panel'
import { AccountFormDialog } from './AccountFormDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { FileFormDialog } from './FileFormDialog'
import { TransferFormDialog } from './TransferFormDialog'

interface PanelDialogsProps {
  formDialog: FormDialog
  deleteDialog: Entity | null
  formError: string
  accountForm: UseFormReturn<AccountFormInput, unknown, AccountFormValues>
  transferForm: UseFormReturn<TransferFormInput, unknown, TransferFormValues>
  fileForm: UseFormReturn<FileFormInput, unknown, FileFormValues>
  isAccountSaving: boolean
  isTransferSaving: boolean
  isFileSaving: boolean
  isDeleting: boolean
  deleteTitle: string
  deleteDescription: string
  onCloseFormDialog: () => void
  onCloseDeleteDialog: () => void
  onSaveAccount: SubmitHandler<AccountFormValues>
  onSaveTransfer: SubmitHandler<TransferFormValues>
  onSaveFile: SubmitHandler<FileFormValues>
  onConfirmDelete: () => void
}

export function PanelDialogs({
  formDialog,
  deleteDialog,
  formError,
  accountForm,
  transferForm,
  fileForm,
  isAccountSaving,
  isTransferSaving,
  isFileSaving,
  isDeleting,
  deleteTitle,
  deleteDescription,
  onCloseFormDialog,
  onCloseDeleteDialog,
  onSaveAccount,
  onSaveTransfer,
  onSaveFile,
  onConfirmDelete,
}: PanelDialogsProps) {
  return (
    <>
      <AccountFormDialog
        formDialog={formDialog}
        formError={formError}
        accountForm={accountForm}
        isSaving={isAccountSaving}
        onClose={onCloseFormDialog}
        onSave={onSaveAccount}
      />
      <TransferFormDialog
        formDialog={formDialog}
        formError={formError}
        transferForm={transferForm}
        isSaving={isTransferSaving}
        onClose={onCloseFormDialog}
        onSave={onSaveTransfer}
      />
      <FileFormDialog
        formDialog={formDialog}
        formError={formError}
        fileForm={fileForm}
        isSaving={isFileSaving}
        onClose={onCloseFormDialog}
        onSave={onSaveFile}
      />
      <DeleteConfirmDialog
        opened={deleteDialog !== null}
        formError={formError}
        title={deleteTitle}
        description={deleteDescription}
        isDeleting={isDeleting}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
