import { z } from 'zod'
import { numberFromInput } from './formValue'

export const transferSchema = z.object({
  amount: numberFromInput,
  description: z.string(),
  full_description: z.string(),
  category: z.string(),
  reference: z.string(),
  transfer_type: z.string(),
  transaction_date: z
    .string()
    .refine(
      (value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Дата должна быть в формате yyyy-mm-dd',
    ),
})

export type TransferFormInput = z.input<typeof transferSchema>
export type TransferFormValues = z.output<typeof transferSchema>

export const defaultTransferValues: TransferFormInput = {
  amount: 0,
  description: '',
  full_description: '',
  category: '',
  reference: '',
  transfer_type: '',
  transaction_date: '',
}

export const toDateInputValue = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return localDate.toISOString().slice(0, 10)
}

export const toApiDate = (value: string) => (value ? new Date(value).toISOString() : undefined)
