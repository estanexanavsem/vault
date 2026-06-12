import { useMainPanelController } from '../hooks/useMainPanelController'
import { PanelDialogs } from './PanelDialogs'
import { PanelWorkspace } from './PanelWorkspace'

export function MainPanel() {
  const { workspace, dialogs } = useMainPanelController()

  return (
    <div className="flex h-full min-w-0 flex-col p-2 sm:p-6">
      <PanelWorkspace {...workspace} />

      <PanelDialogs {...dialogs} />
    </div>
  )
}
