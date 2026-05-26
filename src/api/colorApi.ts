import { axiosRequest } from '../utils/token'
import type { ApiResponse } from './types'

export type Color = {
  id: number
  colorName: string
}

export async function getColors() {
  const { data } = await axiosRequest.get<ApiResponse<Color[]>>(
    '/Color/get-colors',
  )

  return data
}

export async function addColor(colorName: string) {
  const { data } = await axiosRequest.post<ApiResponse<Color>>(
    '/Color/add-color',
    { colorName },
  )

  return data
}

export async function updateColor(id: number, colorName: string) {
  const { data } = await axiosRequest.put<ApiResponse<Color>>(
    '/Color/update-color',
    { id, colorName },
  )

  return data
}

export async function deleteColor(id: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/Color/delete-color',
    { params: { id } },
  )

  return data
}
