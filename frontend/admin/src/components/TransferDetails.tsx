import type { Transfer } from '../types'
import { formatCurrency } from '../utils/formatters'
import { getTransferDetails } from '../utils/panelWorkspace'
import { DetailGrid } from './DetailGrid'

interface TransferDetailsProps {
  transfer: Transfer | null
}

export function TransferDetails({ transfer }: TransferDetailsProps) {
  if (!transfer) {
    return (
      <section className="mt-4 rounded-md border border-dashed border-slate-800 bg-slate-950/25 p-4">
        <p className="text-sm font-medium text-slate-200">Перевод не выбран</p>
        <p className="mt-1 text-sm text-slate-400">
          Выберите строку в таблице, чтобы посмотреть полное описание и реквизиты перевода.
        </p>
      </section>
    )
  }

  const rows = getTransferDetails(transfer)

  return (
    <section className="mt-4 overflow-hidden rounded-md border border-slate-800 bg-slate-950/25">
      <div className="border-b border-slate-800 px-3 py-3 sm:px-4">
        <p className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
          Выбранный перевод
        </p>
        <div className="mt-1 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <h3 className="min-w-0 text-base font-semibold break-words text-slate-50">
            {transfer.description || 'Описание не указано'}
          </h3>
          <p className="shrink-0 text-lg font-semibold text-slate-50">
            {formatCurrency(transfer.amount)}
          </p>
        </div>
      </div>

      <DetailGrid rows={rows} className="grid text-sm sm:grid-cols-2 xl:grid-cols-3" />
    </section>
  )
}
