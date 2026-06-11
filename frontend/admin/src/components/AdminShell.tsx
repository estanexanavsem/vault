import { MainPanel } from './MainPanel'
import { Sidebar } from './Sidebar'

export function AdminShell() {
  return (
    <div className="flex h-dvh min-w-0 flex-col bg-slate-950 text-slate-100 sm:flex-row">
      <Sidebar />
      <main className="order-1 min-h-0 min-w-0 flex-1 overflow-hidden sm:order-2">
        <MainPanel />
      </main>
    </div>
  )
}
