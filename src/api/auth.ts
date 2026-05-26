import { axiosRequest } from '../utils/token'
import type { ApiResponse } from './types'

export type LoginRequest = {
  userName: string
  password: string
}

export type RegisterRequest = {
  userName: string
  phoneNumber: string
  email: string
  password: string
  confirmPassword: string
}

export async function loginAccount(payload: LoginRequest) {
  const { data } = await axiosRequest.post<ApiResponse<string>>(
    '/Account/login',
    payload,
  )

  return data
}

export async function registerAccount(payload: RegisterRequest) {
  const { data } = await axiosRequest.post<ApiResponse<string>>(
    '/Account/register',
    payload,
  )

  return data
}
