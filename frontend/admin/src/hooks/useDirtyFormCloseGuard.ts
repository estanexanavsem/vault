import { useState } from 'react'

interface UseDirtyFormCloseGuardParams {
  isDirty: boolean
  onClose: () => void
}

interface UseDirtyFormCloseGuardResult {
  confirmCloseOpened: boolean
  closeConfirmDialog: () => void
  confirmClose: () => void
  requestClose: () => void
}

export function useDirtyFormCloseGuard({
  isDirty,
  onClose,
}: UseDirtyFormCloseGuardParams): UseDirtyFormCloseGuardResult {
  const [confirmCloseOpened, setConfirmCloseOpened] = useState(false)

  const requestClose = () => {
    if (isDirty) {
      setConfirmCloseOpened(true)
      return
    }

    onClose()
  }

  const closeConfirmDialog = () => {
    setConfirmCloseOpened(false)
  }

  const confirmClose = () => {
    setConfirmCloseOpened(false)
    onClose()
  }

  return {
    confirmCloseOpened,
    closeConfirmDialog,
    confirmClose,
    requestClose,
  }
}
