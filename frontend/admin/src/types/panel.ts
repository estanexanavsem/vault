export type Entity = 'account' | 'transfer' | 'file'

export interface SelectOption {
  value: string
  label: string
}

export interface FormDialogState {
  entity: Entity
  mode: 'create' | 'edit'
}

export type FormDialog = FormDialogState | null
