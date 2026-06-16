import type { Transfer } from '../types/guest'

export const getTransferBalance = (transfers: Transfer[]) =>
  transfers.reduce((total, transfer) => total + transfer.amount, 0)
