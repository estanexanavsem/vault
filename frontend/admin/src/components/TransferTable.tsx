import type { Transfer } from '../types'
import { filterTransfersByAccount, getTransferDisplayData } from '../utils/panelTableData'
import { TransferActionMenu } from './TransferActionMenu'

interface TransferTableProps {
  transfers: Transfer[]
  selectedAccountId: number | null
  selectedTransferId: number | null
  isLoading: boolean
  error: Error | null
  onSelectTransfer: (id: number) => void
  onEditTransfer: (id: number) => void
  onDeleteTransfer: (id: number) => void
}

export function TransferTable({
  transfers,
  selectedAccountId,
  selectedTransferId,
  isLoading,
  error,
  onSelectTransfer,
  onEditTransfer,
  onDeleteTransfer,
}: TransferTableProps) {
  if (!selectedAccountId) {
    return <p className="text-sm text-slate-400">Выберите аккаунт, чтобы посмотреть переводы</p>
  }

  if (isLoading) {
    return <p className="text-sm text-slate-400">Загрузка переводов...</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">Не удалось загрузить переводы: {error.message}</p>
  }

  const filteredTransfers = filterTransfersByAccount(transfers, selectedAccountId)

  return (
    <div className="min-w-0" id="transfer-table">
      {filteredTransfers.length === 0 ? (
        <p className="text-sm text-slate-400">Для этого аккаунта переводов нет</p>
      ) : (
        <>
          <div className="space-y-2 sm:hidden">
            {filteredTransfers.map((transfer) => {
              const isSelected = selectedTransferId === transfer.id
              const display = getTransferDisplayData(transfer)

              return (
                <div
                  key={transfer.id}
                  className={
                    isSelected
                      ? 'flex w-full cursor-pointer items-start gap-2 rounded-lg border border-blue-500/50 bg-blue-950/50 p-3 text-left'
                      : 'flex w-full cursor-pointer items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/45 p-3 text-left transition-colors hover:border-slate-700 hover:bg-slate-900'
                  }
                  onClick={() => onSelectTransfer(transfer.id)}
                >
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    className="min-w-0 flex-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                    onClick={() => onSelectTransfer(transfer.id)}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-xs font-medium text-slate-400">{display.date}</span>
                      <span className="shrink-0 text-sm font-semibold text-slate-50">
                        {display.amount}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm break-words text-slate-200">
                      {display.mobileDescription}
                    </span>
                  </button>
                  <div className="-mt-1 -mr-1 shrink-0" onClick={(event) => event.stopPropagation()}>
                    <TransferActionMenu
                      transferId={transfer.id}
                      onEditTransfer={onEditTransfer}
                      onDeleteTransfer={onDeleteTransfer}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[600px] border-separate border-spacing-0 text-left text-sm">
              <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="px-3 py-2 font-semibold">Дата</th>
                  <th className="px-3 py-2 font-semibold">Описание</th>
                  <th className="px-3 py-2 text-right font-semibold">Сумма</th>
                  <th className="w-12 px-2 py-2 font-semibold" aria-label="Действия" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTransfers.map((transfer) => {
                  const display = getTransferDisplayData(transfer)

                  return (
                    <tr
                      key={transfer.id}
                      onClick={() => onSelectTransfer(transfer.id)}
                      className={
                        selectedTransferId === transfer.id
                          ? 'cursor-pointer bg-blue-950/50'
                          : 'cursor-pointer hover:bg-slate-800/70'
                      }
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-slate-300">{display.date}</td>
                      <td className="max-w-80 truncate px-3 py-2 text-slate-300">
                        <button
                          type="button"
                          aria-pressed={selectedTransferId === transfer.id}
                          className="w-full truncate text-left outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70"
                          onClick={() => onSelectTransfer(transfer.id)}
                        >
                          {display.description}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap text-slate-50">
                        {display.amount}
                      </td>
                      <td
                        className="px-2 py-1 text-right"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <TransferActionMenu
                          transferId={transfer.id}
                          onEditTransfer={onEditTransfer}
                          onDeleteTransfer={onDeleteTransfer}
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
