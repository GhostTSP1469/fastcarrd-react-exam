import type {
  ApiResponse,
  Brand,
  BrandsData,
  Category,
  Color,
  Product,
  ProductsData,
  Role,
  SubCategory,
  UsersData,
} from '../types'
import { getToken } from '../utils/auth'

const apiUrl = import.meta.env.VITE_API_URL

type ApiOptions = {
  method?: string
  body?: BodyInit | string
  headers?: { [key: string]: string }
}

async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const token = getToken()
  const headers = options.headers ?? {}

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: options.method ?? 'GET',
    body: options.body,
    headers,
  })

  if (!response.ok) {
    let message = 'Request failed'

    try {
      const error = await response.json()
      message = error.message ?? error.errors?.[0] ?? message
    } catch {
      message = response.statusText
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export async function loginAdmin(userName: string, password: string) {
  return apiRequest<ApiResponse<string>>('/Account/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  })
}

export async function getProducts() {
  return apiRequest<ApiResponse<ProductsData>>('/Product/get-products?PageNumber=1&PageSize=100')
}

export async function addProduct(formData: FormData) {
  return apiRequest<ApiResponse<Product>>('/Product/add-product', {
    method: 'POST',
    body: formData,
  })
}

export async function updateProduct(payload: {
  Id: number
  ProductName?: string
  Description?: string
  Price?: number
  Quantity?: number
  BrandId?: number
  ColorId?: number
  SubCategoryId?: number
  Code?: string
  Weight?: string
  Size?: string
  HasDiscount?: boolean
  DiscountPrice?: number
}) {
  return apiRequest<ApiResponse<Product>>('/Product/update-product', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function deleteProduct(id: number) {
  return apiRequest<ApiResponse<null>>(`/Product/delete-product?id=${id}`, {
    method: 'DELETE',
  })
}

export async function getBrands() {
  return apiRequest<ApiResponse<BrandsData>>('/Brand/get-brands?PageNumber=1&PageSize=100')
}

export async function addBrand(brandName: string) {
  return apiRequest<ApiResponse<Brand>>('/Brand/add-brand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brandName }),
  })
}

export async function updateBrand(id: number, brandName: string) {
  return apiRequest<ApiResponse<Brand>>('/Brand/update-brand', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, brandName }),
  })
}

export async function deleteBrand(id: number) {
  return apiRequest<ApiResponse<null>>(`/Brand/delete-brand?id=${id}`, {
    method: 'DELETE',
  })
}

export async function getCategories() {
  return apiRequest<ApiResponse<Category[]>>('/Category/get-categories')
}

export async function addCategory(formData: FormData) {
  return apiRequest<ApiResponse<Category>>('/Category/add-category', {
    method: 'POST',
    body: formData,
  })
}

export async function updateCategory(formData: FormData) {
  return apiRequest<ApiResponse<Category>>('/Category/update-category', {
    method: 'PUT',
    body: formData,
  })
}

export async function deleteCategory(id: number) {
  return apiRequest<ApiResponse<null>>(`/Category/delete-category?id=${id}`, {
    method: 'DELETE',
  })
}

export async function getColors() {
  return apiRequest<ApiResponse<Color[]>>('/Color/get-colors')
}

export async function addColor(colorName: string) {
  return apiRequest<ApiResponse<Color>>('/Color/add-color', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ colorName }),
  })
}

export async function getSubCategories(categoryId: number) {
  return apiRequest<ApiResponse<SubCategory[]>>(`/SubCategory/get-sub-category?id=${categoryId}`)
}

export async function addSubCategory(categoryId: number, subCategoryName: string) {
  return apiRequest<ApiResponse<SubCategory>>('/SubCategory/add-sub-category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryId, subCategoryName }),
  })
}

export async function getUsers() {
  return apiRequest<ApiResponse<UsersData>>('/UserProfile/get-user-profiles?PageNumber=1&PageSize=100')
}

export async function getRoles() {
  return apiRequest<ApiResponse<Role[]>>('/UserProfile/get-user-roles')
}

export async function addRoleToUser(userId: number, roleId: number) {
  return apiRequest<ApiResponse<null>>('/UserProfile/addrole-from-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, roleId }),
  })
}

export async function removeRoleFromUser(userId: number, roleId: number) {
  return apiRequest<ApiResponse<null>>(
    `/UserProfile/remove-role-from-user?UserId=${userId}&RoleId=${roleId}`,
    { method: 'DELETE' },
  )
}

export async function deleteUser(id: number) {
  return apiRequest<ApiResponse<null>>(`/UserProfile/delete-user?id=${id}`, {
    method: 'DELETE',
  })
}
