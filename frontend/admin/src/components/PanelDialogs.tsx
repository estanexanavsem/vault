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
  savingState: DialogSavingState
  deleteTitle: string
  deleteDescription: string
  onCloseFormDialog: () => void
  onCloseDeleteDialog: () => void
  onSaveAccount: SubmitHandler<AccountFormValues>
  onSaveTransfer: SubmitHandler<TransferFormValues>
  onSaveFile: SubmitHandler<FileFormValues>
  onConfirmDelete: () => void
}

interface DialogSavingState {
  account: boolean
  transfer: boolean
  file: boolean
  delete: boolean
}

export function PanelDialogs({
  formDialog,
  deleteDialog,
  formError,
  accountForm,
  transferForm,
  fileForm,
  savingState,
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
        isSaving={savingState.account}
        onClose={onCloseFormDialog}
        onSave={onSaveAccount}
      />
      <TransferFormDialog
        formDialog={formDialog}
        formError={formError}
        transferForm={transferForm}
        isSaving={savingState.transfer}
        onClose={onCloseFormDialog}
        onSave={onSaveTransfer}
      />
      <FileFormDialog
        formDialog={formDialog}
        formError={formError}
        fileForm={fileForm}
        isSaving={savingState.file}
        onClose={onCloseFormDialog}
        onSave={onSaveFile}
      />
      <DeleteConfirmDialog
        opened={deleteDialog !== null}
        formError={formError}
        title={deleteTitle}
        description={deleteDescription}
        isDeleting={savingState.delete}
        onClose={onCloseDeleteDialog}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
