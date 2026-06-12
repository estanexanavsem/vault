import type { Account, AccountFile, Transfer } from '../types'
import type { Entity } from '../types/panel'

interface DeleteDescriptionParams {
  deleteDialog: Entity | null
  selectedAccountLogin: string
  selectedTransfer: Transfer | null
  selectedFileName: string
}

export const getActiveAccount = (accounts: Account[], selectedAccountId: number | null) =>
  accounts.find((account) => account.id === selectedAccountId) ?? accounts[0] ?? null

export const getSelectedTransfer = (
  transfers: Transfer[],
  selectedTransferId: number | null,
  activeAccountId: number | null,
) =>
  transfers.find(
    (transfer) => transfer.id === selectedTransferId && transfer.account_id === activeAccountId,
  ) ?? null

export const getSelectedFile = (
  files: AccountFile[],
  selectedFileId: number | null,
  activeAccountId: number | null,
) => files.find((file) => file.id === selectedFileId && file.account_id === activeAccountId) ?? null

export const getDeleteTitle = (deleteDialog: Entity | null) => {
  switch (deleteDialog) {
    case 'account':
      return 'Удалить аккаунт'
    case 'transfer':
      return 'Удалить перевод'
    case 'file':
      return 'Удалить файл'
    case null:
      return ''
  }
}

export const getDeleteDescription = ({
  deleteDialog,
  selectedAccountLogin,
  selectedTransfer,
  selectedFileName,
}: DeleteDescriptionParams) => {
  if (deleteDialog === 'account') {
    return `Удалить аккаунт "${selectedAccountLogin}"?`
  }

  if (deleteDialog === 'transfer') {
    const transferLabel =
      selectedTransfer?.description.trim() !== ''
        ? selectedTransfer?.description
        : selectedTransfer?.id.toString()

    return `Удалить перевод "${transferLabel ?? ''}"?`
  }

  if (deleteDialog === 'file') {
    return `Удалить файл "${selectedFileName}"?`
  }

  return ''
}
