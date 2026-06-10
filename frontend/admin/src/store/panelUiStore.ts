import { create } from 'zustand'

interface PanelUiState {
  selectedAccountId: number | null
  selectAccount: (id: number | null) => void
}

export const usePanelUiStore = create<PanelUiState>((set) => ({
  selectedAccountId: null,
  selectAccount: (id) => set({ selectedAccountId: id }),
}))
