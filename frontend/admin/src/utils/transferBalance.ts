import type { Transfer } from '../types'

export const getTransferBalance = (transfers: Transfer[]) =>
  transfers.reduce((total, transfer) => total + transfer.amount, 0)

export const getAccountTransferBalance = (transfers: Transfer[], accountId: number) =>
  getTransferBalance(transfers.filter((transfer) => transfer.account_id === accountId))
