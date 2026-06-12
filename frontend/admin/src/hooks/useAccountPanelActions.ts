import { useMutation, type QueryClient } from '@tanstack/react-query'
import type { SubmitHandler, UseFormReturn } from 'react-hook-form'
import {
  defaultAccountValues,
  type AccountFormInput,
  type AccountFormValues,
} from '../forms/accountForm'
import { optionalText } from '../forms/formValue'
import { accountService, type UpdateAccountPayload } from '../services/accountService'
import type { Account } from '../types'
import type { FormDialog } from '../types/panel'
import { formatUsPhoneInput } from '../utils/formatters'
import { getErrorMessage } from '../utils/requestError'
import { panelQueryKeys } from './usePanelData'

interface UseAccountPanelActionsParams {
  queryClient: QueryClient
  accounts: Account[]
  selectedAccount: Account | null
  activeAccountId: number | null
  formDialog: FormDialog
  accountForm: UseFormReturn<AccountFormInput, unknown, AccountFormValues>
  selectAccount: (id: number | null) => void
  setSelectedTransferId: (id: number | null) => void
  setSelectedFileId: (id: number | null) => void
  setFormDialog: (dialog: FormDialog) => void
  setDeleteDialog: (entity: 'account') => void
  setFormError: (error: string) => void
  closeFormDialog: () => void
  closeDeleteDialog: () => void
}

interface UpdateAccountMutationInput {
  id: number
  payload: UpdateAccountPayload
}

export function useAccountPanelActions({
  queryClient,
  accounts,
  selectedAccount,
  activeAccountId,
  formDialog,
  accountForm,
  selectAccount,
  setSelectedTransferId,
  setSelectedFileId,
  setFormDialog,
  setDeleteDialog,
  setFormError,
  closeFormDialog,
  closeDeleteDialog,
}: UseAccountPanelActionsParams) {
  const select = (id: number) => {
    selectAccount(id)
    setSelectedTransferId(null)
    setSelectedFileId(null)
  }

  const createMutation = useMutation({
    mutationFn: accountService.createAccount,
    onSuccess: async (account) => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts })
      selectAccount(account.id)
      setSelectedTransferId(null)
      setSelectedFileId(null)
      closeFormDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: UpdateAccountMutationInput) =>
      accountService.updateAccount(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts })
      closeFormDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: accountService.deleteAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: panelQueryKeys.accounts })
      selectAccount(null)
      setSelectedTransferId(null)
      setSelectedFileId(null)
      closeDeleteDialog()
    },
  })

  const openCreate = () => {
    accountForm.reset(defaultAccountValues)
    setFormError('')
    setFormDialog({ entity: 'account', mode: 'create' })
  }

  const openEdit = (accountId = activeAccountId) => {
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
      phone: formatUsPhoneInput(account.phone),
      balance: account.balance,
    })
    setFormError('')
    setFormDialog({ entity: 'account', mode: 'edit' })
  }

  const openDelete = (accountId = activeAccountId) => {
    if (!accountId) {
      return
    }

    selectAccount(accountId)
    setDeleteDialog('account')
  }

  const save: SubmitHandler<AccountFormValues> = async (values) => {
    setFormError('')

    if (formDialog?.mode === 'create' && values.password.trim() === '') {
      accountForm.setError('password', { message: 'Пароль обязателен' })
      return
    }

    try {
      if (formDialog?.mode === 'edit' && selectedAccount) {
        await updateMutation.mutateAsync({
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
        await createMutation.mutateAsync({
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

  return {
    select,
    openCreate,
    openEdit,
    openDelete,
    save,
    deleteAccount: deleteMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
