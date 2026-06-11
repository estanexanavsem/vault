import { ActionIcon, Tooltip } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { LayoutGrid, Settings, LogOut } from 'lucide-react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export function Sidebar() {
  const queryClient = useQueryClient()
  const setAuthenticated = useAuthStore((s) => s.setAuthenticated)

  const handleLogout = async () => {
    await authService.logout().catch(() => undefined)
    queryClient.clear()
    setAuthenticated(false)
  }

  return (
    <div className="order-2 flex h-16 shrink-0 items-center justify-between border-t border-slate-800 bg-slate-950 px-3 py-2 sm:order-1 sm:h-auto sm:w-14 sm:flex-col sm:border-t-0 sm:border-r sm:px-0 sm:py-4">
      <div>
        <Tooltip label="Аккаунты" position="right">
          <ActionIcon
            aria-label="Аккаунты"
            variant="transparent"
            color="blue"
            size="lg"
            className="!h-11 !w-11 !text-slate-100 hover:!bg-slate-800"
          >
            <LayoutGrid size={20} strokeWidth={2.2} />
          </ActionIcon>
        </Tooltip>
      </div>

      <div className="flex gap-2 sm:flex-col">
        <Tooltip label="Настройки" position="right">
          <ActionIcon
            aria-label="Настройки"
            variant="transparent"
            color="blue"
            size="lg"
            className="!h-11 !w-11 !text-slate-100 hover:!bg-slate-800"
          >
            <Settings size={20} strokeWidth={2.2} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Выйти" position="right">
          <ActionIcon
            aria-label="Выйти"
            variant="transparent"
            color="blue"
            size="lg"
            onClick={() => void handleLogout()}
            className="!h-11 !w-11 !text-slate-100 hover:!bg-slate-800"
          >
            <LogOut size={20} strokeWidth={2.2} />
          </ActionIcon>
        </Tooltip>
      </div>
    </div>
  )
}
