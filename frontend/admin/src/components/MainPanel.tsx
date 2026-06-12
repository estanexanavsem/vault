import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAccountPanelActions } from '../hooks/useAccountPanelActions'
import { useFilePanelActions } from '../hooks/useFilePanelActions'
import { useAccountsQuery, useFilesQuery, useTransfersQuery } from '../hooks/usePanelData'
import { usePanelDialogState } from '../hooks/usePanelDialogState'
import { useTransferPanelActions } from '../hooks/useTransferPanelActions'
import { usePanelUiStore } from '../store/panelUiStore'
import { confirmPanelDelete } from '../utils/panelDeletion'
import {
  getActiveAccount,
  getDeleteDescription,
  getDeleteTitle,
  getSelectedFile,
  getSelectedTransfer,
} from '../utils/panelSelection'
import { PanelDialogs } from './PanelDialogs'
import { PanelWorkspace } from './PanelWorkspace'

export function MainPanel() {
  const queryClient = useQueryClient()
  const selectedAccountId = usePanelUiStore((s) => s.selectedAccountId)
  const selectAccount = usePanelUiStore((s) => s.selectAccount)
  const [activeTab, setActiveTab] = useState<string>('transfers')
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
  const accountsQuery = useAccountsQuery()
  const transfersQuery = useTransfersQuery()
  const filesQuery = useFilesQuery()
  const accounts = accountsQuery.data ?? []
  const transfers = transfersQuery.data ?? []
  const files = filesQuery.data ?? []
  const selectedAccount = getActiveAccount(accounts, selectedAccountId)
  const activeAccountId = selectedAccount?.id ?? null
  const selectedTransfer = getSelectedTransfer(transfers, selectedTransferId, activeAccountId)
  const selectedFile = getSelectedFile(files, selectedFileId, activeAccountId)
  const dialog = usePanelDialogState()

  const accountActions = useAccountPanelActions({
    queryClient,
    accounts,
    selectedAccount,
    activeAccountId,
    formDialog: dialog.formDialog,
    accountForm: dialog.accountForm,
    selectAccount,
    setSelectedTransferId,
    setSelectedFileId,
    setFormDialog: dialog.setFormDialog,
    setDeleteDialog: dialog.setDeleteDialog,
    setFormError: dialog.setFormError,
    closeFormDialog: dialog.closeFormDialog,
    closeDeleteDialog: dialog.closeDeleteDialog,
  })
  const transferActions = useTransferPanelActions({
    queryClient,
    transfers,
    selectedTransfer,
    selectedTransferId,
    activeAccountId,
    formDialog: dialog.formDialog,
    transferForm: dialog.transferForm,
    setSelectedTransferId,
    setFormDialog: dialog.setFormDialog,
    setDeleteDialog: dialog.setDeleteDialog,
    setFormError: dialog.setFormError,
    closeFormDialog: dialog.closeFormDialog,
    closeDeleteDialog: dialog.closeDeleteDialog,
  })
  const fileActions = useFilePanelActions({
    queryClient,
    files,
    selectedFile,
    selectedFileId,
    activeAccountId,
    formDialog: dialog.formDialog,
    fileForm: dialog.fileForm,
    setSelectedFileId,
    setFormDialog: dialog.setFormDialog,
    setDeleteDialog: dialog.setDeleteDialog,
    setFormError: dialog.setFormError,
    closeFormDialog: dialog.closeFormDialog,
    closeDeleteDialog: dialog.closeDeleteDialog,
  })
  return (
    <div className="flex h-full min-w-0 flex-col p-2 sm:p-6">
      <PanelWorkspace
        activeTab={activeTab}
        accounts={accounts}
        transfers={transfers}
        files={files}
        selectedAccount={selectedAccount}
        selectedTransfer={selectedTransfer}
        activeAccountId={activeAccountId}
        selectedTransferId={selectedTransferId}
        selectedFileId={selectedFileId}
        accountsLoading={accountsQuery.isPending}
        transfersLoading={transfersQuery.isPending}
        filesLoading={filesQuery.isPending}
        accountsError={accountsQuery.error}
        transfersError={transfersQuery.error}
        filesError={filesQuery.error}
        onTabChange={setActiveTab}
        onSelectAccount={accountActions.select}
        onSelectTransfer={setSelectedTransferId}
        onSelectFile={setSelectedFileId}
        onCreateAccount={accountActions.openCreate}
        onEditAccount={accountActions.openEdit}
        onDeleteAccount={accountActions.openDelete}
        onCreateTransfer={transferActions.openCreate}
        onEditTransfer={transferActions.openEdit}
        onDeleteTransfer={transferActions.openDelete}
        onCreateFile={fileActions.openCreate}
        onEditFile={fileActions.openEdit}
        onDeleteFile={fileActions.openDelete}
      />

      <PanelDialogs
        formDialog={dialog.formDialog}
        deleteDialog={dialog.deleteDialog}
        formError={dialog.formError}
        accountForm={dialog.accountForm}
        transferForm={dialog.transferForm}
        fileForm={dialog.fileForm}
        isAccountSaving={accountActions.isSaving}
        isTransferSaving={transferActions.isSaving}
        isFileSaving={fileActions.isSaving}
        isDeleting={
          accountActions.isDeleting || transferActions.isDeleting || fileActions.isDeleting
        }
        deleteTitle={getDeleteTitle(dialog.deleteDialog)}
        deleteDescription={getDeleteDescription({
          deleteDialog: dialog.deleteDialog,
          selectedAccountLogin: selectedAccount?.login ?? '',
          selectedTransfer,
          selectedFileName: selectedFile?.name ?? '',
        })}
        onCloseFormDialog={dialog.closeFormDialog}
        onCloseDeleteDialog={dialog.closeDeleteDialog}
        onSaveAccount={accountActions.save}
        onSaveTransfer={transferActions.save}
        onSaveFile={fileActions.save}
        onConfirmDelete={() =>
          void confirmPanelDelete({
            deleteDialog: dialog.deleteDialog,
            activeAccountId,
            selectedTransfer,
            selectedFile,
            setFormError: dialog.setFormError,
            deleteAccount: accountActions.deleteAccount,
            deleteTransfer: transferActions.deleteTransfer,
            deleteFile: fileActions.deleteFile,
          })
        }
      />
    </div>
  )
}
