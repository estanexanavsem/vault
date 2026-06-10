import Sidebar from './Sidebar'
import MainPanel from './MainPanel'

function AdminShell() {
  return (
    <div className="flex h-screen min-w-0 bg-slate-950 text-slate-100">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-hidden">
        <MainPanel />
      </main>
    </div>
  )
}

export default AdminShell
