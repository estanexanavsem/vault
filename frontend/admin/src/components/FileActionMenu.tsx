import { EntityActionMenu } from './EntityActionMenu'

interface FileActionMenuProps {
  fileId: number
  onEditFile: (id: number) => void
  onDeleteFile: (id: number) => void
}

export function FileActionMenu({ fileId, onEditFile, onDeleteFile }: FileActionMenuProps) {
  return (
    <EntityActionMenu
      ariaLabel="Действия файла"
      entityId={fileId}
      onEdit={onEditFile}
      onDelete={onDeleteFile}
    />
  )
}
