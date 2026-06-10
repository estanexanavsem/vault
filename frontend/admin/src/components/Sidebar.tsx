import { ActionIcon, Tooltip } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { LayoutGrid, Settings, LogOut } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

function Sidebar() {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  const handleLogout = async () => {
    await authService.logout().catch(() => undefined)
    queryClient.clear()
    setAuthenticated(false)
  }

  return (
    <div className="flex w-14 shrink-0 flex-col items-center justify-between border-r border-slate-800 bg-slate-950 py-4">
      <div>
        <Tooltip label="Аккаунты" position="right">
          <ActionIcon
            variant="transparent"
            color="blue"
            size="lg"
            className="!text-slate-100 hover:!bg-slate-800"
          >
            <LayoutGrid size={20} strokeWidth={2.2} />
          </ActionIcon>
        </Tooltip>
      </div>

      <div className="flex flex-col gap-2">
        <Tooltip label="Настройки" position="right">
          <ActionIcon
            variant="transparent"
            color="blue"
            size="lg"
            className="!text-slate-100 hover:!bg-slate-800"
          >
            <Settings size={20} strokeWidth={2.2} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Выйти" position="right">
          <ActionIcon
            variant="transparent"
            color="blue"
            size="lg"
            onClick={() => void handleLogout()}
            className="!text-slate-100 hover:!bg-slate-800"
          >
            <LogOut size={20} strokeWidth={2.2} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  )
}

export default Sidebar
