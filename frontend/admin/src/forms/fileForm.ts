import { z } from 'zod'

export const fileSchema = z.object({
  file: z.custom<File | null>().nullable(),
  name: z.string(),
  type: z.string(),
  description: z.string(),
})

export type FileFormInput = z.input<typeof fileSchema>
export type FileFormValues = z.output<typeof fileSchema>

export const defaultFileValues: FileFormInput = {
  file: null,
  name: '',
  type: '',
  description: '',
}
