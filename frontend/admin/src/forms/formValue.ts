import { z } from 'zod'

export const numberFromInput = z
  .union([z.number(), z.string()])
  .transform((value) => (value === '' ? 0 : Number(value)))
  .refine((value) => Number.isFinite(value), 'Введите корректное число')

export const optionalText = (value: string) => value.trim() || undefined
