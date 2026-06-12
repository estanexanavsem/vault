import { ActionIcon, Menu } from '@mantine/core'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

interface FileActionMenuProps {
  fileId: number
  onEditFile: (id: number) => void
  onDeleteFile: (id: number) => void
}

export function FileActionMenu({ fileId, onEditFile, onDeleteFile }: FileActionMenuProps) {
  return (
    <Menu withinPortal position="bottom-end" shadow="md">
      <Menu.Target>
        <ActionIcon
          aria-label="Действия файла"
          variant="subtle"
          color="gray"
          className="!h-9 !w-9 !text-slate-300 hover:!bg-slate-800"
          onClick={(event) => event.stopPropagation()}
        >
          <MoreVertical size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<Pencil size={14} />}
          onClick={(event) => {
            event.stopPropagation()
            onEditFile(fileId)
          }}
        >
          Редактировать
        </Menu.Item>
        <Menu.Item
          color="red"
          leftSection={<Trash2 size={14} />}
          onClick={(event) => {
            event.stopPropagation()
            onDeleteFile(fileId)
          }}
        >
          Удалить
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
