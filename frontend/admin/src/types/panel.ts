export type Entity = 'account' | 'transfer' | 'file'
export type FormDialog = { entity: Entity; mode: 'create' | 'edit' } | null
