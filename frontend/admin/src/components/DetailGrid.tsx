import type { DetailRow } from '../utils/panelWorkspace'

interface DetailGridProps {
  rows: DetailRow[]
  className?: string
}

function DetailGrid({ rows, className = '' }: DetailGridProps) {
  if (rows.length === 0) {
    return null
  }

  return (
    <dl className={className}>
      {rows.map(([label, value]) => (
        <div key={label} className="min-w-0 border-b border-slate-800 px-3 py-3 sm:px-4">
          <dt className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
            {label}
          </dt>
          <dd className="mt-1 min-w-0 break-words text-slate-200">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default DetailGrid
