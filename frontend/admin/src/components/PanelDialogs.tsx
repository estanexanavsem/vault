import { type SubmitHandler, type UseFormReturn } from 'react-hook-form'
import type { AccountFormInput, AccountFormValues } from '../forms/accountForm'
import type { FileFormInput, FileFormValues } from '../forms/fileForm'
import type { TransferFormInput, TransferFormValues } from '../forms/transferForm'
import { useDirtyFormCloseGuard } from '../hooks/useDirtyFormCloseGuard'
import type { Entity, FormDialog } from '../types/panel'
import { AccountFormDialog } from './AccountFormDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { FileFormDialog } from './FileFormDialog'
import { TransferFormDialog } from './TransferFormDialog'
import { UnsavedChangesDialog } from './UnsavedChangesDialog'

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
  const accountCloseGuard = useDirtyFormCloseGuard({
    isDirty: accountForm.formState.isDirty,
    onClose: onCloseFormDialog,
  })
  const transferCloseGuard = useDirtyFormCloseGuard({
    isDirty: transferForm.formState.isDirty,
    onClose: onCloseFormDialog,
  })
  const fileCloseGuard = useDirtyFormCloseGuard({
    isDirty: fileForm.formState.isDirty,
    onClose: onCloseFormDialog,
  })

  return (
    <>
      <AccountFormDialog
        formDialog={formDialog}
        formError={formError}
        accountForm={accountForm}
        isSaving={savingState.account}
        onClose={accountCloseGuard.requestClose}
        onSave={onSaveAccount}
      />
      <TransferFormDialog
        formDialog={formDialog}
        formError={formError}
        transferForm={transferForm}
        isSaving={savingState.transfer}
        onClose={transferCloseGuard.requestClose}
        onSave={onSaveTransfer}
      />
      <FileFormDialog
        formDialog={formDialog}
        formError={formError}
        fileForm={fileForm}
        isSaving={savingState.file}
        onClose={fileCloseGuard.requestClose}
        onSave={onSaveFile}
      />
      <UnsavedChangesDialog
        opened={accountCloseGuard.confirmCloseOpened}
        onCancel={accountCloseGuard.closeConfirmDialog}
        onConfirm={accountCloseGuard.confirmClose}
      />
      <UnsavedChangesDialog
        opened={transferCloseGuard.confirmCloseOpened}
        onCancel={transferCloseGuard.closeConfirmDialog}
        onConfirm={transferCloseGuard.confirmClose}
      />
      <UnsavedChangesDialog
        opened={fileCloseGuard.confirmCloseOpened}
        onCancel={fileCloseGuard.closeConfirmDialog}
        onConfirm={fileCloseGuard.confirmClose}
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
