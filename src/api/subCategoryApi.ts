import { axiosRequest } from '../utils/token'
import type { ApiResponse } from './types'

export type SubCategoryItem = {
  id: number
  categoryId: number
  subCategoryName: string
}

export async function getSubCategories(categoryId: number) {
  const { data } = await axiosRequest.get<ApiResponse<SubCategoryItem[]>>(
    '/SubCategory/get-sub-category',
    { params: { id: categoryId } },
  )

  return data
}

export async function addSubCategory(categoryId: number, subCategoryName: string) {
  const { data } = await axiosRequest.post<ApiResponse<SubCategoryItem>>(
    '/SubCategory/add-sub-category',
    { categoryId, subCategoryName },
  )

  return data
}

export async function updateSubCategory(id: number, subCategoryName: string) {
  const { data } = await axiosRequest.put<ApiResponse<SubCategoryItem>>(
    '/SubCategory/update-sub-category',
    { id, subCategoryName },
  )

  return data
}

export async function deleteSubCategory(id: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/SubCategory/delete-sub-category',
    { params: { id } },
  )

  return data
}
