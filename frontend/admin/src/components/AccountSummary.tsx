import { Button } from '@mantine/core'
import { Pencil, Trash2 } from 'lucide-react'
import type { Account } from '../types'
import type { DetailRow } from '../utils/panelWorkspace'

interface AccountSummaryProps {
  account: Account | null
  accountFacts: DetailRow[]
  balance: string
  onEditAccount: (id: number) => void
  onDeleteAccount: (id: number) => void
}

export function AccountSummary({
  account,
  accountFacts,
  balance,
  onEditAccount,
  onDeleteAccount,
}: AccountSummaryProps) {
  return (
    <section className="border-b border-slate-800 p-3 sm:p-4">
      {account ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
          <div className="min-w-0">
            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  Выбранный аккаунт
                </p>
                <h2 className="mt-1 text-2xl font-semibold break-words text-slate-50">
                  {account.login}
                </h2>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                  Баланс
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-50">{balance}</p>
              </div>
            </div>

            {accountFacts.length > 0 && (
              <dl className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                {accountFacts.map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-md border border-slate-800 bg-slate-950/35 px-3 py-2"
                  >
                    <dt className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1 min-w-0 text-sm break-words text-slate-200">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row xl:flex-col">
            <Button
              leftSection={<Pencil size={14} />}
              variant="light"
              color="blue"
              size="sm"
              className="!h-10"
              onClick={() => onEditAccount(account.id)}
            >
              Редактировать
            </Button>
            <Button
              leftSection={<Trash2 size={14} />}
              variant="subtle"
              color="red"
              size="sm"
              className="!h-10"
              onClick={() => onDeleteAccount(account.id)}
            >
              Удалить
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-slate-700 bg-slate-950/35 p-4">
          <h2 className="text-lg font-medium text-slate-50">Аккаунт не выбран</h2>
          <p className="mt-1 text-sm text-slate-400">
            Создайте аккаунт или выберите существующий, чтобы увидеть переводы и файлы.
          </p>
        </div>
      )}
    </section>
  )
}
