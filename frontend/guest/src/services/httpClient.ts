import axios, { type AxiosResponse } from 'axios'

export const httpClient = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
  },
  timeout: 15_000,
  transitional: {
    clarifyTimeoutError: true,
  },
  withCredentials: true,
})

export const readResponse = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  const response = await request
  return response.data
}
