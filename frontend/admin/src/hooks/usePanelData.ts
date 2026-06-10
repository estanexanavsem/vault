import { useQuery } from '@tanstack/react-query'
import { accountService } from '../services/accountService'
import { fileService } from '../services/fileService'
import { transferService } from '../services/transferService'

export const panelQueryKeys = {
  accounts: ['accounts'] as const,
  transfers: ['transfers'] as const,
  files: ['files'] as const,
}

export const useAccountsQuery = () =>
  useQuery({
    queryKey: panelQueryKeys.accounts,
    queryFn: accountService.getAccounts,
  })

export const useTransfersQuery = () =>
  useQuery({
    queryKey: panelQueryKeys.transfers,
    queryFn: transferService.getTransfers,
  })

export const useFilesQuery = () =>
  useQuery({
    queryKey: panelQueryKeys.files,
    queryFn: fileService.getFiles,
  })
