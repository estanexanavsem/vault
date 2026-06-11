import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { optionalText } from '../forms/formValue'
import {
  defaultTransferValues,
  toApiDate,
  toDateInputValue,
  transferSchema,
  type TransferFormInput,
  type TransferFormValues,
} from '../forms/transferForm'
import {
  panelQueryKeys,
  useAccountsQuery,
  useFilesQuery,
  useTransfersQuery,
} from '../hooks/usePanelData'
import { accountService } from '../services/accountService'
import { fileService } from '../services/fileService'
import { transferService } from '../services/transferService'
import { usePanelUiStore } from '../store/panelUiStore'
import type { Entity, FormDialog } from '../types/panel'
import { getErrorMessage } from '../utils/requestError'
import { PanelDialogs } from './PanelDialogs'
import { PanelWorkspace } from './PanelWorkspace'

export function MainPanel() {
  const queryClient = useQueryClient()
  const selectedAccountId = usePanelUiStore((s) => s.selectedAccountId)
  const selectAccount = usePanelUiStore((s) => s.selectAccount)

  const [activeTab, setActiveTab] = useState<string>('transfers')
  const [formDialog, setFormDialog] = useState<FormDialog>(null)
  const [deleteDialog, setDeleteDialog] = useState<Entity | null>(null)
  const [formError, setFormError] = useState('')
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(null)
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null)

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

  const accountsQuery = useAccountsQuery()
  const transfersQuery = useTransfersQuery()
  const filesQuery = useFilesQuery()

  const accounts = accountsQuery.data ?? []
  const transfers = transfersQuery.data ?? []
  const files = filesQuery.data ?? []
  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) ?? accounts[0] ?? null
  const activeAccountId = selectedAccount?.id ?? null
  const selectedTransfer =
    transfers.find(
      (transfer) => transfer.id === selectedTransferId && transfer.account_id === activeAccountId,
    ) ?? null
  const selectedFile =
    files.find((file) => file.id === selectedFileId && file.account_id === activeAccountId) ?? null

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

  const createAccountMutation = useMutation({
    mutationFn: accountService.createAccount,
    onSuccess: async (account) => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts })
      selectAccount(account.id)
      setSelectedTransferId(null)
      setSelectedFileId(null)
      closeFormDialog()
    },
  })

  const updateAccountMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof accountService.updateAccount>[1]
    }) => accountService.updateAccount(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts })
      closeFormDialog()
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: accountService.deleteAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts })
      selectAccount(null)
      setSelectedTransferId(null)
      setSelectedFileId(null)
      closeDeleteDialog()
    },
  })

  const createTransferMutation = useMutation({
    mutationFn: transferService.createTransfer,
    onSuccess: async (transfer) => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers })
      setSelectedTransferId(transfer.id)
      closeFormDialog()
    },
  })

  const updateTransferMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof transferService.updateTransfer>[1]
    }) => transferService.updateTransfer(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers })
      closeFormDialog()
    },
  })

  const deleteTransferMutation = useMutation({
    mutationFn: transferService.deleteTransfer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.transfers })
      setSelectedTransferId(null)
      closeDeleteDialog()
    },
  })

  const uploadFileMutation = useMutation({
    mutationFn: fileService.uploadFile,
    onSuccess: async (file) => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.files })
      setSelectedFileId(file.id)
      closeFormDialog()
    },
  })

  const updateFileMutation = useMutation({
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

  const deleteFileMutation = useMutation({
    mutationFn: fileService.deleteFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.files })
      setSelectedFileId(null)
      closeDeleteDialog()
    },
  })

  const handleSelectAccount = (id: number) => {
    selectAccount(id)
    setSelectedTransferId(null)
    setSelectedFileId(null)
  }

  const openCreateAccount = () => {
    accountForm.reset(defaultAccountValues)
    setFormError('')
    setFormDialog({ entity: 'account', mode: 'create' })
  }

  const openEditAccount = (accountId = activeAccountId) => {
    const account = accounts.find((item) => item.id === accountId) ?? null
    if (!account) {
      return
    }

    selectAccount(account.id)
    accountForm.reset({
      login: account.login,
      password: '',
      holder_name: account.holder_name,
      account_name: account.account_name,
      full_account_name: account.full_account_name,
      account_number: account.account_number,
      routing_number: account.routing_number,
      email: account.email,
      phone: account.phone,
      balance: account.balance,
    })
    setFormError('')
    setFormDialog({ entity: 'account', mode: 'edit' })
  }

  const openDeleteAccount = (accountId = activeAccountId) => {
    if (!accountId) {
      return
    }

    selectAccount(accountId)
    setDeleteDialog('account')
  }

  const openCreateTransfer = () => {
    transferForm.reset(defaultTransferValues)
    setFormError('')
    setFormDialog({ entity: 'transfer', mode: 'create' })
  }

  const openEditTransfer = (transferId = selectedTransferId) => {
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

  const openDeleteTransfer = (transferId = selectedTransferId) => {
    if (!transferId) {
      return
    }

    setSelectedTransferId(transferId)
    setDeleteDialog('transfer')
  }

  const openCreateFile = () => {
    fileForm.reset(defaultFileValues)
    setFormError('')
    setFormDialog({ entity: 'file', mode: 'create' })
  }

  const openEditFile = (fileId = selectedFileId) => {
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

  const openDeleteFile = (fileId = selectedFileId) => {
    if (!fileId) {
      return
    }

    setSelectedFileId(fileId)
    setDeleteDialog('file')
  }

  const handleSaveAccount: SubmitHandler<AccountFormValues> = async (values) => {
    setFormError('')

    if (formDialog?.mode === 'create' && values.password.trim() === '') {
      accountForm.setError('password', { message: 'Пароль обязателен' })
      return
    }

    try {
      if (formDialog?.mode === 'edit' && selectedAccount) {
        await updateAccountMutation.mutateAsync({
          id: selectedAccount.id,
          payload: {
            login: values.login,
            ...(values.password ? { password: values.password } : {}),
            holder_name: values.holder_name,
            account_name: values.account_name,
            full_account_name: values.full_account_name,
            account_number: values.account_number,
            routing_number: values.routing_number,
            email: values.email,
            phone: values.phone,
            balance: values.balance,
          },
        })
      } else {
        await createAccountMutation.mutateAsync({
          login: values.login,
          password: values.password,
          holder_name: optionalText(values.holder_name),
          account_name: optionalText(values.account_name),
          full_account_name: optionalText(values.full_account_name),
          account_number: optionalText(values.account_number),
          routing_number: optionalText(values.routing_number),
          email: optionalText(values.email),
          phone: optionalText(values.phone),
          balance: values.balance,
        })
      }
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const handleSaveTransfer: SubmitHandler<TransferFormValues> = async (values) => {
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
        await updateTransferMutation.mutateAsync({ id: selectedTransfer.id, payload })
      } else {
        await createTransferMutation.mutateAsync(payload)
      }
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const handleSaveFile: SubmitHandler<FileFormValues> = async (values) => {
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
        await updateFileMutation.mutateAsync({
          id: selectedFile.id,
          payload: {
            account_id: activeAccountId,
            name: values.name,
            type: values.type,
            description: values.description,
          },
        })
      } else if (values.file) {
        await uploadFileMutation.mutateAsync({
          account_id: activeAccountId,
          file: values.file,
          description: optionalText(values.description),
        })
      }
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const handleConfirmDelete = async () => {
    setFormError('')
    try {
      if (deleteDialog === 'account' && activeAccountId) {
        await deleteAccountMutation.mutateAsync(activeAccountId)
      }
      if (deleteDialog === 'transfer' && selectedTransfer) {
        await deleteTransferMutation.mutateAsync(selectedTransfer.id)
      }
      if (deleteDialog === 'file' && selectedFile) {
        await deleteFileMutation.mutateAsync(selectedFile.id)
      }
    } catch (error) {
      setFormError(getErrorMessage(error))
    }
  }

  const isAccountSaving = createAccountMutation.isPending || updateAccountMutation.isPending
  const isTransferSaving = createTransferMutation.isPending || updateTransferMutation.isPending
  const isFileSaving = uploadFileMutation.isPending || updateFileMutation.isPending
  const isDeleting =
    deleteAccountMutation.isPending ||
    deleteTransferMutation.isPending ||
    deleteFileMutation.isPending
  const deleteTitle =
    deleteDialog === 'account'
      ? 'Удалить аккаунт'
      : deleteDialog === 'transfer'
        ? 'Удалить перевод'
        : 'Удалить файл'
  const deleteTransferLabel =
    selectedTransfer?.description.trim() !== ''
      ? selectedTransfer?.description
      : selectedTransfer?.id.toString()
  const deleteDescription =
    deleteDialog === 'account'
      ? `Удалить аккаунт "${selectedAccount?.login ?? ''}"?`
      : deleteDialog === 'transfer'
        ? `Удалить перевод "${deleteTransferLabel ?? ''}"?`
        : `Удалить файл "${selectedFile?.name ?? ''}"?`

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
        onSelectAccount={handleSelectAccount}
        onSelectTransfer={setSelectedTransferId}
        onSelectFile={setSelectedFileId}
        onCreateAccount={openCreateAccount}
        onEditAccount={openEditAccount}
        onDeleteAccount={openDeleteAccount}
        onCreateTransfer={openCreateTransfer}
        onEditTransfer={openEditTransfer}
        onDeleteTransfer={openDeleteTransfer}
        onCreateFile={openCreateFile}
        onEditFile={openEditFile}
        onDeleteFile={openDeleteFile}
      />

      <PanelDialogs
        formDialog={formDialog}
        deleteDialog={deleteDialog}
        formError={formError}
        accountForm={accountForm}
        transferForm={transferForm}
        fileForm={fileForm}
        isAccountSaving={isAccountSaving}
        isTransferSaving={isTransferSaving}
        isFileSaving={isFileSaving}
        isDeleting={isDeleting}
        deleteTitle={deleteTitle}
        deleteDescription={deleteDescription}
        onCloseFormDialog={closeFormDialog}
        onCloseDeleteDialog={closeDeleteDialog}
        onSaveAccount={handleSaveAccount}
        onSaveTransfer={handleSaveTransfer}
        onSaveFile={handleSaveFile}
        onConfirmDelete={() => void handleConfirmDelete()}
      />
    </div>
  )
}
