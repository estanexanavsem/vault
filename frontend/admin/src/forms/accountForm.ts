import { z } from 'zod'
import { numberFromInput } from './formValue'

export const accountSchema = z.object({
  login: z.string().trim().min(1, 'Логин обязателен'),
  password: z.string(),
  holder_name: z.string(),
  account_name: z.string(),
  full_account_name: z.string(),
  account_number: z.string(),
  routing_number: z.string(),
  email: z.string(),
  phone: z.string(),
  balance: numberFromInput,
})

export type AccountFormInput = z.input<typeof accountSchema>
export type AccountFormValues = z.output<typeof accountSchema>

export const defaultAccountValues: AccountFormInput = {
  login: '',
  password: '',
  holder_name: '',
  account_name: '',
  full_account_name: '',
  account_number: '',
  routing_number: '',
  email: '',
  phone: '',
  balance: 0,
}
