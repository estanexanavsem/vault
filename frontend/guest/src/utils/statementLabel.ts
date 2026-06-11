import type { GuestFile } from '../types/guest'

export const getStatementLabel = (files: GuestFile[]) =>
  files.length === 0 ? 'Statements' : `Statements (${files.length})`
