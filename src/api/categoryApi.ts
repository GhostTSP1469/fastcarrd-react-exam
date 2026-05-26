import { axiosRequest } from '../utils/token'
import type { ApiResponse } from './types'

export type Category = {
  id: number
  categoryImage: string | null
  categoryName: string
}

export async function getCategories() {
  const { data } = await axiosRequest.get<ApiResponse<Category[]>>(
    '/Category/get-categories',
  )

  return data
}

export async function addCategory(formData: FormData) {
  const { data } = await axiosRequest.post<ApiResponse<Category>>(
    '/Category/add-category',
    formData,
  )

  return data
}

export async function updateCategory(formData: FormData) {
  const { data } = await axiosRequest.put<ApiResponse<Category>>(
    '/Category/update-category',
    formData,
  )

  return data
}

export async function deleteCategory(id: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/Category/delete-category',
    { params: { id } },
  )

  return data
}
