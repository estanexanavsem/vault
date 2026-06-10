import type { AccountFile } from '../types'
import { httpClient, readResponse } from './httpClient'

export interface UploadFilePayload {
  account_id: number
  file: File
  description?: string
}

export interface UpdateFilePayload {
  account_id?: number
  name?: string
  type?: string
  description?: string
}

export const fileService = {
  getFiles: (): Promise<AccountFile[]> => readResponse(httpClient.get<AccountFile[]>('/files')),

  getFile: (id: number): Promise<Blob> =>
    readResponse(httpClient.get<Blob>(`/files/${id}`, { responseType: 'blob' })),

  uploadFile: ({ account_id, file, description }: UploadFilePayload): Promise<AccountFile> => {
    const formData = new FormData()
    formData.append('account_id', String(account_id))
    formData.append('file', file)
    if (description !== undefined) {
      formData.append('description', description)
    }

    return readResponse(httpClient.post<AccountFile>('/files', formData))
  },

  updateFile: (id: number, file: UpdateFilePayload): Promise<AccountFile> =>
    readResponse(httpClient.put<AccountFile>(`/files/${id}`, file)),

  deleteFile: async (id: number): Promise<void> => {
    await httpClient.delete(`/files/${id}`)
  },
}
