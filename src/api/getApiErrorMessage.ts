import axios from 'axios'
import type { ApiResponse } from './types'

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    const responseData = error.response?.data

    if (responseData?.errors?.length) {
      return responseData.errors[0]
    }

    if (responseData?.message) {
      return responseData.message
    }

    if (responseData?.error) {
      return responseData.error
    }

    if (typeof responseData?.data === 'string') {
      return responseData.data
    }

    return error.message
  }

  return 'Something went wrong. Please try again.'
}
