import type { AccountFile, Transfer } from '../types'
import type { Entity } from '../types/panel'
import { getErrorMessage } from './requestError'

interface ConfirmPanelDeleteParams {
  deleteDialog: Entity | null
  activeAccountId: number | null
  selectedTransfer: Transfer | null
  selectedFile: AccountFile | null
  setFormError: (error: string) => void
  deleteAccount: (id: number) => Promise<unknown>
  deleteTransfer: (id: number) => Promise<unknown>
  deleteFile: (id: number) => Promise<unknown>
}

export const confirmPanelDelete = async ({
  deleteDialog,
  activeAccountId,
  selectedTransfer,
  selectedFile,
  setFormError,
  deleteAccount,
  deleteTransfer,
  deleteFile,
}: ConfirmPanelDeleteParams) => {
  setFormError('')

  try {
    if (deleteDialog === 'account' && activeAccountId) {
      await deleteAccount(activeAccountId)
    }
    if (deleteDialog === 'transfer' && selectedTransfer) {
      await deleteTransfer(selectedTransfer.id)
    }
    if (deleteDialog === 'file' && selectedFile) {
      await deleteFile(selectedFile.id)
    }
  } catch (error) {
    setFormError(getErrorMessage(error))
  }
}
