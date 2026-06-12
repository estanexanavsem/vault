export type Entity = 'account' | 'transfer' | 'file'

export interface FormDialogState {
  entity: Entity
  mode: 'create' | 'edit'
}

export type FormDialog = FormDialogState | null
