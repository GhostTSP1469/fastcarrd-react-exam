import { axiosRequest } from '../utils/token'
import type { ApiResponse, PageInfo, PaginationParams } from './types'

export type Brand = {
  id: number
  brandName: string
}

export type BrandsPageData = PageInfo & {
  brands: Brand[]
}

export async function getBrands(params?: PaginationParams) {
  const { data } = await axiosRequest.get<ApiResponse<BrandsPageData>>(
    '/Brand/get-brands',
    { params },
  )

  return data
}

export async function addBrand(brandName: string) {
  const { data } = await axiosRequest.post<ApiResponse<Brand>>(
    '/Brand/add-brand',
    { brandName },
  )

  return data
}

export async function updateBrand(id: number, brandName: string) {
  const { data } = await axiosRequest.put<ApiResponse<Brand>>(
    '/Brand/update-brand',
    { id, brandName },
  )

  return data
}

export async function deleteBrand(id: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/Brand/delete-brand',
    { params: { id } },
  )

  return data
}
