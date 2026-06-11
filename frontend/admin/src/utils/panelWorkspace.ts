import type { Account, Transfer } from '../types'
import { formatCurrency, formatDateTime, formatTransactionDate } from './formatters'

export type DetailRow = [label: string, value: string]
export interface AccountSelectOption {
  value: string
  label: string
}

export function getAccountSelectOptions(accounts: Account[]): AccountSelectOption[] {
  return accounts.map((account) => {
    const details = [account.holder_name, account.account_number].filter(Boolean).join(' / ')

    return {
      value: account.id.toString(),
      label: details ? `${account.login} - ${details}` : account.login,
    }
  })
}

export function getAccountFacts(account: Account | null): DetailRow[] {
  if (!account) {
    return []
  }

  const rows: DetailRow[] = [
    ['Холдер', account.holder_name],
    ['Счет', account.account_name],
    ['Полное имя счета', account.full_account_name],
    ['Номер', account.account_number],
    ['Роутинг', account.routing_number],
    ['Эл. почта', account.email],
    ['Телефон', account.phone],
  ]

  return rows.filter(([, value]) => value !== '')
}

export function getTransferDetails(transfer: Transfer): DetailRow[] {
  const rows: DetailRow[] = [
    ['Дата', formatTransactionDate(transfer.transaction_date)],
    ['Сумма', formatCurrency(transfer.amount)],
    ['Описание', transfer.description],
    ['Полное описание', transfer.full_description],
    ['Категория', transfer.category],
    ['Reference', transfer.reference],
    ['Тип', transfer.transfer_type],
    ['Статус', transfer.status],
    ['From account', transfer.from_account],
    ['To account', transfer.to_account],
    ['Создан', formatDateTime(transfer.created_at)],
  ]

  return rows.filter(([, value]) => value !== '')
}
