import { axiosRequest } from '../utils/token'
import type { ApiResponse, PageInfo, PaginationParams } from './types'

export type Product = {
  id: number
  productName: string
  code?: string | null
  description?: string | null
  price: number
  discountPrice?: number | null
  hasDiscount?: boolean
  quantity?: number | null
  weight?: string | null
  size?: string | null
  image?: string | null
  images?: string[]
  rating?: number
  brandId?: number | null
  colorId?: number | null
  subCategoryId?: number | null
  categoryId?: number | null
  categoryName?: string | null
  brand?: {
    id: number
    brandName: string
  }
  color?: {
    id: number
    colorName: string
  }
  subCategory?: {
    id: number
    subCategoryName: string
    categoryId: number
  }
}

export type ProductsPageData = PageInfo & {
  products: Product[]
}

export type GetProductsParams = PaginationParams & {
  ProductName?: string
  MinPrice?: number
  MaxPrice?: number
  BrandId?: number
  ColorId?: number
  CategoryId?: number
  SubcategoryId?: number
}

export type ProductPayload = {
  Id?: number
  ProductName: string
  Code?: string
  Description?: string
  Price: number
  DiscountPrice?: number
  HasDiscount?: boolean
  Quantity?: number
  Weight?: string
  Size?: string
  BrandId?: number
  ColorId?: number
  SubCategoryId?: number
}

export type UpdateProductPayload = {
  Id: number
  ProductName?: string
  Code?: string
  Description?: string
  Price?: number
  DiscountPrice?: number
  HasDiscount?: boolean
  Quantity?: number
  Weight?: string
  Size?: string
  BrandId?: number
  ColorId?: number
  SubCategoryId?: number
}

export async function getProducts(params?: GetProductsParams) {
  const { data } = await axiosRequest.get<ApiResponse<ProductsPageData>>(
    '/Product/get-products',
    { params },
  )

  return data
}

export async function getProductById(id: number) {
  const { data } = await axiosRequest.get<ApiResponse<Product>>(
    '/Product/get-product-by-id',
    { params: { id } },
  )

  return data
}

export async function addProduct(formData: FormData) {
  const { data } = await axiosRequest.post<ApiResponse<Product>>(
    '/Product/add-product',
    formData,
  )

  return data
}

export async function updateProduct(payload: UpdateProductPayload) {
  const { data } = await axiosRequest.put<ApiResponse<Product>>(
    '/Product/update-product',
    payload,
  )

  return data
}

export async function deleteProduct(id: number) {
  const { data } = await axiosRequest.delete<ApiResponse<null>>(
    '/Product/delete-product',
    { params: { id } },
  )

  return data
}
