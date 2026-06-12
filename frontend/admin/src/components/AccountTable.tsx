import type { Account } from '../types'
import { getAccountDisplayData } from '../utils/panelTableData'
import { AccountActionMenu } from './AccountActionMenu'

interface AccountTableProps {
  accounts: Account[]
  selectedAccountId: number | null
  isLoading: boolean
  error: Error | null
  onSelectAccount: (id: number) => void
  onEditAccount: (id: number) => void
  onDeleteAccount: (id: number) => void
}

export function AccountTable({
  accounts,
  selectedAccountId,
  isLoading,
  error,
  onSelectAccount,
  onEditAccount,
  onDeleteAccount,
}: AccountTableProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-400">Загрузка аккаунтов...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Не удалось загрузить аккаунты: {error.message}</p>
  }

  return (
    <div className="min-w-0" id="account-table">
      {accounts.length === 0 ? (
        <p className="text-sm text-slate-400">Аккаунтов пока нет</p>
      ) : (
        <>
          <div className="space-y-2 sm:hidden">
            {accounts.map((account) => {
              const isSelected = selectedAccountId === account.id
              const display = getAccountDisplayData(account)

              return (
                <div
                  key={account.id}
                  className={
                    isSelected
                      ? 'flex w-full items-start gap-2 rounded-lg border border-blue-500/50 bg-blue-950/50 p-3 text-left'
                      : 'flex w-full items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900'
                  }
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                    onClick={() => onSelectAccount(account.id)}
                  >
                    <span className="flex min-w-0 items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold break-words text-slate-50">
                          {account.login}
                        </span>
                        <span className="mt-1 block text-xs break-words text-slate-400">
                          {account.holder_name || 'Холдер не указан'}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-slate-50">
                        {display.balance}
                      </span>
                    </span>
                    <span className="mt-3 grid gap-1 text-xs text-slate-400">
                      <span className="break-words">{display.mobileAccountName}</span>
                      <span className="break-words">{display.mobileAccountNumber}</span>
                    </span>
                  </button>
                  <div className="-mt-1 -mr-1 shrink-0">
                    <AccountActionMenu
                      accountId={account.id}
                      onEditAccount={onEditAccount}
                      onDeleteAccount={onDeleteAccount}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Логин</th>
                  <th className="px-3 py-2 font-semibold">Имя холдера</th>
                  <th className="px-3 py-2 font-semibold">Полное название счета</th>
                  <th className="px-3 py-2 font-semibold">Номер счета</th>
                  <th className="px-3 py-2 text-right font-semibold">Баланс</th>
                  <th className="w-12 px-2 py-2 font-semibold" aria-label="Действия" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {accounts.map((account) => {
                  const display = getAccountDisplayData(account)

                  return (
                    <tr
                      key={account.id}
                      className={
                        selectedAccountId === account.id
                          ? 'selected bg-blue-950/50'
                          : 'hover:bg-slate-800/70'
                      }
                    >
                      <td className="px-3 py-2 font-medium whitespace-nowrap text-slate-50">
                        <button
                          type="button"
                          aria-pressed={selectedAccountId === account.id}
                          className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                          onClick={() => onSelectAccount(account.id)}
                        >
                          {account.login}
                        </button>
                      </td>
                      <td className="max-w-56 truncate px-3 py-2 text-slate-300">
                        {display.holderName}
                      </td>
                      <td className="max-w-64 truncate px-3 py-2 text-slate-300">
                        {display.fullAccountName}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300">
                        {display.accountNumber}
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap text-slate-50">
                        {display.balance}
                      </td>
                      <td
                        className="px-2 py-1 text-right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <AccountActionMenu
                          accountId={account.id}
                          onEditAccount={onEditAccount}
                          onDeleteAccount={onDeleteAccount}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
