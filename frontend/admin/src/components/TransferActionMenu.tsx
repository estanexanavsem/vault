import { EntityActionMenu } from './EntityActionMenu'

interface TransferActionMenuProps {
  transferId: number
  onEditTransfer: (id: number) => void
  onDeleteTransfer: (id: number) => void
}

export function TransferActionMenu({
  transferId,
  onEditTransfer,
  onDeleteTransfer,
}: TransferActionMenuProps) {
  return (
    <EntityActionMenu
      ariaLabel="Действия перевода"
      entityId={transferId}
      onEdit={onEditTransfer}
      onDelete={onDeleteTransfer}
    />
  )
}
