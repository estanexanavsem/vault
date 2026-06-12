export interface Account {
  id: number
  login: string
  holder_name: string
  account_name: string
  full_account_name: string
  account_number: string
  routing_number: string
  email: string
  phone: string
  balance: number
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

export interface AccountFile {
  id: number
  account_id: number
  name: string
  type: string
  size: number
  description: string
  created_at: string
}
