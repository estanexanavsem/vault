export interface GuestData {
  master: MasterAccount
  transfers: Transfer[]
  files: GuestFile[]
}

export interface MasterAccount {
  id: number
  login: string
  holder_name: string
  account_name: string
  full_account_name: string
  account_number: string
  routing_number: string
  email: string
  phone: string
  last_sign_in_at?: string
  created_at: string
  updated_at: string
}

export interface Transfer {
  id: number
  account_id: number
  from_account: string
  to_account: string
  amount: number
  description: string
  full_description: string
  category: string
  reference: string
  transfer_type: string
  status: string
  transaction_date: string
  created_at: string
}

export interface GuestFile {
  id: number
  account_id: number
  name: string
  type: string
  size: number
  description: string
  created_at: string
}

export type GuestLoginResponse =
  | {
      data: GuestData
      expires_at?: string
      success: true
    }
  | {
      error?: string
      success: false
    }

export type GuestSessionResponse =
  | (GuestData & {
      success: true
    })
  | {
      error?: string
      success: false
    }

export type GuestProfileUpdateResponse =
  | {
      master: MasterAccount
      success: true
    }
  | {
      error?: string
      success: false
    }

export interface GuestLogoutResponse {
  success: boolean
}

export interface ApiErrorResponse {
  error?: string
}
