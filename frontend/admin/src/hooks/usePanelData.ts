import { queryOptions, useQuery } from '@tanstack/react-query'
import { accountService } from '../services/accountService'
import { fileService } from '../services/fileService'
import { transferService } from '../services/transferService'

export const panelQueryKeys = {
  accounts: ['accounts'] as const,
  transfers: ['transfers'] as const,
  files: ['files'] as const,
  settings: ['settings'] as const,
}

const panelQueryOptions = {
  accounts: () =>
    queryOptions({
      queryKey: panelQueryKeys.accounts,
      queryFn: accountService.getAccounts,
    }),
  transfers: () =>
    queryOptions({
      queryKey: panelQueryKeys.transfers,
      queryFn: transferService.getTransfers,
    }),
  files: () =>
    queryOptions({
      queryKey: panelQueryKeys.files,
      queryFn: fileService.getFiles,
    }),
}

export const useAccountsQuery = () => useQuery(panelQueryOptions.accounts())

export const useTransfersQuery = () => useQuery(panelQueryOptions.transfers())

export const useFilesQuery = () => useQuery(panelQueryOptions.files())
